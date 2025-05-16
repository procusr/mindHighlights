import {
  parseAsString,
  parseAsInteger,
  createSearchParamsCache,
} from "nuqs/server";

export const folderParsers = {
  search: parseAsString.withDefault(""),
  sort: parseAsString.withDefault("name"),
  page: parseAsInteger.withDefault(1),
};

export const folderCache = createSearchParamsCache(folderParsers);
