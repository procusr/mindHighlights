"use server";

import { createClient } from "@/utils/supabase/server";
import OpenAI from "openai";
import type { Content, Folder } from "@/types/types";
import { FOLDER_SEARCH_LIMIT } from "../constants/constants";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORGANIZATION_ID,
  project: process.env.OPENAI_PROJECT_ID,
});

export async function fetchUserFolders({
  userId,
  query,
  page,
}: {
  userId: string;
  query?: string | null;
  page?: string;
}): Promise<{
  folders: Folder[];
  count: number;
}> {
  const supabase = createClient();
  const pageInt = Number(page || "1");

  let foldersQuery = supabase
    .from("user_folders")
    .select("id, name, user_id, created_at", { count: "exact" })
    .eq("user_id", userId)
    .range(0, pageInt * FOLDER_SEARCH_LIMIT - 1);

  if (query && query.trim() !== "") {
    foldersQuery = foldersQuery.ilike("name", `%${query}%`);
  }

  const { data, error, count } = await foldersQuery;
  if (error) throw new Error(error.message);

  return {
    folders: data as Folder[],
    count: count || 0,
  };
}

export async function addNewContent(
  content: string,
  folderId: string,
  title?: string
): Promise<Content> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  let generatedTitle = title;

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
    });

    generatedTitle =
      response.choices[0]?.message?.content?.trim() || content.slice(0, 200);
  }

  const { data, error } = await supabase
    .from("user_content")
    .insert([
      {
        content,
        folder_id: folderId,
        user_id: user.id,
        title: generatedTitle,
      },
    ])
    .select("*")
    .single();

  if (error) throw error;
  return data as Content;
}

export async function updateContent(
  contentId: string,
  title: string,
  content: string,
  folderId: string
) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("user_content")
    .update({ title, content })
    .eq("id", contentId)
    .select();

  if (error) throw new Error(error.message);
  return data[0] as Content;
}

export async function deleteContent(contentId: string, folderId: string) {
  const supabase = createClient();

  const { error } = await supabase
    .from("user_content")
    .delete()
    .eq("id", contentId);

  if (error) throw error;
}

export async function createNewFolder(name: string) {
  if (!name.trim()) return;
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return;
  }

  const { data, error } = await supabase
    .from("user_folders")
    .insert({ name, user_id: user?.id })
    .select();

  if (error) throw new Error(error.message);
  return data[0] as Folder;
}

export async function updateFolder(folderId: string, name: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("user_folders")
    .update({ name })
    .eq("id", folderId)
    .select();

  if (error) throw new Error(error.message);
  return data[0] as Folder;
}

export async function deleteFolder(folderId: string) {
  const supabase = createClient();

  const { error } = await supabase
    .from("user_folders")
    .delete()
    .eq("id", folderId);

  if (error) throw new Error(error.message);
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
  });

  return response.choices[0]?.message?.content?.trim() || "";
}

export async function updateContentAnchor(contentId: string, anchor: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("user_content")
    .update({ anchor })
    .eq("id", contentId)
    .select();

  if (error) throw new Error(error.message);
  return data[0] as Content;
}

export interface ContentResponse {
  items: Content[];
  total: number;
}

export async function fetchContent(
  folderId: string,
  userId: string,
  page = 1,
  searchTerm = "",
  itemsPerPage = 12
): Promise<ContentResponse> {
  const supabase = createClient();
  const offset = (page - 1) * itemsPerPage;

  let query = supabase
    .from("user_content")
    .select("*", { count: "exact" })
    .eq("folder_id", folderId)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (searchTerm) {
    query = query.ilike("content", `%${searchTerm}%`);
  }

  const response = await query;
  const totalCount = response.count ?? 0;

  if (!totalCount) {
    return {
      items: [],
      total: 0,
    };
  }

  const from = offset;
  const to = Math.min(offset + itemsPerPage - 1, totalCount - 1);

  if (from <= to) {
    const { data, error } = await query.range(from, to).limit(itemsPerPage);

    if (error) throw new Error(error.message);

    return {
      items: data as Content[],
      total: totalCount,
    };
  }

  return {
    items: [],
    total: totalCount,
  };
}
