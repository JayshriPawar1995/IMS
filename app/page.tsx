"use client"

import { useAuth } from "@/contexts/auth-context"
import { LoginForm } from "@/components/auth/login-form"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { UserDashboard } from "@/components/user/user-dashboard"

export default function Home() {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <LoginForm />
  }

  if (user?.role === "admin") {
    return <AdminDashboard />
  }

  return <UserDashboard />
}
