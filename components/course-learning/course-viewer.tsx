"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, CheckCircle, Clock, BookOpen, FileText, Video, Download, ArrowLeft, ArrowRight } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { QuizInterface } from "./quiz-interface"

interface Course {
  id: number
  title: string
  description: string
  modules: Module[]
  finalQuiz?: Quiz
  progress: number
  is_enrolled: boolean
}

interface Module {
  id: number
  title: string
  description: string
  lessons: Lesson[]
  quiz?: Quiz
  order_index: number
}

interface Lesson {
  id: number
  title: string
  content: string
  content_type: "text" | "video" | "pdf" | "interactive"
  video_url?: string
  file_path?: string
  duration_minutes: number
  order_index: number
  completed?: boolean
  time_spent?: number
}

// interface Quiz {
//   id: number
//   title: string
//   description: string
//   time_limit_minutes: number
//   passing_score: number
//   max_attempts: number
//   is_final_quiz: boolean
//   attempts_count?: number
//   best_score?: number
//   can_attempt?: boolean
// }

export interface Quiz {
  id: string,
  courseId: string,
  lessonId?: string,
  title: string,
  description: string,
  timeLimit: number,
  passingScore: number,
  maxAttempts: number,
  isFinalQuiz: boolean,
  questions: QuizQuestion[]
  status: "active" | "draft"
  createdAt: string,
  attemptscount: number,
  canAttempt: boolean,
  bestScore: number
  
}
export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
  points: number
}

