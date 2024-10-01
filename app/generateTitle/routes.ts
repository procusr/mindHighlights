// biome-ignore lint/style/useImportType: <explanation>
import { NextRequest, NextResponse } from "next/server"
import { openai } from "@/utils/utils"

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json()

    console.log("Generating title question for text:", text)

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini-2024-07-18",

      messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
          role: "user",
          content: `Given the text "${text}", return a title in the form of a question that tests if the user understands the concept.`,
        },
      ],
      max_completion_tokens: 60,
    })

    const titleQuestion = response.choices[0]?.message?.content?.trim()

    return NextResponse.json({ titleQuestion }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    )
  }
}
