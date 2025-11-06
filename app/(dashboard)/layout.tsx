import type React from "react"
import { MainNav } from "@/components/main-nav"
import { Header } from "@/components/header"
import { SidebarInset } from "@/components/ui/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <MainNav />
      <SidebarInset className="flex flex-col">
        <Header />
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
    </div>
  )
}