export function CourseViewer({ courseId }: { courseId: string }) {
  const [course, setCourse] = useState<Course | null>(null)
  const [currentModule, setCurrentModule] = useState<Module | null>(null)
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null)
  const [loading, setLoading] = useState(true)
  const [lessonStartTime, setLessonStartTime] = useState<Date | null>(null)
  const [viewMode, setViewMode] = useState<"overview" | "lesson" | "quiz">("overview")

  useEffect(() => {
    loadCourse()
  }, [courseId])

  const loadCourse = async () => {
    try {
      setLoading(true)
      const response = await apiClient.getCourse(courseId)
      setCourse(response.data)

      // Set first module and lesson as default
      if (response.data.modules.length > 0) {
        const firstModule = response.data.modules[0]
        setCurrentModule(firstModule)
        if (firstModule.lessons.length > 0) {
          setCurrentLesson(firstModule.lessons[0])
        }
      }
    } catch (error) {
      console.error("Failed to load course:", error)
    } finally {
      setLoading(false)
    }
  }

  const startLesson = (lesson: Lesson) => {
    setCurrentLesson(lesson)
    setLessonStartTime(new Date())
    setViewMode("lesson")
  }

  const completeLesson = async () => {
    if (!currentLesson || !lessonStartTime) return

    const timeSpent = Math.round((new Date().getTime() - lessonStartTime.getTime()) / 60000)

    try {
      await apiClient.markLessonComplete(currentLesson.id.toString(), timeSpent)

      // Update lesson status
      if (currentLesson) {
        currentLesson.completed = true
        currentLesson.time_spent = timeSpent
      }

      // Reload course to update progress
      await loadCourse()
    } catch (error) {
      console.error("Failed to mark lesson complete:", error)
    }
  }

  const startQuiz = (quiz: Quiz) => {
    setCurrentQuiz(quiz)
    setViewMode("quiz")
  }

  const onQuizComplete = async () => {
    setViewMode("overview")
    await loadCourse()
  }

  const getNextLesson = () => {
    if (!currentModule || !currentLesson) return null

    const currentIndex = currentModule.lessons.findIndex((l) => l.id === currentLesson.id)
    if (currentIndex < currentModule.lessons.length - 1) {
      return currentModule.lessons[currentIndex + 1]
    }

    // Check next module
    if (!course) return null
    const moduleIndex = course.modules.findIndex((m) => m.id === currentModule.id)
    if (moduleIndex < course.modules.length - 1) {
      const nextModule = course.modules[moduleIndex + 1]
      return nextModule.lessons.length > 0 ? nextModule.lessons[0] : null
    }

    return null
  }

  const getPreviousLesson = () => {
    if (!currentModule || !currentLesson) return null

    const currentIndex = currentModule.lessons.findIndex((l) => l.id === currentLesson.id)
    if (currentIndex > 0) {
      return currentModule.lessons[currentIndex - 1]
    }

    // Check previous module
    if (!course) return null
    const moduleIndex = course.modules.findIndex((m) => m.id === currentModule.id)
    if (moduleIndex > 0) {
      const prevModule = course.modules[moduleIndex - 1]
      return prevModule.lessons.length > 0 ? prevModule.lessons[prevModule.lessons.length - 1] : null
    }

    return null
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Course not found</p>
      </div>
    )
  }

  if (viewMode === "quiz" && currentQuiz) {
    return <QuizInterface quiz={currentQuiz} onComplete={onQuizComplete} onBack={() => setViewMode("overview")} />
  }

  if (viewMode === "lesson" && currentLesson) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => setViewMode("overview")} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Course
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{currentLesson.title}</h1>
              <p className="text-muted-foreground">Module: {currentModule?.title}</p>
            </div>
            <Badge variant={currentLesson.completed ? "default" : "secondary"}>
              {currentLesson.completed ? "Completed" : "In Progress"}
            </Badge>
          </div>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            {currentLesson.content_type === "video" && currentLesson.video_url && (
              <div className="mb-6">
                <video controls className="w-full rounded-lg" src={currentLesson.video_url}>
                  Your browser does not support the video tag.
                </video>
              </div>
            )}

            {currentLesson.content_type === "pdf" && currentLesson.file_path && (
              <div className="mb-6 text-center">
                <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <Button asChild>
                  <a href={currentLesson.file_path} target="_blank" rel="noopener noreferrer">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </a>
                </Button>
              </div>
            )}

            <div className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: currentLesson.content }} />
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => {
              const prevLesson = getPreviousLesson()
              if (prevLesson) startLesson(prevLesson)
            }}
            disabled={!getPreviousLesson()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous Lesson
          </Button>

          <div className="flex gap-2">
            {!currentLesson.completed && (
              <Button onClick={completeLesson}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark Complete
              </Button>
            )}

            <Button
              onClick={() => {
                const nextLesson = getNextLesson()
                if (nextLesson) startLesson(nextLesson)
              }}
              disabled={!getNextLesson()}
            >
              Next Lesson
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
        <p className="text-muted-foreground mb-4">{course.description}</p>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Course Progress</span>
              <span className="text-sm text-muted-foreground">{course.progress}%</span>
            </div>
            <Progress value={course.progress} className="h-2" />
          </div>
        </div>
      </div>

      <Tabs defaultValue="modules" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="modules">Course Modules</TabsTrigger>
          <TabsTrigger value="final-quiz">Final Assessment</TabsTrigger>
        </TabsList>

        <TabsContent value="modules" className="space-y-6">
          {course.modules.map((module, index) => (
            <Card key={module.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">
                        {index + 1}
                      </span>
                      {module.title}
                    </CardTitle>
                    <CardDescription>{module.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  {module.lessons.map((lesson) => (
                    <div key={lesson.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {lesson.content_type === "video" && <Video className="h-4 w-4 text-blue-500" />}
                        {lesson.content_type === "text" && <BookOpen className="h-4 w-4 text-green-500" />}
                        {lesson.content_type === "pdf" && <FileText className="h-4 w-4 text-red-500" />}

                        <div>
                          <h4 className="font-medium">{lesson.title}</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {lesson.duration_minutes} min
                            {lesson.completed && (
                              <Badge variant="outline" className="ml-2"> 
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Completed
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        onClick={() => startLesson(lesson)}
                        variant={lesson.completed ? "outline" : "default"}
                      >
                        {lesson.completed ? "Review" : "Start"}
                        <Play className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  ))}

                  {module.quiz && (
                    <div className="mt-4 p-3 border rounded-lg bg-muted/50">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Module Quiz: {module.quiz.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {module.quiz.timeLimit} minutes • Passing score: {module.quiz.passingScore}%
                          </p>
                        </div>
                        <Button size="sm" onClick={() => startQuiz(module.quiz!)} disabled={!module.quiz.canAttempt}>
                          {(module.quiz.attemptscount ?? 0) > 0 ? "Retake" : "Start"} Quiz

                          {/* {module.quiz.attempts_count > 0 ? "Retake" : "Start"} Quiz */}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="final-quiz">
          {course.finalQuiz ? (
            <Card>
              <CardHeader>
                <CardTitle>Final Assessment</CardTitle>
                <CardDescription>Complete this final quiz to earn your certificate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Time Limit</p>
                      <p className="text-2xl font-bold">{course.finalQuiz.timeLimit} min</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Passing Score</p>
                      <p className="text-2xl font-bold">{course.finalQuiz.passingScore}%</p>
                    </div>
                  </div>

                  {(course.finalQuiz.attemptscount ?? 0) > 0 && (
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm font-medium mb-2">Previous Attempts</p>
                      <p className="text-sm text-muted-foreground">
                        Attempts: {course.finalQuiz.attemptscount}/{course.finalQuiz.maxAttempts}
                      </p>
                      <p className="text-sm text-muted-foreground">Best Score: {course.finalQuiz.bestScore}%</p>
                    </div>
                  )}

                  <Button
                    onClick={() => startQuiz(course.finalQuiz!)}
                    disabled={!course.finalQuiz.canAttempt}
                    className="w-full"
                  >
                    {(course.finalQuiz.attemptscount ?? 0) > 0 ? "Retake" : "Start"} Final Assessment
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">No final assessment available for this course</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
