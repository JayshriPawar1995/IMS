"use client"

import { useState } from "react"
import { AdminSidebar } from "./admin-sidebar"
import { AdminHeader } from "./admin-header"
import { AdminOverview } from "./admin-overview"
import { CourseManagement } from "./course-management"
import { UserManagement } from "./user-management"
import { CertificateManagement } from "./certificate-management"
import { NoticeManagement } from "./notice-management"
import { LibraryManagement } from "./library-management"
import { SupportManagement } from "./support-management"

export function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("overview")

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return <AdminOverview />
      case "courses":
        return <CourseManagement />
      case "users":
        return <UserManagement />
      case "certificates":
        return <CertificateManagement />
      case "notices":
        return <NoticeManagement />
      case "library":
        return <LibraryManagement />
      case "support":
        return <SupportManagement />
      default:
        return <AdminOverview />
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-6">{renderContent()}</main>
      </div>
    </div>
  )
}
