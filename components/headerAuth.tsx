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

export default async function HeaderAuth() {
  const {
    data: { user },
  } = await createClient().auth.getUser();

  return (
    <div className="flex items-center gap-1">
      {user ? (
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger className="w-8 h-8 flex items-center justify-center rounded-full bg-primary text-white text-sm sm:text-base sm:mr-4">
              {user.email?.charAt(0).toUpperCase()}
            </MenubarTrigger>
            <MenubarContent className="bg-white w-48 max-w-full">
              <MenubarItem className="text-gray-700">{user.email}</MenubarItem>
              <MenubarSeparator />
              <form action={signOutAction}>
                <SubmitButton
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  variant="text"
                  size="sm"
                >
                  Sign out
                </SubmitButton>
              </form>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
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
