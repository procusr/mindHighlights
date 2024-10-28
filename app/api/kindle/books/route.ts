import { NextResponse } from "next/server"
import puppeteer from "puppeteer"
import * as cheerio from "cheerio"
import type { KindleBook } from "@/types/kindle"
import { randomUUID } from "node:crypto"
import moment from "moment"

// Helper function to parse Amazon date string
const parseToDateString = (kindleDate: string): string => {
  // Remove day of week if present
  const amazonDateString = kindleDate.includes(" ")
    ? kindleDate.substr(kindleDate.indexOf(" ") + 1)
    : kindleDate

  return moment(amazonDateString, "MMMM D, YYYY").toISOString()
}

// Helper function to parse author (remove "By: " prefix)
const parseAuthor = (scrapedAuthor: string): string => {
  return scrapedAuthor.replace(/.*: /, "")?.trim()
}

export async function GET() {
  let browser = null
  try {
    console.log("Starting browser...")
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      args: ["--start-maximized", "--no-sandbox"],
    })

    const page = await browser.newPage()

    // Enable request interception
    await page.setRequestInterception(true)
    page.on("request", (request) => {
      // Only allow document and script requests
      const resourceType = request.resourceType()
      if (resourceType === "document" || resourceType === "script") {
        request.continue()
      } else {
        request.abort()
      }
    })

    console.log("Navigating to Amazon...")
    await page.goto("https://read.amazon.com/notebook", {
      waitUntil: "networkidle0",
      timeout: 60000,
    })

    // Check if we're on the login page
    const isLoginPage = await page.evaluate(() => {
      return window.location.href.includes("signin")
    })

    if (isLoginPage) {
      console.log("Login required. Waiting for user to log in...")
      await page.evaluate(() => {
        const div = document.createElement("div")
        div.style.cssText = `
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: black;
          color: white;
          padding: 16px;
          border-radius: 8px;
          z-index: 9999;
          font-family: system-ui;
        `
        div.textContent = "Please log in to your Amazon account..."
        document.body.appendChild(div)
      })

      // Wait for successful login
      await Promise.race([
        page.waitForNavigation({ timeout: 300000 }), // 5 minutes
        page.waitForSelector(".kp-notebook-library-each-book", {
          timeout: 300000,
        }),
      ])
    }

    // Wait for the library to load
    console.log("Waiting for library to load...")
    await page.waitForSelector(".kp-notebook-library-each-book", {
      timeout: 30000,
    })

    // Get the page content
    const content = await page.content()
    const $ = cheerio.load(content)

    // Parse books using Cheerio (similar to the plugin's approach)
    const books: KindleBook[] = []
    $(".kp-notebook-library-each-book").each((_, element) => {
      const $book = $(element)

      // Get title from h2 element
      const title = $book.find("h2.kp-notebook-searchable").text()?.trim()

      // Get author from p element
      const scrapedAuthor = $book.find("p.kp-notebook-searchable").text()
      const author = parseAuthor(scrapedAuthor)

      // Get last annotated date
      const scrapedLastAnnotatedDate = $book
        .find('[id^="kp-notebook-annotated-date"]')
        .val()
      const lastHighlightDate = scrapedLastAnnotatedDate
        ? parseToDateString(scrapedLastAnnotatedDate.toString())
        : new Date().toISOString()

      // Get ASIN (Amazon book ID)
      const asin = $book.attr("id") || randomUUID()

      // Get highlight count
      const highlightText = $book.find(".kp-notebook-highlight-count").text()
      const highlightCount = parseInt(
        highlightText.match(/\d+/)?.[0] || "0",
        10
      )

      if (title && author) {
        books.push({
          id: asin,
          title,
          author,
          highlightCount,
          lastHighlightDate,
          asin,
        })
      }
    })

    console.log(`Found ${books.length} books`)

    if (books.length === 0) {
      console.log("No books found, taking screenshot...")
      await page.screenshot({ path: "no-books.png", fullPage: true })
      return NextResponse.json(
        {
          error:
            "No books found. Please make sure you're logged in and have books with highlights.",
          url: page.url(),
        },
        { status: 404 }
      )
    }

    // Sort books by title
    const sortedBooks = books.sort((a, b) => a.title.localeCompare(b.title))

    return NextResponse.json({
      books: sortedBooks,
      summary: {
        totalBooks: sortedBooks.length,
        totalHighlights: sortedBooks.reduce(
          (sum, book) => sum + book.highlightCount,
          0
        ),
        lastUpdated: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Error in book fetching:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch books",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  } finally {
    if (browser) {
      await new Promise((resolve) => setTimeout(resolve, 5000))
      await browser.close()
    }
  }
}
