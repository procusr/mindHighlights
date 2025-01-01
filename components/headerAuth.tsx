import { signOutAction } from "@/app/actions";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Button } from "./ui/button";
import { Folder } from "lucide-react";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
  MenubarSeparator,
} from "./ui/menubar";

import { SubmitButton } from "./submit-button";
import InstallPrompt from "@/app/components/InstallPrompt";

// Mock function to generate random folders
const folders = ["Research", "Notes", "Projects", "Ideas", "Assignments"];

export default async function HeaderAuth() {
  const {
    data: { user },
  } = await createClient().auth.getUser();

  return (
    <div className="flex items-center gap-1">
      {user ? (
        <>
          <Menubar className="p-1 ">
            <MenubarMenu>
              <MenubarTrigger className="p-0">Archived</MenubarTrigger>
              <MenubarContent className="bg-white border border-gray-200 max-w-full sm:w-48">
                {folders.map((folder) => (
                  <MenubarItem key={folder} className="flex items-center gap-2">
                    <Folder className="w-4 h-4" />
                    <span>{folder}</span>
                  </MenubarItem>
                ))}
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
          <Menubar className="border-none">
            <MenubarMenu>
              <MenubarTrigger className="w-8 h-8 flex items-center justify-center rounded-full bg-primary text-white text-sm sm:text-base sm:mr-4">
                {user.email?.charAt(0).toUpperCase()}
              </MenubarTrigger>
              <MenubarContent className="bg-white w-48 max-w-full">
                <MenubarItem className="text-gray-700">
                  {user.email}
                </MenubarItem>
                <MenubarSeparator />
                <form action={signOutAction} method="post">
                  <SubmitButton
                    type="submit"
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    variant="ghost"
                    size="sm"
                  >
                    Sign out
                  </SubmitButton>
                </form>
              </MenubarContent>
              <MenubarContent className="bg-white w-48 max-w-full">
                <MenubarItem className="text-gray-700">
                  <InstallPrompt />
                </MenubarItem>
                <MenubarSeparator />
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </>
      ) : (
        <div className="flex gap-2">
          <Button asChild size="sm" variant="outline">
            <Link href="/sign-in">Sign in</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
