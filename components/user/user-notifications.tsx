"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, CheckCircle, AlertCircle, Info, X } from "lucide-react"

interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  isRead: boolean
  createdAt: string
}

export function UserNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Course Completed",
      message: "Congratulations! You have successfully completed the Customer Service Excellence course.",
      type: "success",
      isRead: false,
      createdAt: "2024-01-15T10:30:00Z",
    },
    {
      id: "2",
      title: "New Course Available",
      message: "A new course 'Advanced Digital Marketing' has been added to your learning path.",
      type: "info",
      isRead: false,
      createdAt: "2024-01-14T14:20:00Z",
    },
    {
      id: "3",
      title: "Quiz Reminder",
      message: "Don't forget to complete the Digital Booth Fundamentals quiz. Due in 2 days.",
      type: "warning",
      isRead: true,
      createdAt: "2024-01-13T09:15:00Z",
    },
    {
      id: "4",
      title: "Certificate Ready",
      message: "Your certificate for Customer Service Excellence is ready for download.",
      type: "success",
      isRead: true,
      createdAt: "2024-01-12T16:45:00Z",
    },
    {
      id: "5",
      title: "System Maintenance",
      message: "Scheduled maintenance on Sunday 2 AM - 4 AM. Some features may be unavailable.",
      type: "info",
      isRead: true,
      createdAt: "2024-01-11T11:00:00Z",
    },
  ])

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, isRead: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-600" />
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-600" />
      default:
        return <Info className="w-5 h-5 text-blue-600" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200"
      case "warning":
        return "bg-yellow-50 border-yellow-200"
      case "error":
        return "bg-red-50 border-red-200"
      default:
        return "bg-blue-50 border-blue-200"
    }
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Bell className="w-8 h-8" />
            Notifications
            {unreadCount > 0 && <Badge className="bg-red-500 text-white">{unreadCount}</Badge>}
          </h2>
          <p className="text-gray-600">Stay updated with your learning progress</p>
        </div>
        {unreadCount > 0 && (
          <Button onClick={markAllAsRead} variant="outline">
            Mark All as Read
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <Card
            key={notification.id}
            className={`${getTypeColor(notification.type)} ${!notification.isRead ? "border-l-4" : ""}`}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  {getIcon(notification.type)}
                  <div className="flex-1">
                    <h3 className={`font-semibold ${!notification.isRead ? "text-gray-900" : "text-gray-700"}`}>
                      {notification.title}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-2">{new Date(notification.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!notification.isRead && (
                    <Button size="sm" variant="ghost" onClick={() => markAsRead(notification.id)}>
                      Mark as Read
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => deleteNotification(notification.id)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {notifications.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Notifications</h3>
            <p className="text-gray-500">You're all caught up!</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
