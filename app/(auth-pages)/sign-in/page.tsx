import { signInAction } from "@/app/actions"
import { FormMessage, type Message } from "@/components/form-message"
import { SubmitButton } from "@/components/submit-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Checkbox } from "../../../components/ui/checkbox"
import { cn } from "../../../utils/cn"
import { CheckIcon } from "lucide-react"
import AuthWrapper from "@/components/AuthWrapper"

export default function Login({ searchParams }: { searchParams: Message }) {
  return (
    <AuthWrapper>
      <p className="text-sm/5 text-gray-600">Sign in to continue.</p>
      <div className="mt-3 space-y-3">
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
      <div className=" flex flex-col mt-8 space-y-3">
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
        <Link href="/forgot-password" className="text-sm/5 ">
          Forgot password?
        </Link>
      </div>
      <div className="mt-8 flex items-center justify-between text-sm/5">
        <div className="flex items-center gap-3">
          <Checkbox
            name="remember-me"
            className={cn(
              "group block size-4 rounded border border-transparent shadow ring-1 ring-black/10 focus:outline-none",
              "data-[checked]:bg-black data-[checked]:ring-black",
              "data-[focus]:outline data-[focus]:outline-2 data-[focus]:outline-offset-2 data-[focus]:outline-black"
            )}
          >
            <CheckIcon className="fill-white opacity-0 group-data-[checked]:opacity-100" />
          </Checkbox>
          <Label>Remember me</Label>
        </div>
      </div>
      <div className="mt-8">
        <SubmitButton pendingText="Signing In..." formAction={signInAction}>
          Sign in
        </SubmitButton>
        <FormMessage message={searchParams} />
      </div>

      <div className="m-1.5 rounded-lg bg-ba py-4 text-center text-sm/5 ">
        Not a member?&nbsp;
        <Link href="/sign-up" className="font-medium hover:text-gray-600">
          Create an account
        </Link>
      </div>
    </AuthWrapper>
  )
}
