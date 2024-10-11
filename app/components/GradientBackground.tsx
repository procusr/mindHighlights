import { cn } from "@/utils/cn"

export function GradientBackground() {
  return (
    <div className="relative mx-auto max-w-7xl">
      <div
        className={cn(
          "absolute -right-60 -top-44 h-60 w-[36rem] transform-gpu md:right-0",
          "bg-gradient-to-br from-primary/30 via-primary/20 to-transparent",
          "rotate-[-10deg] rounded-full blur-3xl"
        )}
      />
    </div>
  )
}
