import { forgotPasswordAction } from "@/app/actions"
import { FormMessage, type Message } from "@/components/form-message"
import { SubmitButton } from "@/components/submit-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { cn } from "../../../utils/cn"
import AuthWrapper from "@/components/AuthWrapper"

export default function ForgotPassword({
  searchParams,
}: {
  searchParams: Message
}) {
  return (
    <AuthWrapper>
      <Link className="text-primary underline" href="/sign-in">
        Back to sign in ?
      </Link>
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
        <SubmitButton formAction={forgotPasswordAction}>
          Reset Password
        </SubmitButton>
        <FormMessage message={searchParams} />
      </div>
    </AuthWrapper>
  )
}
