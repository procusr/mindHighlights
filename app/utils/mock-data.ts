// lib/mock-data.ts
export const mockFolders = Array.from({ length: 50 }, (_, i) => ({
  id: `folder-${i}`,
  name: `Folder ${i}`,
  createdAt: new Date(2024 - i, 0, 1),
  items: Array.from({ length: Math.floor(Math.random() * 10) }, (_, j) => ({
    id: `item-${i}-${j}`,
    name: `Item ${j}`,
    type: ["document", "image", "video"][Math.floor(Math.random() * 3)],
  })),
}));
