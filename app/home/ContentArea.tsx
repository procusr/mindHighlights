import type React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import AddNewContent from "./AddNewContent"
import ContentList from "./ContentList"
import type { Content } from "@/types/types"

export default function ContentArea({
  selectedFolder,
  contentList,
  setContentList,
  userId,
}: {
  selectedFolder: { id: string; name: string } | null
  contentList: Content[]
  setContentList: React.Dispatch<React.SetStateAction<Content[]>>
  userId: string
}) {
  return (
    <main className="flex-1 p-4 overflow-auto bg-gray-50 w-full">
      <Card className="h-full bg-white shadow-sm">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-xl font-bold text-gray-800">
            {selectedFolder?.name || "Select a folder"}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {selectedFolder && (
            <AddNewContent
              selectedFolder={selectedFolder}
              setContentList={setContentList}
              userId={userId}
              contentList={contentList}
            />
          )}
          <ContentList
            contentList={contentList}
            setContentList={setContentList}
          />
        </CardContent>
      </Card>
    </main>
  )
}
