import { signOutAction } from "@/app/actions"
import { createClient } from "@/utils/supabase/server"
import Link from "next/link"
import { Button } from "./ui/button"
import { Montserrat } from "next/font/google"
import { Folder } from "lucide-react"

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
  MenubarSeparator,
} from "./ui/menubar"
import { Avatar, AvatarFallback } from "./ui/avatar"

const montserrat = Montserrat({ subsets: ["latin"] })

// Mock function to generate random folders
const getRandomFolders = () => {
  const folders = ["Research", "Notes", "Projects", "Ideas", "Assignments"]
  return folders.sort(() => 0.5 - Math.random()).slice(0, 3)
}

export default async function HeaderAuth() {
  const {
    data: { user },
  } = await createClient().auth.getUser()

  const randomFolders = getRandomFolders()

  return (
    <div className="flex items-center gap-4">
      {user ? (
        <>
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger className="outline-none focus:ring-2 focus:ring-accent">
                Archived
              </MenubarTrigger>
              <MenubarContent className="bg-white  border border-gray-200  w-48">
                {randomFolders.map((folder, index) => (
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
              <MenubarTrigger className="outline-none focus:ring-2 focus:ring-accent">
                <Avatar>
                  <AvatarFallback className="bg-gray-500 text-white">
                    {user.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </MenubarTrigger>
              <MenubarContent className="bg-white  border border-gray-200  w-48">
                <MenubarItem className="text-gray-700 ">
                  {user.email}
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem>
                  <form action={signOutAction} className="w-full">
                    <button
                      type="submit"
                      className="w-full text-left text-red-500 hover:bg-red-100   focus:border-none"
                    >
                      Sign out
                    </button>
                  </form>
                </MenubarItem>
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
