"use client"

import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSidebar } from "../contexts/SidebarContext"
import { useEffect, useRef } from "react"

export default function MenuToggle() {
  const { menuOpen, toggleMenu, closeMenu } = useSidebar()
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        menuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        closeMenu()
      }
    }

    document.addEventListener("mousedown", handleOutsideClick)
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
    }
  }, [menuOpen, closeMenu])

  return (
    <div ref={menuRef} className="md:hidden">
      <Button
        className="p-2 hover:bg-accent rounded-full transition-colors duration-200"
        variant="ghost"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <Menu
          size={24}
          className={`transition-transform duration-200 ${menuOpen ? "rotate-90" : ""}`}
        />
      </Button>
    </div>
  )
}
