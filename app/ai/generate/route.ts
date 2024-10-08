import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORGANIZATION_ID,
  project: process.env.OPENAI_PROJECT_ID,
})

export async function POST(req: NextRequest) {
  try {
    const { content } = await req.json()

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini-2024-07-18",

      messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
          role: "user",
          content,
        },
      ],
      max_completion_tokens: 60,
    })

    const generatedResponse = response.choices[0]?.message?.content?.trim()
    console.log("Generated response:", generatedResponse)

    return NextResponse.json({ generatedResponse }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    )
  }
}
