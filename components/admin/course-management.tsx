"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Users, Clock, BookOpen, Play } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
//import { database, type Course } from "@/lib/database"
import type { Course } from "@/lib/database" 
import { LessonManagement } from "./lesson-management"
import { QuizManagement } from "./quiz-management"

export function CourseManagement() {
const [courses, setCourses] = useState<Course[]>([])
const  [loading, setLoading] = useState(true)

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [viewMode, setViewMode] = useState<"courses" | "lessons" | "quizzes">("courses")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    instructor: "",
    duration: "",
    level: "beginner" as "beginner" | "intermediate" | "advanced",
    category: "",
    targetRole: "" as "agent" | "field_officer" | "both" | "",
    status: "draft" as "active" | "draft",
  })

  const { toast } = useToast()

 useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("/api/courses")
        if (!res.ok) throw new Error("Failed to load courses")

        const data = await res.json()
        setCourses(data)
      } catch (err) {
        console.error(err)
        toast({ title: "Error fetching courses", description: String(err), variant: "destructive" })
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [toast])

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  try {
    if (editingCourse) {
      // Update course (you can add an update API later)
      const res = await fetch(`/api/courses/${editingCourse.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error("Failed to update course")

      toast({ title: "Course updated successfully!" }) 
      setEditingCourse(null)
    } else {
      // Insert new course
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error("Failed to create course")  

      const data = await res.json()
      console.log("Inserted Course ID:", data.id)

      toast({ title: "Course created successfully!" })
    }

    // ✅ Refresh courses list after add/update
    const coursesRes = await fetch("/api/courses")
    const coursesData = await coursesRes.json()
    setCourses(coursesData)

    // Reset form + close dialog
    setFormData({
      title: "",
      description: "",
      instructor: "",
      duration: "",
      level: "beginner",
      category: "",
      targetRole: "",
      status: "draft",
    })
    setIsAddDialogOpen(false)
  } catch (err) {
    console.error(err)
    toast({ title: "Something went wrong", description: String(err), variant: "destructive" })
  }
}


  const handleEdit = (course: Course) => {
    setEditingCourse(course)
    setFormData({
      title: course.title,
      description: course.description,
      instructor: course.instructor,
      duration: course.duration,
      level: course.level,
      category: course.category,
      targetRole: course.targetRole,
      status: course.status,  
    })
    setIsAddDialogOpen(true)
  }

  const handleDelete = async (courseId: string) => {
  if (confirm("Are you sure you want to delete this course? This will also delete all lessons and quizzes.")) {
    try {
      const res = await fetch(`/api/courses/${courseId}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        throw new Error("Failed to delete course")
      }

      // ✅ Remove course from UI after successful delete
      setCourses((prev) => prev.filter((c) => c.id !== courseId))

      toast({ title: "Course deleted successfully!" })
    } catch (err) {
      console.error(err)
      toast({
        title: "Error deleting course",
        description: String(err),
        variant: "destructive",
      })
    }
  }
}


  const handleManageLessons = (course: Course) => {
    setSelectedCourse(course)
    setViewMode("lessons")
  }

  const handleManageQuizzes = (course: Course) => {
    setSelectedCourse(course)
    setViewMode("quizzes")
  }

  if (viewMode === "lessons" && selectedCourse) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setViewMode("courses")}>
            ← Back to Courses
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Manage Lessons</h2>
            <p className="text-gray-600">{selectedCourse.title}</p>
          </div>
        </div>
        <LessonManagement courseId={selectedCourse.id} />
      </div>
    )
  }

  if (viewMode === "quizzes" && selectedCourse) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setViewMode("courses")}>
            ← Back to Courses
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Manage Quizzes</h2>
            <p className="text-gray-600">{selectedCourse.title}</p>
          </div>
        </div>
        <QuizManagement courseId={selectedCourse.id} />
      </div>
    )
  }

 

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Course Management</h2>
          <p className="text-gray-600">Create and manage courses for your LMS</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Course
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingCourse ? "Edit Course" : "Add New Course"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Course Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instructor">Instructor</Label>
                  <Input
                    id="instructor"
                    value={formData.instructor}
                    onChange={(e) => setFormData((prev) => ({ ...prev, instructor: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    placeholder="e.g., 4 weeks"
                    value={formData.duration}
                    onChange={(e) => setFormData((prev) => ({ ...prev, duration: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="level">Level</Label>
                  <Select
                    value={formData.level}
                    onValueChange={(value: "beginner" | "intermediate" | "advanced") =>
                      setFormData((prev) => ({ ...prev, level: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="targetRole">Target Role</Label>
                  <Select
                    value={formData.targetRole}
                    onValueChange={(value: "agent" | "field_officer" | "both") =>
                      setFormData((prev) => ({ ...prev, targetRole: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select target role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="agent">Agent Only</SelectItem>
                      <SelectItem value="field_officer">Field Officer Only</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
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
                    setEditingCourse(null)
                    setFormData({
                      title: "",
                      description: "",
                      instructor: "",
                      duration: "",
                      level: "beginner",
                      category: "",
                      targetRole: "",
                      status: "draft",
                    })
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">{editingCourse ? "Update Course" : "Create Course"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(course)} title="Edit Course">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(course.id)} title="Delete Course">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
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
                <div className="flex items-center gap-2 text-sm">
                  <Play className="w-4 h-4 text-purple-500" />
                  <span>{course.totalQuizzes} Quizzes</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-4">
                <Badge variant={course.status === "active" ? "default" : "secondary"}>{course.status}</Badge>
                <Badge variant="outline">
  {course.targetRole}
</Badge>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleManageLessons(course)} className="flex-1">
                  <BookOpen className="w-4 h-4 mr-1" />
                  Lessons
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleManageQuizzes(course)} className="flex-1">
                  <Play className="w-4 h-4 mr-1" />
                  Quizzes
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
