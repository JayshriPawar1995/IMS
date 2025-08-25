"use client"

import { LayoutDashboard, BookOpen, Award, HelpCircle, Bell, Trophy, Library, LogOut, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

interface UserSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "courses", label: "Course Manager", icon: BookOpen, hasSubmenu: true },
  { id: "certificates", label: "Certificates", icon: Award },
  { id: "quizzes", label: "Quizzes", icon: HelpCircle, hasSubmenu: true },
  { id: "support", label: "Support", icon: HelpCircle, hasSubmenu: true },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "leaderboard", label: "Leadership Board", icon: Trophy },
  { id: "library", label: "e-Library", icon: Library },
]

export function UserSidebar({ activeTab, onTabChange }: UserSidebarProps) {
  const { logout } = useAuth()

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-3 flex-row">
          <img
            src="https://zaytoon.com.bd/wp-content/uploads/2021/08/Zaytoon-Logoh-1.png"
            alt="Zaytoon Logo"
            className="h-10 w-auto"
          />
          <div>
            <h2 className="font-bold text-lg text-gray-800">{""}</h2>
            <p className="text-xs text-gray-500 uppercase tracking-wide">{""}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"}
              className="w-full justify-between"
              onClick={() => onTabChange(item.id)}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </div>
              {item.hasSubmenu && <ChevronRight className="w-4 h-4 text-gray-400" />}
            </Button>
          ))}
        </div>
      </nav>

      <div className="p-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={logout}
        >
          <LogOut className="w-5 h-5" />
          Logout
        </Button>
      </div>
    </div>
  )
}
