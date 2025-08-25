"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Notice {
  id: string
  title: string
  content: string
  targetRole: "all" | "agent" | "field_officer"
  priority: "low" | "medium" | "high"
  status: "active" | "draft"
  createdDate: string
  author: string
}

export function NoticeManagement() {
  const [notices, setNotices] = useState<Notice[]>([
    {
      id: "1",
      title: "Tomorrow is a Holiday!",
      content:
        "Let us make a promise that we would not let the hard sacrifices of our brave freedom fighters go in vain. We would work hard to make our country the best in the world. Happy Republic Day 2021!",
      targetRole: "all",
      priority: "high",
      status: "active",
      createdDate: "2024-01-26",
      author: "HR Team",
    },
    {
      id: "2",
      title: "New Course Available",
      content: "A new course on Digital Marketing has been added to the platform. All agents are encouraged to enroll.",
      targetRole: "agent",
      priority: "medium",
      status: "active",
      createdDate: "2024-01-20",
      author: "Training Team",
    },
    {
      id: "3",
      title: "System Maintenance",
      content: "The system will be under maintenance on Sunday from 2 AM to 4 AM. Please plan accordingly.",
      targetRole: "all",
      priority: "low",
      status: "draft",
      createdDate: "2024-01-25",
      author: "IT Team",
    },
  ])

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    targetRole: "all" as "all" | "agent" | "field_officer",
    priority: "medium" as "low" | "medium" | "high",
    status: "draft" as "active" | "draft",
  })

  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingNotice) {
      setNotices((prev) => prev.map((notice) => (notice.id === editingNotice.id ? { ...notice, ...formData } : notice)))
      toast({ title: "Notice updated successfully!" })
      setEditingNotice(null)
    } else {
      const newNotice: Notice = {
        id: Date.now().toString(),
        ...formData,
        createdDate: new Date().toISOString().split("T")[0],
        author: "Admin",
      }
      setNotices((prev) => [...prev, newNotice])
      toast({ title: "Notice created successfully!" })
    }

    setFormData({
      title: "",
      content: "",
      targetRole: "all",
      priority: "medium",
      status: "draft",
    })
    setIsAddDialogOpen(false)
  }

  const handleEdit = (notice: Notice) => {
    setEditingNotice(notice)
    setFormData({
      title: notice.title,
      content: notice.content,
      targetRole: notice.targetRole,
      priority: notice.priority,
      status: notice.status,
    })
    setIsAddDialogOpen(true)
  }

  const handleDelete = (noticeId: string) => {
    setNotices((prev) => prev.filter((notice) => notice.id !== noticeId))
    toast({ title: "Notice deleted successfully!" })
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-100 text-red-800">High</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
      case "low":
        return <Badge className="bg-green-100 text-green-800">Low</Badge>
      default:
        return <Badge variant="secondary">{priority}</Badge>
    }
  }

  const getTargetBadge = (target: string) => {
    switch (target) {
      case "all":
        return <Badge variant="outline">All Users</Badge>
      case "agent":
        return <Badge variant="outline">Agents</Badge>
      case "field_officer":
        return <Badge variant="outline">Field Officers</Badge>
      default:
        return <Badge variant="outline">{target}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Notice Management</h2>
          <p className="text-gray-600">Create and manage notifications for users</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Notice
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingNotice ? "Edit Notice" : "Create New Notice"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Notice Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="targetRole">Target Audience</Label>
                  <Select
                    value={formData.targetRole}
                    onValueChange={(value: "all" | "agent" | "field_officer") =>
                      setFormData((prev) => ({ ...prev, targetRole: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="agent">Agents Only</SelectItem>
                      <SelectItem value="field_officer">Field Officers Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value: "low" | "medium" | "high") =>
                      setFormData((prev) => ({ ...prev, priority: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: "active" | "draft") => setFormData((prev) => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false)
                    setEditingNotice(null)
                    setFormData({
                      title: "",
                      content: "",
                      targetRole: "all",
                      priority: "medium",
                      status: "draft",
                    })
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">{editingNotice ? "Update Notice" : "Create Notice"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {notices.map((notice) => (
          <Card key={notice.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{notice.title}</CardTitle>
                  <p className="text-sm text-gray-500 mt-1">
                    By {notice.author} • {new Date(notice.createdDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(notice)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(notice.id)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">{notice.content}</p>

              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  {getPriorityBadge(notice.priority)}
                  {getTargetBadge(notice.targetRole)}
                  <Badge variant={notice.status === "active" ? "default" : "secondary"}>{notice.status}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
