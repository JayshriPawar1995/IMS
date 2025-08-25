"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { MessageSquare, Plus, Clock, AlertTriangle, CheckCircle, XCircle, Eye, Calendar, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { database, type SupportTicket } from "@/lib/database"
import { useAuth } from "@/contexts/auth-context"

export function UserSupportForm() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [tickets, setTickets] = useState<SupportTicket[]>(user ? database.getUserSupportTickets(user.id) : [])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    subject: "",
    category: "" as "technical" | "course" | "billing" | "general" | "",
    priority: "" as "low" | "medium" | "high" | "urgent" | "",
    description: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({ title: "Please log in to submit a support ticket", variant: "destructive" })
      return
    }

    try {
      const newTicket = database.createSupportTicket({
        userId: user.id,
        subject: formData.subject,
        category: formData.category as any,
        priority: formData.priority as any,
        description: formData.description,
        status: "open",
      })

      setTickets(database.getUserSupportTickets(user.id))
      setFormData({
        subject: "",
        category: "",
        priority: "",
        description: "",
      })
      setIsCreateDialogOpen(false)
      toast({ title: "Support ticket submitted successfully!" })
    } catch (error) {
      toast({ title: "Failed to submit support ticket", variant: "destructive" })
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-800"
      case "in_progress":
        return "bg-yellow-100 text-yellow-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      case "closed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <Clock className="w-4 h-4" />
      case "in_progress":
        return <AlertTriangle className="w-4 h-4" />
      case "resolved":
        return <CheckCircle className="w-4 h-4" />
      case "closed":
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const getTimeSince = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Less than 1 hour ago"
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`

    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`
  }

  const handleViewTicket = (ticket: SupportTicket) => {
    setSelectedTicket(ticket)
    setIsViewDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Support Center</h2>
          <p className="text-gray-600">Submit and track your support tickets</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Ticket
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Submit Support Ticket</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
                  placeholder="Brief description of your issue"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value: "technical" | "course" | "billing" | "general") =>
                      setFormData((prev) => ({ ...prev, category: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technical">Technical Issue</SelectItem>
                      <SelectItem value="course">Course Related</SelectItem>
                      <SelectItem value="billing">Billing & Payment</SelectItem>
                      <SelectItem value="general">General Inquiry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value: "low" | "medium" | "high" | "urgent") =>
                      setFormData((prev) => ({ ...prev, priority: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Please provide detailed information about your issue..."
                  className="min-h-32"
                  required
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCreateDialogOpen(false)
                    setFormData({
                      subject: "",
                      category: "",
                      priority: "",
                      description: "",
                    })
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">Submit Ticket</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Support Tickets List */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Your Support Tickets</h3>

        {tickets.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">No Support Tickets</h3>
              <p className="text-gray-600 mb-4">
                You haven't submitted any support tickets yet. If you need help, feel free to create a new ticket.
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Ticket
              </Button>
            </CardContent>
          </Card>
        ) : (
          tickets.map((ticket) => (
            <Card key={ticket.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-lg">{ticket.subject}</CardTitle>
                      <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
                      <Badge className={getStatusColor(ticket.status)}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(ticket.status)}
                          {ticket.status.replace("_", " ")}
                        </span>
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2">{ticket.description}</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleViewTicket(ticket)}>
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Created {getTimeSince(ticket.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    <span>{ticket.responses.length} responses</span>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {ticket.category}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* View Ticket Dialog */}
      {selectedTicket && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <span>{selectedTicket.subject}</span>
                <Badge className={getPriorityColor(selectedTicket.priority)}>{selectedTicket.priority}</Badge>
                <Badge className={getStatusColor(selectedTicket.status)}>
                  <span className="flex items-center gap-1">
                    {getStatusIcon(selectedTicket.status)}
                    {selectedTicket.status.replace("_", " ")}
                  </span>
                </Badge>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Ticket Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label className="text-sm font-medium">Category</Label>
                  <p className="text-sm capitalize">{selectedTicket.category}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Priority</Label>
                  <p className="text-sm capitalize">{selectedTicket.priority}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Created</Label>
                  <p className="text-sm">{formatDate(selectedTicket.createdAt)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Last Updated</Label>
                  <p className="text-sm">{formatDate(selectedTicket.updatedAt)}</p>
                </div>
              </div>

              {/* Original Message */}
              <div>
                <Label className="text-sm font-medium">Your Message</Label>
                <div className="mt-2 p-4 border rounded-lg bg-white">
                  <p className="text-sm whitespace-pre-wrap">{selectedTicket.description}</p>
                </div>
              </div>

              {/* Responses */}
              <div>
                <Label className="text-sm font-medium">Conversation</Label>
                <div className="mt-2 space-y-4 max-h-64 overflow-y-auto">
                  {selectedTicket.responses.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-sm text-gray-500">
                        No responses yet. Our support team will respond to your ticket soon.
                      </p>
                    </div>
                  ) : (
                    selectedTicket.responses.map((response) => (
                      <div
                        key={response.id}
                        className={`p-4 rounded-lg ${
                          response.isAdminResponse
                            ? "bg-blue-50 border-l-4 border-blue-500 ml-8"
                            : "bg-gray-50 border-l-4 border-gray-300 mr-8"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-medium flex items-center gap-2">
                            {response.isAdminResponse ? (
                              <>
                                <User className="w-4 h-4" />
                                Support Team
                              </>
                            ) : (
                              <>
                                <User className="w-4 h-4" />
                                You
                              </>
                            )}
                          </span>
                          <span className="text-xs text-gray-500">{formatDate(response.createdAt)}</span>
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{response.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Status Information */}
              {selectedTicket.status === "resolved" && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-800">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Ticket Resolved</span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    This ticket has been marked as resolved. If you need further assistance, please create a new ticket.
                  </p>
                </div>
              )}

              {selectedTicket.status === "closed" && (
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-800">
                    <XCircle className="w-5 h-5" />
                    <span className="font-medium">Ticket Closed</span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">
                    This ticket has been closed. If you need further assistance, please create a new ticket.
                  </p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
