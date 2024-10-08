import { signUpAction } from "@/app/actions"
import { FormMessage, type Message } from "@/components/form-message"
import { SubmitButton } from "@/components/submit-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { SmtpMessage } from "../smtp-message"
import { cn } from "../../../utils/cn"

export default function Signup({ searchParams }: { searchParams: Message }) {
  if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    )
  }

  return (
    <div className="w-full max-w-sm rounded-md bg-white shadow-md ring-1 ring-black/5">
      <form
        action="#"
        method="POST"
        className="flex flex-col gap-2 p-7 sm:p-11"
      >
        <div className="flex items-start text-lg font-semibold">
          <Link href="/" title="Home">
            Mind
            <span className=" bg-yellow-300 font-light">Highlights</span>
          </Link>
        </div>
        <h1 className="text-xl font-medium mt-5">Sign up</h1>
        <p className="text-sm text text-foreground">
          Already have an account?{" "}
          <Link className="text-primary font-medium underline" href="/sign-in">
            Sign in
          </Link>
        </p>
        <div className="mt-8 space-y-3">
          <Label className="text-sm/5 font-medium">Email</Label>
          <Input
            required
            autoFocus
            type="email"
            name="email"
            className={cn(
              "block w-full rounded-lg border border-transparent shadow ring-1 ring-black/10",
              "px-[calc(theme(spacing.2)-1px)] py-[calc(theme(spacing[1.5])-1px)] text-base/6 sm:text-sm/6",
              "data-[focus]:outline data-[focus]:outline-2 data-[focus]:-outline-offset-1 data-[focus]:outline-black"
            )}
          />
        </div>
        <div className="mt-8 space-y-3">
          <Label className="text-sm/5 font-medium">Password</Label>
          <Input
            required
            type="password"
            name="password"
            className={cn(
              "block w-full rounded-lg border border-transparent shadow ring-1 ring-black/10",
              "px-[calc(theme(spacing.2)-1px)] py-[calc(theme(spacing[1.5])-1px)] text-base/6 sm:text-sm/6",
              "data-[focus]:outline data-[focus]:outline-2 data-[focus]:-outline-offset-1 data-[focus]:outline-black"
            )}
          />
          <div className="mt-8">
            <SubmitButton pendingText="Signing In..." formAction={signUpAction}>
              Register
            </SubmitButton>
          </div>
          <FormMessage message={searchParams} />
        </div>
      </form>
      <SmtpMessage />
    </div>
  )
}
