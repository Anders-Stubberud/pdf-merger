import Link from "next/link"

import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { MainNav } from "@/components/main-nav"

export function SiteHeader() {
  return (
    <header className="ticky top-0 z-40 w-full flex justify-center">
      <div className="container flex h-16 items-center bg-background border-b space-x-4 sm:justify-between sm:space-x-0">
        <MainNav/>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
          </nav>
        </div>
      </div>
    </header>
  )
}
