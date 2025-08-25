"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clock, CheckCircle, Play } from "lucide-react"

interface Quiz {
  id: string
  title: string
  courseName: string
  questions: number
  duration: number
  attempts: number
  maxAttempts: number
  bestScore?: number
  status: "not_started" | "in_progress" | "completed"
  lastAttempt?: string
}

export function QuizSection() {
  const [quizzes] = useState<Quiz[]>([
    {
      id: "1",
      title: "Digital Booth Fundamentals Quiz",
      courseName: "Basics of Building Village Digital Booth",
      questions: 15,
      duration: 30,
      attempts: 2,
      maxAttempts: 3,
      bestScore: 85,
      status: "completed",
      lastAttempt: "2024-01-15",
    },
    {
      id: "2",
      title: "Customer Service Assessment",
      courseName: "Customer Service Excellence",
      questions: 20,
      duration: 45,
      attempts: 1,
      maxAttempts: 3,
      bestScore: 92,
      status: "completed",
      lastAttempt: "2024-01-10",
    },
    {
      id: "3",
      title: "Digital Marketing Quiz",
      courseName: "Digital Marketing for Agents",
      questions: 12,
      duration: 25,
      attempts: 0,
      maxAttempts: 3,
      status: "not_started",
    },
  ])

  const getStatusBadge = (quiz: Quiz) => {
    if (quiz.status === "completed") {
      const score = quiz.bestScore || 0
      if (score >= 80) {
        return <Badge className="bg-green-100 text-green-800">Passed</Badge>
      } else {
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>
      }
    } else if (quiz.status === "in_progress") {
      return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
    } else {
      return <Badge className="bg-gray-100 text-gray-800">Not Started</Badge>
    }
  }

  const getActionButton = (quiz: Quiz) => {
    if (quiz.attempts >= quiz.maxAttempts && quiz.status === "completed") {
      return (
        <Button variant="outline" className="w-full bg-transparent" disabled>
          Max Attempts Reached
        </Button>
      )
    }

    if (quiz.status === "not_started" || quiz.attempts < quiz.maxAttempts) {
      return (
        <Button className="w-full">
          <Play className="w-4 h-4 mr-2" />
          {quiz.status === "not_started" ? "Start Quiz" : "Retake Quiz"}
        </Button>
      )
    }

    return (
      <Button variant="outline" className="w-full bg-transparent">
        View Results
      </Button>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800">Quizzes</h2>
        <p className="text-gray-600">Test your knowledge with course quizzes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <Card key={quiz.id}>
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <CardTitle className="text-lg">{quiz.title}</CardTitle>
                {getStatusBadge(quiz)}
              </div>
              <p className="text-sm text-gray-600">{quiz.courseName}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                    <span className="text-gray-600">{quiz.questions} questions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-500" />
                    <span className="text-gray-600">{quiz.duration} min</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Attempts:</span>
                    <span className="font-medium">
                      {quiz.attempts}/{quiz.maxAttempts}
                    </span>
                  </div>
                  <Progress value={(quiz.attempts / quiz.maxAttempts) * 100} className="h-2" />
                </div>

                {quiz.bestScore !== undefined && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Best Score:</span>
                    <span className={`font-medium ${quiz.bestScore >= 80 ? "text-green-600" : "text-red-600"}`}>
                      {quiz.bestScore}%
                    </span>
                  </div>
                )}

                {quiz.lastAttempt && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Last Attempt:</span>
                    <span className="font-medium">{new Date(quiz.lastAttempt).toLocaleDateString()}</span>
                  </div>
                )}

                {getActionButton(quiz)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
