import { signOutAction } from "@/app/actions"
import { createClient } from "@/utils/supabase/server"
import Link from "next/link"
import { Button } from "./ui/button"
import { Folder } from "lucide-react"

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
  MenubarSeparator,
} from "./ui/menubar"

import { SubmitButton } from "./submit-button"

// Mock function to generate random folders
const folders = ["Research", "Notes", "Projects", "Ideas", "Assignments"]

export default async function HeaderAuth() {
  const {
    data: { user },
  } = await createClient().auth.getUser()

  return (
    <div className="flex items-center gap-4">
      {user ? (
        <>
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger>Archived</MenubarTrigger>
              <MenubarContent className="bg-white  border border-gray-200  w-48">
                {folders.map((folder, index) => (
                  <MenubarItem
                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                    key={index}
                    className="flex items-center gap-2"
                  >
                    <Folder className="w-4 h-4" />
                    <span>{folder}</span>
                  </MenubarItem>
                ))}
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger>
                {user.email?.charAt(0).toUpperCase()}
              </MenubarTrigger>
              <MenubarContent className="bg-white w-48">
                <MenubarItem className="text-gray-700 ">
                  {user.email}
                </MenubarItem>
                <MenubarSeparator />
                <SubmitButton
                  formAction={signOutAction}
                  className="w-full text-left "
                  variant="ghost"
                  size="sm"
                >
                  Sign out
                </SubmitButton>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </>
      ) : (
        <div className="flex gap-2">
          <Button asChild size="sm" variant={"outline"}>
            <Link href="/sign-in">Sign in</Link>
          </Button>
          <Button asChild size="sm" variant={"default"}>
            <Link href="/sign-up">Sign up</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
