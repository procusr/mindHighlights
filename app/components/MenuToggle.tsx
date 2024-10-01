"use client"

import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSidebar } from "../contexts/SidebarContext"

export default function MenuToggle() {
  const { menuOpen, toggleMenu } = useSidebar()

  return (
    <div className="md:hidden">
      <Button
        className="p-0 "
        variant="ghost"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        {menuOpen ? <X size={26} /> : <Menu size={26} />}
      </Button>
    </div>
  )
}
