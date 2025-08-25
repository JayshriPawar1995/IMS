"use client"

import { useState } from "react"
import { UserSidebar } from "./user-sidebar"
import { UserHeader } from "./user-header"
import { DashboardOverview } from "./dashboard-overview"
import { CourseManager } from "./course-manager"
import { UserCertificates } from "./user-certificates"
import { QuizSection } from "./quiz-section"
import { UserSupport } from "./user-support"
import { UserNotifications } from "./user-notifications"
import { Leaderboard } from "./leaderboard"
import { UserLibrary } from "./user-library"
import { UserProfile } from "./user-profile"

export function UserDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [showProfile, setShowProfile] = useState(false)

  const renderContent = () => {
    if (showProfile) {
      return <UserProfile onClose={() => setShowProfile(false)} />
    }

    switch (activeTab) {
      case "dashboard":
        return <DashboardOverview />
      case "courses":
        return <CourseManager />
      case "certificates":
        return <UserCertificates />
      case "quizzes":
        return <QuizSection />
      case "support":
        return <UserSupport />
      case "notifications":
        return <UserNotifications />
      case "leaderboard":
        return <Leaderboard />
      case "library":
        return <UserLibrary />
      default:
        return <DashboardOverview />
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50 flex-row">
      <UserSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 flex flex-col">
        <UserHeader onProfileClick={() => setShowProfile(true)} />
        <main className="flex-1 p-6">{renderContent()}</main>
      </div>
    </div>
  )
}
