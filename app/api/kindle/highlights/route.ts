import { NextResponse } from "next/server"
import puppeteer from "puppeteer"
import * as cheerio from "cheerio"
import type { KindleHighlight } from "@/types/kindle"
import { writeFile, mkdir } from "node:fs/promises"
import { join } from "node:path"
import { randomUUID } from "node:crypto"

export async function POST(request: Request) {
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()

  try {
    const { bookIds, format = "json" } = await request.json()
    const highlights = await scrapeHighlights(page, bookIds)

    if (format === "txt") {
      const highlightsByBook = highlights.reduce(
        (acc, highlight) => {
          if (!acc[highlight.bookId]) {
            acc[highlight.bookId] = []
          }
          acc[highlight.bookId].push(highlight.text)
          return acc
        },
        {} as Record<string, string[]>
      )

      const highlightsDir = join(process.cwd(), "highlights")
      await mkdir(highlightsDir, { recursive: true })

      for (const [bookId, bookHighlights] of Object.entries(highlightsByBook)) {
        const filePath = join(highlightsDir, `${bookId}.txt`)
        await writeFile(filePath, bookHighlights.join("\n\n"))
      }

      return NextResponse.json({
        message: `Saved highlights to ${highlightsDir}`,
        totalHighlights: highlights.length,
        totalBooks: Object.keys(highlightsByBook).length,
      })
    }

    return NextResponse.json({
      highlights,
      summary: {
        totalHighlights: highlights.length,
        totalBooks: new Set(highlights.map((h) => h.bookId)).size,
        lastUpdated: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Error fetching highlights:", error)
    return NextResponse.json(
      { error: "Failed to fetch highlights" },
      { status: 500 }
    )
  } finally {
    await browser.close()
  }
}

async function scrapeHighlights(
  page: puppeteer.Page,
  bookIds: string[]
): Promise<KindleHighlight[]> {
  const allHighlights: KindleHighlight[] = []

  for (const bookId of bookIds) {
    let hasNextPage = true
    let contentLimitState = ""
    let token = ""

    while (hasNextPage) {
      const url = `https://read.amazon.com/notebook?asin=${bookId}&contentLimitState=${contentLimitState}&token=${token}`

      await page.goto(url, { waitUntil: "networkidle0" })
      const content = await page.content()
      const $ = cheerio.load(content)

      // Get highlights from current page
      $(".a-row.a-spacing-base").each((_, element) => {
        const $highlight = $(element)

        const text = $highlight.find("#highlight").text()?.trim()
        if (!text) return

        const pageMatch = /\d+$/.exec(
          $highlight.find("#annotationNoteHeader").text()
        )
        const location = $highlight.find("#kp-annotation-location").val()
        const note = $highlight
          .find("#note")
          .html()
          ?.replace(/<br\s*\/?>/g, "\n")

        allHighlights.push({
          id: randomUUID(),
          text,
          location: location?.toString() || "",
          page: pageMatch ? pageMatch[0] : undefined,
          note: note || undefined,
          bookId,
          createdAt: new Date().toISOString(),
        })
      })

      // Check for next page
      const nextToken = $(".kp-notebook-annotations-next-page-start").val()
      const nextContentLimitState = $(".kp-notebook-content-limit-state").val()

      if (nextToken && nextContentLimitState) {
        token = nextToken.toString()
        contentLimitState = nextContentLimitState.toString()
      } else {
        hasNextPage = false
      }
    }

    console.log(`Fetched highlights for book ${bookId}`)
  }

  return allHighlights
}
