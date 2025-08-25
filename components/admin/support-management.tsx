"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, UserIcon, Search, Send, Eye, UserCheck, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { database, type SupportTicket } from "@/lib/database"
import { useAuth } from "@/contexts/auth-context"

export function SupportManagement() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [tickets, setTickets] = useState<SupportTicket[]>(database.getSupportTickets())
  const [users] = useState(database.getUsers())
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [responseMessage, setResponseMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  const stats = database.getSupportTicketStats()

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getUserName(ticket.userId).toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter
    const matchesCategory = categoryFilter === "all" || ticket.category === categoryFilter

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory
  })

  const getUserName = (userId: string): string => {
    const ticketUser = users.find((u) => u.id === userId)
    return ticketUser ? ticketUser.name : "Unknown User"
  }

  const getUserEmail = (userId: string): string => {
    const ticketUser = users.find((u) => u.id === userId)
    return ticketUser ? ticketUser.email : "unknown@email.com"
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

  const handleViewTicket = (ticket: SupportTicket) => {
    setSelectedTicket(ticket)
    setIsViewDialogOpen(true)
    setResponseMessage("")
  }

  const handleStatusChange = (ticketId: string, newStatus: string) => {
    const updated = database.updateSupportTicket(ticketId, {
      status: newStatus as any,
      assignedTo: user?.id,
    })
    if (updated) {
      setTickets(database.getSupportTickets())
      if (selectedTicket?.id === ticketId) {
        setSelectedTicket(updated)
      }
      toast({ title: `Ticket status updated to ${newStatus}` })
    }
  }

  const handleAssignTicket = (ticketId: string, assignedTo: string) => {
    const updated = database.updateSupportTicket(ticketId, { assignedTo })
    if (updated) {
      setTickets(database.getSupportTickets())
      if (selectedTicket?.id === ticketId) {
        setSelectedTicket(updated)
      }
      toast({ title: "Ticket assigned successfully" })
    }
  }

  const handleSendResponse = () => {
    if (!selectedTicket || !responseMessage.trim() || !user) return

    try {
      database.addSupportResponse(selectedTicket.id, {
        ticketId: selectedTicket.id,
        userId: user.id,
        message: responseMessage.trim(),
        isAdminResponse: true,
      })

      const updatedTicket = database.getSupportTicket(selectedTicket.id)
      if (updatedTicket) {
        setSelectedTicket(updatedTicket)
        setTickets(database.getSupportTickets())
      }

      setResponseMessage("")
      toast({ title: "Response sent successfully" })
    } catch (error) {
      toast({ title: "Failed to send response", variant: "destructive" })
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800">Support Management</h2>
        <p className="text-gray-600">Manage and respond to user support tickets</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Tickets</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.open}</div>
            <div className="text-sm text-gray-600">Open</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.inProgress}</div>
            <div className="text-sm text-gray-600">In Progress</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
            <div className="text-sm text-gray-600">Resolved</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.urgent}</div>
            <div className="text-sm text-gray-600">Urgent</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.high}</div>
            <div className="text-sm text-gray-600">High Priority</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search tickets, users, or descriptions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="course">Course</SelectItem>
                <SelectItem value="billing">Billing</SelectItem>
                <SelectItem value="general">General</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">No support tickets found matching your criteria.</p>
            </CardContent>
          </Card>
        ) : (
          filteredTickets.map((ticket) => (
            <Card key={ticket.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{ticket.subject}</h3>
                      <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
                      <Badge className={getStatusColor(ticket.status)}>{ticket.status.replace("_", " ")}</Badge>
                      <Badge variant="outline">{ticket.category}</Badge>
                    </div>

                    <p className="text-gray-600 mb-3 line-clamp-2">{ticket.description}</p>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <UserIcon className="w-4 h-4" />
                        <span>{getUserName(ticket.userId)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{getTimeSince(ticket.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        <span>{ticket.responses.length} responses</span>
                      </div>
                      {ticket.assignedTo && (
                        <div className="flex items-center gap-1">
                          <UserCheck className="w-4 h-4" />
                          <span>Assigned to {getUserName(ticket.assignedTo)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button variant="outline" size="sm" onClick={() => handleViewTicket(ticket)}>
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>

                    <Select value={ticket.status} onValueChange={(value) => handleStatusChange(ticket.id, value)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
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
                  {selectedTicket.status.replace("_", " ")}
                </Badge>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Ticket Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label className="text-sm font-medium">User</Label>
                  <p className="text-sm">
                    {getUserName(selectedTicket.userId)} ({getUserEmail(selectedTicket.userId)})
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Category</Label>
                  <p className="text-sm capitalize">{selectedTicket.category}</p>
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

              {/* Ticket Actions */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label className="text-sm font-medium">Status</Label>
                  <Select
                    value={selectedTicket.status}
                    onValueChange={(value) => handleStatusChange(selectedTicket.id, value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <Label className="text-sm font-medium">Assign To</Label>
                  <Select
                    value={selectedTicket.assignedTo || ""}
                    onValueChange={(value) => handleAssignTicket(selectedTicket.id, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select admin" />
                    </SelectTrigger>
                    <SelectContent>
                      {users
                        .filter((u) => u.role === "admin")
                        .map((admin) => (
                          <SelectItem key={admin.id} value={admin.id}>
                            {admin.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Original Message */}
              <div>
                <Label className="text-sm font-medium">Original Message</Label>
                <div className="mt-2 p-4 border rounded-lg bg-white">
                  <p className="text-sm whitespace-pre-wrap">{selectedTicket.description}</p>
                </div>
              </div>

              {/* Responses */}
              <div>
                <Label className="text-sm font-medium">Conversation</Label>
                <div className="mt-2 space-y-4 max-h-64 overflow-y-auto">
                  {selectedTicket.responses.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">No responses yet</p>
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
                          <span className="text-sm font-medium">
                            {response.isAdminResponse ? "Admin" : getUserName(response.userId)}
                          </span>
                          <span className="text-xs text-gray-500">{formatDate(response.createdAt)}</span>
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{response.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Response Form */}
              <div>
                <Label className="text-sm font-medium">Add Response</Label>
                <div className="mt-2 space-y-3">
                  <Textarea
                    value={responseMessage}
                    onChange={(e) => setResponseMessage(e.target.value)}
                    placeholder="Type your response here..."
                    className="min-h-24"
                  />
                  <div className="flex justify-end">
                    <Button onClick={handleSendResponse} disabled={!responseMessage.trim()}>
                      <Send className="w-4 h-4 mr-2" />
                      Send Response
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
