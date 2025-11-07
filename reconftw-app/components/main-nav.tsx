"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart2, FolderClosed, History, Home, Settings, Shield, Target, CheckSquare, Users, Zap } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

export function MainNav() {
  const pathname = usePathname()

  const routes = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    {
      title: "Projects",
      href: "/projects",
      icon: FolderClosed,
    },
    {
      title: "Targets",
      href: "/targets",
      icon: Target,
    },
    {
      title: "Scan History",
      href: "/scan-history",
      icon: History,
    },
    {
      title: "Vulnerabilities",
      href: "/vulnerabilities",
      icon: Shield,
    },
    {
      title: "Todo",
      href: "/todo",
      icon: CheckSquare,
    },
    {
      title: "Organization",
      href: "/organization",
      icon: Users,
    },
    {
      title: "Scan Engine",
      href: "/scan-engine",
      icon: Zap,
    },
    {
      title: "Bounty Hub",
      href: "/bounty-hub",
      icon: BarChart2,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ]

  return (
    <Sidebar>
      <SidebarHeader className="flex h-14 items-center border-b px-4 bg-white">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <span className="text-xl font-bold text-primary">reNgine</span>
          <span className="text-xs text-muted-foreground">2.2.0</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {routes.map((route) => (
            <SidebarMenuItem key={route.href}>
              <SidebarMenuButton asChild isActive={pathname === route.href} tooltip={route.title}>
                <Link href={route.href}>
                  <route.icon className="h-5 w-5" />
                  <span>{route.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}

