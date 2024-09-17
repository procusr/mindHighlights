"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

export default function MenuToggle() {
  const toggleSidebar = () => {
    const event = new CustomEvent("toggleSidebar")
    window.dispatchEvent(event)
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="md:hidden"
      aria-label="Toggle menu"
      onClick={toggleSidebar}
    >
      <Menu className="h-6 w-6" />
    </Button>
  )
}
