// components/folders/folder-item-content.tsx
export function FolderItemContent({ item }: { item: any }) {
  return (
    <div className="p-4 border rounded-md">
      <p className="text-sm font-semibold">{item.name}</p>
      <p className="text-xs text-muted-foreground">Type: {item.type}</p>
    </div>
  );
}
