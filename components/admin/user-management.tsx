"use client"

import { useEffect ,useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MoreHorizontal, Mail, Calendar } from "lucide-react"
import { database, type User, type Enrollment } from "@/lib/database"

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
const [enrollments, setEnrollments] = useState<Enrollment[]>([])
const [courses, setCourses] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState<string>("all")

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === "all" || user.role === filterRole

    return matchesSearch && matchesRole
  })

  const getUserEnrollments = (userId: string) => {
    return enrollments.filter((e) => e.userId === userId)
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "agent":
        return "default"
      case "field_officer":
        return "secondary"
      default:
        return "outline"
    }
  }

  useEffect(() => {
  async function fetchData() {
    const res = await fetch("/api/users")
    const data = await res.json()
    setUsers(data.users)
    setEnrollments(data.enrollments)
    setCourses(data.courses)
  }
  fetchData()
}, [])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800">User Management</h2>
        <p className="text-gray-600">Manage and monitor user accounts</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="agent">Agent</SelectItem>
                <SelectItem value="field_officer">Field Officer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => {
          const userEnrollments = getUserEnrollments(user.id)
          const completedCourses = userEnrollments.filter((e) => e.status === "completed").length
          const activeCourses = userEnrollments.filter((e) => e.status === "active").length

          return (
            <Card key={user.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="font-medium text-lg">{user.name.charAt(0)}</span>
                    </div>
                    <div>
                      <CardTitle className="text-lg">{user.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {user.email}
                      </CardDescription>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {user.role === "field_officer" ? "Field Officer" : "Agent"}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Calendar className="w-3 h-3" />
                      {new Date(user.createdAt).toLocaleDateString()} 
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{activeCourses}</div>
                      <div className="text-sm text-gray-600">Active</div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{completedCourses}</div>
                      <div className="text-sm text-gray-600">Completed</div>
                    </div>
                  </div>

                  {userEnrollments.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Recent Enrollments</h4>
                      <div className="space-y-2">
                        {userEnrollments.slice(0, 2).map((enrollment) => {
                          
                          const course = courses.find(c => c.id === enrollment.courseId)
                          return (
                            <div key={enrollment.id} className="text-sm p-2 bg-gray-50 rounded">
                              <div className="font-medium">{course?.title}</div>
                              <div className="flex justify-between text-gray-600">
                                <span>{enrollment.progress}% complete</span>
                                <span className="capitalize">{enrollment.status}</span>
                              </div>
                            </div> 
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredUsers.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">No users found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
