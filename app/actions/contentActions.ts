"use server"

import { createClient } from "@/utils/supabase/server"
import OpenAI from "openai"
import type { Content, Folder } from "@/types/types"
import { revalidatePath } from "next/cache"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORGANIZATION_ID,
  project: process.env.OPENAI_PROJECT_ID,
})

export async function addNewContent(
  content: string,
  folderId: string,
  title?: string
) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let generatedTitle = title

  if (!title) {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini-2024-07-18",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
          role: "user",
          content: `Given the statement ${content}, respond with a concise question that critically engages with the main idea.`,
        },
      ],
      max_tokens: 60,
    })

    generatedTitle =
      response.choices[0]?.message?.content?.trim() || content.slice(0, 170)
  }

  const { data, error } = await supabase
    .from("user_content")
    .insert({
      user_id: user?.id,
      folder_id: folderId,
      title: generatedTitle,
      content,
    })
    .select()

  revalidatePath(`/home/${folderId}`)

  if (error) throw new Error(error.message)
  return data[0] as Content
}

export async function updateContent(
  contentId: string,
  title: string,
  content: string,
  folderId: string
) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("user_content")
    .update({ title, content })
    .eq("id", contentId)
    .select()
  revalidatePath(`/home/${folderId}`)

  if (error) throw new Error(error.message)
  return data[0] as Content
}

export async function deleteContent(contentId: string, folderId: string) {
  const supabase = createClient()

  const { error } = await supabase
    .from("user_content")
    .delete()
    .eq("id", contentId)
  revalidatePath(`/home/${folderId}`)

  if (error) throw new Error(error.message)
}

export async function createNewFolder(name: string) {
  if (!name.trim()) return
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return
  }

  const { data, error } = await supabase
    .from("user_folders")
    .insert({ name, user_id: user?.id })
    .select()

  revalidatePath("/home")

  if (error) throw new Error(error.message)
  return data[0] as Folder
}

export async function updateFolder(folderId: string, name: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("user_folders")
    .update({ name })
    .eq("id", folderId)
    .select()

  revalidatePath(`/home/${folderId}`)

  if (error) throw new Error(error.message)
  return data[0] as Folder
}

export async function deleteFolder(folderId: string) {
  const supabase = createClient()

  const { error } = await supabase
    .from("user_folders")
    .delete()
    .eq("id", folderId)

  revalidatePath(`/home/${folderId}`)

  if (error) throw new Error(error.message)
}

export async function generateMemoryAnchor(content: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini-2024-07-18",
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      {
        role: "user",
        content: `Given the statement "${content}", using out of proportion exaggeration and substitution methods of memory to create a memorable phrase or sentence that captures the essence of the statement.`,
      },
    ],
    max_tokens: 60,
  })

  return response.choices[0]?.message?.content?.trim() || ""
}

export async function updateContentAnchor(
  contentId: string,
  anchor: string,
  folderId: string
) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("user_content")
    .update({ anchor })
    .eq("id", contentId)
    .select()

  revalidatePath(`/home/${folderId}`)

  if (error) throw new Error(error.message)
  return data[0] as Content
}
