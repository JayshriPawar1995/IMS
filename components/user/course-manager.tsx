"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, Clock, Users, Play, Search } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { CourseViewer } from "./course-viewer"

export function CourseManager() { 
  const { user } = useAuth()
  const [courses, setCourses] = useState<any[]>([])
  const [enrollments, setEnrollments] = useState<any[]>([])
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterLevel, setFilterLevel] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  // ✅ Fetch courses from backend
  useEffect(() => {
    const fetchCourses = async () => {
      try {
       const res = await fetch("/api/user_courses", {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`, // 👈 attach token
  },
});
        const data = await res.json()
        if (res.ok) {
          setCourses(data) 
        } else {
          console.error(data.error)
        }
      } catch (error) {
        console.error("Error fetching courses:", error) 
      }
    }

    const fetchEnrollments = async () => {
      if (!user) return
      try {
        const res = await fetch(`/api/enrollments?userId=${user.id}`, { credentials: "include" })
        const data = await res.json()
        if (res.ok) {
          setEnrollments(data)
        } else {
          console.error(data.error)
        }
      } catch (error) {
        console.error("Error fetching enrollments:", error)
      }
    }

    fetchCourses()
    fetchEnrollments()
  }, [user])

  // ✅ Filter courses
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLevel = filterLevel === "all" || course.level === filterLevel
    const matchesRole = course.targetRole === "both" || course.targetRole === user?.role

    let matchesStatus = true
    if (filterStatus === "enrolled") {
      matchesStatus = enrollments.some((e) => e.courseId === course.id)
    } else if (filterStatus === "available") {
      matchesStatus = !enrollments.some((e) => e.courseId === course.id)
    }

    return matchesSearch && matchesLevel && matchesRole && matchesStatus && course.status === "active"
  })

  const getEnrollment = (courseId: string) => {
    return enrollments.find((e) => e.courseId === courseId)
  }

  // ✅ Course Viewer (Detail Page)
  if (selectedCourse) {
    return <CourseViewer courseId={selectedCourse} onBack={() => setSelectedCourse(null)} />
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800">My Courses</h2>
        <p className="text-gray-600">Explore and enroll in available courses</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterLevel} onValueChange={setFilterLevel}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                <SelectItem value="enrolled">Enrolled</SelectItem>
                <SelectItem value="available">Available</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Enrolled Courses */}
      {enrollments.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">My Enrolled Courses</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map((enrollment) => {
              const course = courses.find((c) => c.id === enrollment.courseId)
              if (!course) return null

              return (
                <Card key={enrollment.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                      <Badge variant={enrollment.status === "completed" ? "default" : "secondary"}>
                        {enrollment.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{course.description}</p>

                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{enrollment.progress}%</span>
                      </div>
                      <Progress value={enrollment.progress} className="h-2" />
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-orange-500" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <BookOpen className="w-4 h-4 text-blue-500" />
                      <span>{course.totalLessons} Lessons</span>
                    </div>

                    <Button className="w-full mt-3" onClick={() => setSelectedCourse(course.id)}>
                      {enrollment.status === "completed" ? "Review Course" : "Continue Learning"}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Available Courses */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">{enrollments.length > 0 ? "Available Courses" : "All Courses"}</h3>
        {filteredCourses.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">No courses found matching your criteria.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
              const enrollment = getEnrollment(course.id)

              return (
                <Card key={course.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                      <Badge variant="outline">{course.level}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{course.description}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-orange-500" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <BookOpen className="w-4 h-4 text-blue-500" />
                        <span>{course.totalLessons} Lessons</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-green-500" />
                        <span>{course.enrolledStudents} Students</span>
                      </div>
                    </div>

                    <Button
                      className="w-full"
                      onClick={() => setSelectedCourse(course.id)}
                      variant={enrollment ? "outline" : "default"}
                    >
                      {enrollment ? "Continue Course" : "View Course"}
                      <Play className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
} 
