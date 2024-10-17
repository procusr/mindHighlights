import { signUpAction } from "@/app/actions"
import { FormMessage, type Message } from "@/components/form-message"
import { SubmitButton } from "@/components/submit-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import AuthWrapper from "../../../components/AuthWrapper"

export default async function Signup(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    <AuthWrapper>
      <form action="#" method="POST" className="space-y-5">
        {" "}
        {/* Reduced space-y-6 to space-y-5 */}
        <h1 className="text-xl font-semibold mb-4">Create an account</h1>{" "}
        {/* Reduced text size and margin */}
        <div className="space-y-3">
          {" "}
          {/* Reduced space-y-4 to space-y-3 */}
          <div>
            <Label htmlFor="email" className="block text-sm font-medium">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-1 w-full"
            />
          </div>
          <div>
            <Label htmlFor="password" className="block text-sm font-medium">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className="mt-1 w-full"
            />
          </div>
        </div>
        <SubmitButton
          pendingText="Signing Up..."
          formAction={signUpAction}
          className="w-full"
        >
          Sign up
        </SubmitButton>
        <FormMessage message={searchParams} />
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-medium text-primary hover:text-primary-dark"
          >
            Sign in
          </Link>
        </p>
      </form>
    </AuthWrapper>
  )
}
