"use client"

import { BookOpen, Award, HelpCircle, Bell, Trophy, Library, LayoutDashboard, LogOut, ChevronRight } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    url: "/dashboard",
    isActive: true,
  },
  {
    title: "Course Manage",
    icon: BookOpen,
    url: "/courses",
    hasSubmenu: true,
  },
  {
    title: "Certificate",
    icon: Award,
    url: "/certificates",
  },
  {
    title: "Quizzes",
    icon: HelpCircle,
    url: "/quizzes",
    hasSubmenu: true,
  },
  {
    title: "Support",
    icon: HelpCircle,
    url: "/support",
    hasSubmenu: true,
  },
  {
    title: "Notifications",
    icon: Bell,
    url: "/notifications",
  },
  {
    title: "Leadership Board",
    icon: Trophy,
    url: "/leaderboard",
  },
  {
    title: "e-Library",
    icon: Library,
    url: "/library",
  },
]

export function AppSidebar() {
  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">Z</span>
          </div>
          <div>
            <h2 className="font-bold text-lg text-gray-800">ZAYTOON</h2>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Business Solutions</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={item.isActive} className="w-full justify-between">
                    <a href={item.url} className="flex items-center gap-3">
                      <div className="flex items-center gap-3">
                        <item.icon className="w-5 h-5" />
                        <span>{item.title}</span>
                      </div>
                      {item.hasSubmenu && <ChevronRight className="w-4 h-4 text-gray-400" />}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <Button variant="ghost" className="w-full justify-start gap-3 text-gray-600">
          <LogOut className="w-5 h-5" />
          Logout
        </Button>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
