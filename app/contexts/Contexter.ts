import type { Context } from "react";
import { useContext } from "react";

export const Contexter = <T>(
  contextObj: Record<string, Context<T | undefined>>
): (() => T) => {
  const entries = Object.entries(contextObj);
  if (entries.length !== 1) {
    throw new Error("Context object must have a single key value pair");
  }
  const [[name, context]] = entries;
  return (): T => {
    const currContext = useContext(context);
    if (!currContext) {
      throw new Error(`${name}.Provider was not found in tree`);
    }
    return currContext;
  };
};
