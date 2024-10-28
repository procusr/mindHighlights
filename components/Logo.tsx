import React from "react";

export default function Logo() {
  return (
    <div className="text-xl sm:text-2xl font-bold inline-flex items-center">
      <span className="text-primary">Mind</span>
      <span className="relative inline-block ml-1">
        <span className="relative z-10 text-gray-800 dark:text-gray-200">
          Highlights
        </span>
        <span className="absolute inset-x-0 bottom-0 h-3/5 bg-highlight opacity-60 transform -skew-y-3 rounded-sm" />
      </span>
    </div>
  );
}
