"use client";

import { useQueryStates, parseAsString, parseAsInteger } from "nuqs";

export function useFolderStates() {
  return useQueryStates(
    {
      search: parseAsString.withDefault(""),
      sort: parseAsString.withDefault("name"),
      page: parseAsInteger.withDefault(1),
    },
    {
      history: "replace",
    }
  );
}
