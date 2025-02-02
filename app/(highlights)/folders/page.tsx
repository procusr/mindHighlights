import { folderCache } from "@/app/utils/search-params";

export default async function FoldersPage({
  searchParams,
}: {
  searchParams: Promise<string>;
}) {
  // Parse search params server-side
  const { search, sort, page } = await folderCache.parse(searchParams);

  return (
    <div>
      <h1>Folders</h1>
      <p>Showing results for: {search}</p>
      <p>Sorted by: {sort}</p>
      <p>Page: {page}</p>
      {/* Rest of your component */}
    </div>
  );
}
