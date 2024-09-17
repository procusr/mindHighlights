import { signOutAction } from "@/app/actions";
import { createClient } from "@/utils/supabase/server";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import { Button } from "./ui/button";
import { ThemeSwitcher } from "./theme-switcher";

export default async function HeaderAuth() {
  const {
    data: { user },
  } = await createClient().auth.getUser();

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-x-4">
            Hey, {user.email}!
            <form action={signOutAction}>
              <Button type="submit" variant="outline">
                Sign out
              </Button>
            </form>
          </div>
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
        <ThemeSwitcher />
      </div>
    </ThemeProvider>
  );
}
