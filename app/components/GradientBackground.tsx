import { cn } from "@/utils/cn"

export function GradientBackground() {
  return (
    <div className="relative mx-auto max-w-7xl">
      <div
        className={cn(
          "absolute -right-60 -top-44 h-60 w-[36rem] transform-gpu md:right-0",
          "bg-[linear-gradient(115deg,var(--tw-gradient-stops))] from-[#fff9c4] from-[28%] via-[#f3e77d] via-[90%] to-[#fdd835]",
          "rotate-[-10deg] rounded-full blur-3xl"
        )}
      />
    </div>
  )
}
