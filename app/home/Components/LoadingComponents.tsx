export function LoadingSpinner() {
  return (
    <div className="flex justify-center p-4">
      <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
    </div>
  );
}

export function FoldersLoading() {
  return (
    <div className="space-y-2 p-4">
      {Array.from({ length: 5 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
        <div key={i} className="h-14 bg-muted animate-pulse rounded-lg" />
      ))}
    </div>
  );
}
