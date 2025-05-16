"use client";

import { useState } from "react";

export default function Logo() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="text-xl sm:text-2xl font-extrabold inline-flex items-baseline select-none cursor-pointer relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        letterSpacing: "-0.02em",
      }}
    >
      <div className="relative flex items-baseline">
        <span
          className={`
            relative z-10
            text-gray-800 dark:text-gray-100
            transition-all duration-500 ease-out
            tracking-tight
            ${isHovered ? "transform -translate-x-px" : ""}
          `}
          style={{
            marginRight: "-0.15em",
          }}
        >
          Mind
        </span>

        <span className="relative">
          <span
            className={`
              relative z-20
              text-gray-900 dark:text-gray-100
              transition-all duration-500
            `}
            style={{
              marginLeft: "-0.05em",
            }}
          >
            Highlights
          </span>

          <span
            className={`
              absolute bottom-0
              h-[45%]
              transform -skew-y-2
              transition-all duration-500 ease-out
              mix-blend-multiply dark:mix-blend-soft-light
              origin-left
              ${isHovered ? "scale-x-[1.03]" : "scale-x-100"}
            `}
            style={{
              left: "-0.25em",
              right: "0",
              background: `
                linear-gradient(
                  170deg,
                  rgba(255, 242, 99, 0.7) 0%,
                  rgba(255, 236, 85, 0.85) 40%,
                  rgba(252, 220, 75, 0.85) 70%,
                  rgba(252, 210, 65, 0.7) 100%
                )
              `,
              clipPath: "polygon(0 20%, 100% 15%, 100% 100%, 0 100%)",
              borderTopLeftRadius: "2px",
            }}
          >
            <span
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage: `
                  linear-gradient(
                    -45deg,
                    transparent 47%,
                    rgba(255, 255, 255, 0.25) 47%,
                    rgba(255, 255, 255, 0.25) 53%,
                    transparent 53%
                  )
                `,
                backgroundSize: "4px 4px",
              }}
            />
          </span>

          <span
            className={`
              absolute inset-0
              bg-gradient-to-r from-transparent via-white/20 to-transparent
              transition-all duration-700
              ${isHovered ? "opacity-100" : "opacity-0"}
            `}
            style={{
              transform: isHovered ? "translateX(100%)" : "translateX(-100%)",
              clipPath: "polygon(0 20%, 100% 15%, 100% 100%, 0 100%)",
              left: "-0.15em",
            }}
          />
        </span>
      </div>

      <div
        className={`
          absolute -inset-x-2 -inset-y-1
          bg-gradient-to-r from-yellow-100/0 via-yellow-100/15 to-yellow-100/0
          dark:from-yellow-900/0 dark:via-yellow-900/10 dark:to-yellow-900/0
          blur-lg
          transition-opacity duration-500
          pointer-events-none
          ${isHovered ? "opacity-100" : "opacity-0"}
        `}
      />
    </div>
  );
}
