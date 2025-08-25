"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, BookOpen, GraduationCap, MessageSquare, CheckCircle, AlertTriangle } from "lucide-react"
import { database } from "@/lib/database"

export function AdminOverview() {
  const courses = database.getCourses()
  const users = database.getUsers()
  const enrollments = database.getEnrollments()
  const supportStats = database.getSupportTicketStats()

  const stats = {
    totalUsers: users.length,
    totalCourses: courses.length,
    activeCourses: courses.filter((c) => c.status === "active").length,
    totalEnrollments: enrollments.length,
    completedCourses: enrollments.filter((e) => e.status === "completed").length,
    activeEnrollments: enrollments.filter((e) => e.status === "active").length,
  }

  const completionRate =
    stats.totalEnrollments > 0 ? Math.round((stats.completedCourses / stats.totalEnrollments) * 100) : 0

  const recentActivity = [
    {
      id: 1,
      type: "enrollment",
      message: "New user enrolled in Digital Marketing Fundamentals",
      time: "2 hours ago",
      icon: Users,
      color: "text-blue-500",
    },
    {
      id: 2,
      type: "completion",
      message: "User completed Advanced Sales Techniques course",
      time: "4 hours ago",
      icon: CheckCircle,
      color: "text-green-500",
    },
    {
      id: 3,
      type: "support",
      message: "New high priority support ticket submitted",
      time: "6 hours ago",
      icon: AlertTriangle,
      color: "text-orange-500",
    },
    {
      id: 4,
      type: "course",
      message: "New course 'Field Operations Management' published",
      time: "1 day ago",
      icon: BookOpen,
      color: "text-purple-500",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800">Dashboard Overview</h2>
        <p className="text-gray-600">Welcome back! Here's what's happening with your LMS.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Registered learners</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeCourses}</div>
            <p className="text-xs text-muted-foreground">Out of {stats.totalCourses} total courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEnrollments}</div>
            <p className="text-xs text-muted-foreground">{stats.activeEnrollments} currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Support Tickets</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{supportStats.total}</div>
            <p className="text-xs text-muted-foreground">
              {supportStats.open} open, {supportStats.urgent} urgent
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Progress and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course Completion Rate */}
        <Card>
          <CardHeader>
            <CardTitle>Course Completion Rate</CardTitle>
            <CardDescription>Overall completion rate across all courses</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Completion Rate</span>
                <span>{completionRate}%</span>
              </div>
              <Progress value={completionRate} className="h-2" />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-medium text-green-600">{stats.completedCourses}</div>
                <div className="text-gray-500">Completed</div>
              </div>
              <div>
                <div className="font-medium text-blue-600">{stats.activeEnrollments}</div>
                <div className="text-gray-500">In Progress</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support Ticket Status */}
        <Card>
          <CardHeader>
            <CardTitle>Support Ticket Status</CardTitle>
            <CardDescription>Current status of all support tickets</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Open</span>
                  <Badge variant="outline">{supportStats.open}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">In Progress</span>
                  <Badge variant="outline">{supportStats.inProgress}</Badge>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Resolved</span>
                  <Badge variant="outline">{supportStats.resolved}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Urgent</span>
                  <Badge variant="destructive">{supportStats.urgent}</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest activities and updates in your LMS</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4">
                <div className={`p-2 rounded-full bg-gray-100 ${activity.color}`}>
                  <activity.icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
