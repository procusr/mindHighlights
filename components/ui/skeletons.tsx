import { useId } from "react"

export function ContentCardSkeleton() {
  const randomWidth = () => `${Math.floor(Math.random() * 30 + 70)}%`
  const id = useId()

  return (
    <div className="animate-pulse">
      <div className="bg-muted rounded-lg">
        <div className="p-4 border-b border-border/10">
          <div
            className="h-4 bg-muted-foreground/20 rounded"
            style={{ width: randomWidth() }}
          />
        </div>
        <div className="p-4">
          <div className="space-y-2">
            <div
              className="h-3 bg-muted-foreground/10 rounded"
              style={{ width: randomWidth() }}
            />
            <div
              className="h-3 bg-muted-foreground/10 rounded"
              style={{ width: randomWidth() }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export function ContentAreaSkeleton() {
  const id = useId()
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <ContentCardSkeleton key={`${id}-skeleton-${i}`} />
      ))}
    </div>
  )
}

export function SidebarSkeleton() {
  const id = useId()
  return (
    <div className="w-72 p-4 space-y-4">
      {[...Array(5)].map((_, i) => (
        <div
          key={`${id}-sidebar-skeleton-${i}`}
          className="h-8 bg-muted rounded animate-pulse"
        />
      ))}
    </div>
  )
}
