"use client";

import { useQueryState } from "nuqs";

export function useSidebarState() {
  return useQueryState("sidebar", {
    defaultValue: true,
    parse: (value): boolean => value === "true",
    serialize: (value: boolean): string => value.toString(),
    shallow: true,
    throttleMs: 100,
  });
}
