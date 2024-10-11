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
      <form action="#" method="POST" className="space-y-5">
        {" "}
        {/* Reduced space-y-6 to space-y-5 */}
        <h1 className="text-xl font-semibold mb-4">Sign in</h1>{" "}
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
              autoComplete="current-password"
              required
              className="mt-1 w-full"
            />
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center">
            <Checkbox
              id="remember-me"
              name="remember-me"
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <Label
              htmlFor="remember-me"
              className="ml-2 block text-gray-900 dark:text-gray-300"
            >
              Remember me
            </Label>
          </div>
          <Link
            href="/forgot-password"
            className="font-medium text-primary hover:text-primary-dark"
          >
            Forgot password?
          </Link>
        </div>
        <SubmitButton
          pendingText="Signing In..."
          formAction={signInAction}
          className="w-full"
        >
          Sign in
        </SubmitButton>
        <FormMessage message={searchParams} />
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Not a member?{" "}
          <Link
            href="/sign-up"
            className="font-medium text-primary hover:text-primary-dark"
          >
            Create an account
          </Link>
        </p>
      </form>
    </AuthWrapper>
  )
}
