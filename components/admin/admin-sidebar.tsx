"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  LayoutDashboard,
  Users,
  BookOpen,
  GraduationCap,
  Bell,
  Library,
  MessageSquare,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { database } from "@/lib/database"

interface AdminSidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

export function AdminSidebar({ activeSection, onSectionChange }: AdminSidebarProps) {
  const { logout } = useAuth()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const supportStats = database.getSupportTicketStats()

  const menuItems = [
    {
      id: "overview",
      label: "Overview",
      icon: LayoutDashboard,
    },
    {
      id: "courses",
      label: "Course Management",
      icon: BookOpen,
    },
    {
      id: "users",
      label: "User Management",
      icon: Users,
    },
    {
      id: "certificates",
      label: "Certificates",
      icon: GraduationCap,
    },
    {
      id: "notices",
      label: "Notices",
      icon: Bell,
    },
    {
      id: "library",
      label: "Library",
      icon: Library,
    },
    {
      id: "support",
      label: "Support",
      icon: MessageSquare,
      badge: supportStats.open + supportStats.urgent,
    },
  ]

  return (
    <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"}`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Admin Panel</h2>
            <p className="text-sm text-gray-600">ZAYTOON LMS</p>
          </div>
        )}
        <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)} className="h-8 w-8">
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant={activeSection === item.id ? "default" : "ghost"}
              className={`w-full justify-start gap-3 ${isCollapsed ? "px-2" : "px-3"}`}
              onClick={() => onSectionChange(item.id)}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              {!isCollapsed && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && item.badge > 0 && (
                    <Badge variant="destructive" className="ml-auto">
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </Button>
          ))}
        </nav>
      </ScrollArea>

      <div className="border-t border-gray-200 p-3">
        <Button
          variant="ghost"
          className={`w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50 ${
            isCollapsed ? "px-2" : "px-3"
          }`}
          onClick={logout}
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  )
}
