"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, MessageSquare, ArrowLeft } from "lucide-react"

interface CourseViewerProps {
  courseId: string
  onBack: () => void
}

export function CourseViewer({ courseId, onBack }: CourseViewerProps) {
  const [course, setCourse] = useState<any>(null)
  const [lessons, setLessons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        // ✅ Fetch course details
        const resCourse = await fetch(`/api/courses/${courseId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        const courseData = await resCourse.json()

        // ✅ Fetch lessons for this course
        const resLessons = await fetch(`/api/courses/${courseId}/lessons`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        const lessonsData = await resLessons.json()

        setCourse(courseData)
        setLessons(lessonsData)
      } catch (error) {
        console.error("Error fetching course or lessons:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCourseData()
  }, [courseId])

  if (loading) {
    return <p className="text-center py-8">Loading course...</p>
  }

  if (!course) {
    return <p className="text-center py-8 text-red-500">Course not found</p>
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Button variant="outline" onClick={onBack}>
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Courses
      </Button>

      {/* Course Info */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-2xl">{course.title}</CardTitle>
            <Badge>{course.level}</Badge>
          </div>
          <p className="text-gray-600 mt-2">{course.description}</p>
        </CardHeader>
      </Card>

      {/* Lessons List */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Lessons</h3>
        {lessons.length === 0 ? (
          <p className="text-gray-500">No lessons found for this course.</p>
        ) : (
          <div className="grid gap-4">
            {lessons.map((lesson, idx) => (
              <Card key={lesson.id} className="hover:shadow-md transition">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">
                      {idx + 1}. {lesson.title}
                    </CardTitle>
                    <Badge variant={lesson.isCompleted ? "default" : "secondary"}>
                      {lesson.isCompleted ? "Completed" : "Pending"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-3">{lesson.description}</p>
                  <div className="flex gap-3">
                    <Button>
                      <Play className="w-4 h-4 mr-2" /> Start Lesson
                    </Button>
                    <Button variant="outline">
                      <MessageSquare className="w-4 h-4 mr-2" /> Comments
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
