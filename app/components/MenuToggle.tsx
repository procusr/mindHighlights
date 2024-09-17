"use client"

import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSidebar } from "../contexts/SidebarContext"

export default function MenuToggle() {
  const { menuOpen, toggleMenu } = useSidebar()

  return (
    <div className="md:hidden">
      <Button variant="ghost" onClick={toggleMenu} aria-label="Toggle menu">
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </Button>
    </div>
  )
}
