"use client";

import { Input } from "@/components/ui/input";
import { LoaderCircle, Mic, Search, X } from "lucide-react";
import { useEffect, useId, useState } from "react";

export function Finder({
  inputValue,
  handleSearch,
  clearInput,
}: {
  inputValue: string;
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearInput?: () => void;
}) {
  const id = useId();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (inputValue) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    }
    setIsLoading(false);
  }, [inputValue]);

  return (
    <div className="space-y-2 min-w-[100px] sm:min-w-[300px]">
      <div className="relative">
        <Input
          id={id}
          className="peer pe-9 ps-9"
          placeholder="Find a highlight ..."
          type="search"
          value={inputValue}
          onChange={handleSearch}
        />
        <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
          {isLoading ? (
            <LoaderCircle
              className="animate-spin"
              size={16}
              strokeWidth={2}
              role="status"
              aria-label="Loading..."
            />
          ) : (
            <Search size={16} strokeWidth={2} aria-hidden="true" />
          )}
        </div>
        {inputValue && (
          <button
            className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => {
              if (clearInput) {
                clearInput();
              }
            }}
            type="button"
          >
            <X size={16} strokeWidth={2} aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}
