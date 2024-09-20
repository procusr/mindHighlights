import { signOutAction } from "@/app/actions"
import { createClient } from "@/utils/supabase/server"
import { ThemeProvider } from "next-themes"
import Link from "next/link"
import { Button } from "./ui/button"
import { ThemeSwitcher } from "./theme-switcher"
import { Montserrat } from "next/font/google"

const montserrat = Montserrat({ subsets: ["latin"] })

export default async function HeaderAuth() {
  const {
    data: { user },
  } = await createClient().auth.getUser()

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
            <span className="text-sm sm:block hidden">{user.email}!</span>
            <form action={signOutAction}>
              <Button type="submit" variant="outline" className="text-sm">
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
  )
}
