"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Clock, ArrowLeft, ArrowRight, CheckCircle, XCircle, Trophy, AlertTriangle } from "lucide-react"
import { apiClient } from "@/lib/api-client"

// interface Quiz {
//   id: number
//   title: string
//   description: string
//   time_limit_minutes: number
//   passing_score: number
//   max_attempts: number
//   is_final_quiz: boolean
//   questions?: QuizQuestion[]
//   attempts_count?: number
//   best_score?: number
//   can_attempt?: boolean
// }
export interface Quiz {
  id: string
  courseId: string
   lessonId?: string
  title: string
  description: string
  timeLimit: number
  passingScore: number
  isFinalQuiz: boolean
  questions: QuizQuestion[]
  status: "active" | "draft"
  createdAt: string
  attemptscount: number
  maxAttempts: number
   can_attempt?: boolean
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
  points: number
}

interface QuizInterfaceProps {
  quiz: Quiz
  onComplete: () => void
  onBack: () => void
}

export function QuizInterface({ quiz, onComplete, onBack }: QuizInterfaceProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
 
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit * 60)
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [quizResult, setQuizResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [startTime, setStartTime] = useState<Date | null>(null)

  useEffect(() => {
    loadQuizQuestions()
  }, [quiz.id])

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (quizStarted && !quizCompleted && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            submitQuiz()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [quizStarted, quizCompleted, timeLeft])

  const loadQuizQuestions = async () => {
    try {
      const response = await apiClient.getQuiz(quiz.id.toString())
      setQuestions(response.data.questions || [])
    } catch (error) {
      console.error("Failed to load quiz questions:", error)
    }
  }

  const startQuiz = () => {
    setQuizStarted(true)
    setStartTime(new Date())
    setTimeLeft(quiz.timeLimit * 60)
  }

  const selectAnswer = (questionId: number, answerIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }))
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    }
  }

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }

  const submitQuiz = async () => {
    if (!startTime) return

    setLoading(true)

    try {
      const timeTaken = Math.round((new Date().getTime() - startTime.getTime()) / 60000)

      const response = await apiClient.submitQuiz(quiz.id.toString(), answers, startTime.toISOString(), timeTaken)

      setQuizResult(response.data)
      setQuizCompleted(true)
    } catch (error) {
      console.error("Failed to submit quiz:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getAnsweredCount = () => {
    return Object.keys(answers).length
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0

  if (!quizStarted) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {quiz.isFinalQuiz && <Trophy className="h-5 w-5 text-yellow-500" />}
              {quiz.title}
            </CardTitle>
            <CardDescription>{quiz.description}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <Clock className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                <p className="font-semibold">{quiz.timeLimit} Minutes</p>
                <p className="text-sm text-muted-foreground">Time Limit</p>
              </div>

              <div className="text-center p-4 border rounded-lg">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <p className="font-semibold">{quiz.passingScore}%</p>
                <p className="text-sm text-muted-foreground">Passing Score</p>
              </div>
            </div>

            {quiz.attemptscount !== undefined && quiz.attemptscount > 0 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  You have attempted this quiz {quiz.attemptscount} out of {quiz.maxAttempts} times.
                  {quiz.passingScore !== undefined && ` Your best score: ${quiz.passingScore}%`}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <h3 className="font-semibold">Instructions:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Read each question carefully before selecting your answer</li>
                <li>• You can navigate between questions using the navigation buttons</li>
                <li>• Make sure to answer all questions before submitting</li>
                <li>• The quiz will auto-submit when time runs out</li>
                {quiz.isFinalQuiz && <li>• Passing this quiz will earn you a certificate</li>}
              </ul>
            </div>

            <Button onClick={startQuiz} className="w-full" disabled={!quiz.can_attempt}>
              {quiz.can_attempt ? "Start Quiz" : "Maximum attempts reached"}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (quizCompleted && quizResult) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              {quizResult.passed ? (
                <CheckCircle className="h-16 w-16 text-green-500" />
              ) : (
                <XCircle className="h-16 w-16 text-red-500" />
              )}
            </div>
            <CardTitle className="text-2xl">{quizResult.passed ? "Congratulations!" : "Quiz Completed"}</CardTitle>
            <CardDescription>
              {quizResult.passed
                ? "You have successfully passed the quiz!"
                : "You can retake the quiz to improve your score."}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{quizResult.score}%</div>
              <p className="text-muted-foreground">
                {quizResult.correct_answers} out of {quizResult.total_questions} correct
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <p className="font-semibold">Required</p>
                <p className="text-2xl font-bold text-muted-foreground">{quiz.passingScore}%</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <p className="font-semibold">Your Score</p>
                <p className={`text-2xl font-bold ${quizResult.passed ? "text-green-500" : "text-red-500"}`}>
                  {quizResult.score}%
                </p>
              </div>
            </div>

            {quiz.isFinalQuiz && quizResult.passed && (
              <Alert>
                <Trophy className="h-4 w-4" />
                <AlertDescription>
                  Congratulations! You have earned a certificate for completing this course. Check your certificates
                  section to download it.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2">
              <Button variant="outline" onClick={onBack} className="flex-1 bg-transparent">
                Back to Course
              </Button>
              <Button onClick={onComplete} className="flex-1">
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">{quiz.title}</h1>
          <div className="flex items-center gap-4">
            <Badge variant={timeLeft < 300 ? "destructive" : "secondary"}>
              <Clock className="h-3 w-3 mr-1" />
              {formatTime(timeLeft)}
            </Badge>
            <Badge variant="outline">
              Question {currentQuestionIndex + 1} of {questions.length}
            </Badge>
          </div>
        </div>

        <Progress value={progress} className="h-2" />
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Question {currentQuestionIndex + 1}</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-6">
            <p className="text-lg">{currentQuestion.question}</p>

            <RadioGroup
              
           value={answers[Number(currentQuestion.id)]?.toString()}

             onValueChange={(value: string) => selectAnswer(Number(currentQuestion.id), parseInt(value, 10))}


              
            >
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={previousQuestion} disabled={currentQuestionIndex === 0}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {getAnsweredCount()} of {questions.length} questions answered
          </p>
        </div>

        <div className="flex gap-2">
          {currentQuestionIndex === questions.length - 1 ? (
            <Button onClick={submitQuiz} disabled={loading || getAnsweredCount() < questions.length}>
              {loading ? "Submitting..." : "Submit Quiz"}
            </Button>
          ) : (
            <Button onClick={nextQuestion}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
