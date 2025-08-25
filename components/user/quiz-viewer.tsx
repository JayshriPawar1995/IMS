"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Clock, ArrowLeft, ArrowRight, CheckCircle, XCircle, Trophy } from "lucide-react"
import { database, type Quiz, type QuizAttempt } from "@/lib/database"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"

interface QuizViewerProps {
  quiz: Quiz
  onComplete: () => void
  onBack: () => void
}

export function QuizViewer({ quiz, onComplete, onBack }: QuizViewerProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit * 60)
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [quizResult, setQuizResult] = useState<QuizAttempt | null>(null)
  const [loading, setLoading] = useState(false)
  const [startTime, setStartTime] = useState<Date | null>(null)

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

  const startQuiz = () => {
    setQuizStarted(true)
    setStartTime(new Date())
    setTimeLeft(quiz.timeLimit * 60)
  }

  const selectAnswer = (questionId: string, answerIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }))
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    }
  }

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }

  const submitQuiz = async () => {
    if (!user || !startTime) return

    setLoading(true)

    try {
      const result = database.submitQuizAttempt(user.id, quiz.id, answers)
      setQuizResult(result)
      setQuizCompleted(true)

      if (result.passed) {
        toast({ title: "Congratulations! You passed the quiz!" })
      } else {
        toast({ title: "Quiz completed. You can retake it to improve your score.", variant: "destructive" })
      }
    } catch (error) {
      console.error("Failed to submit quiz:", error)
      toast({ title: "Failed to submit quiz", variant: "destructive" })
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

  const currentQuestion = quiz.questions[currentQuestionIndex]
  const progress = quiz.questions.length > 0 ? ((currentQuestionIndex + 1) / quiz.questions.length) * 100 : 0

  if (!quizStarted) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {quiz.isFinalQuiz && <Trophy className="w-5 h-5 text-yellow-500" />}
              {quiz.title}
            </CardTitle>
            <CardDescription>{quiz.description}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <Clock className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                <p className="font-semibold">{quiz.timeLimit} Minutes</p>
                <p className="text-sm text-gray-600">Time Limit</p>
              </div>

              <div className="text-center p-4 border rounded-lg">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
                <p className="font-semibold">{quiz.passingScore}%</p>
                <p className="text-sm text-gray-600">Passing Score</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Instructions:</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Read each question carefully before selecting your answer</li>
                <li>• You can navigate between questions using the navigation buttons</li>
                <li>• Make sure to answer all questions before submitting</li>
                <li>• The quiz will auto-submit when time runs out</li>
                {quiz.isFinalQuiz && <li>• Passing this quiz will earn you a certificate</li>}
              </ul>
            </div>

            <Button onClick={startQuiz} className="w-full">
              Start Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (quizCompleted && quizResult) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              {quizResult.passed ? (
                <CheckCircle className="w-16 h-16 text-green-500" />
              ) : (
                <XCircle className="w-16 h-16 text-red-500" />
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
              <p className="text-gray-600">
                {
                  Object.values(quizResult.answers).filter(
                    (answer, index) => answer === quiz.questions[index]?.correctAnswer,
                  ).length
                }{" "}
                out of {quiz.questions.length} correct
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <p className="font-semibold">Required</p>
                <p className="text-2xl font-bold text-gray-600">{quiz.passingScore}%</p>
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
                <Trophy className="w-4 h-4" />
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
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{quiz.title}</h1>
        <div className="flex items-center gap-4">
          <Badge variant={timeLeft < 300 ? "destructive" : "secondary"}>
            <Clock className="w-3 h-3 mr-1" />
            {formatTime(timeLeft)}
          </Badge>
          <Badge variant="outline">
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </Badge>
        </div>
      </div>

      <Progress value={progress} className="h-2" />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Question {currentQuestionIndex + 1}</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-6">
            <p className="text-lg">{currentQuestion.question}</p>

            <RadioGroup
              value={answers[currentQuestion.id]?.toString()}
              onValueChange={(value) => selectAnswer(currentQuestion.id, Number.parseInt(value))}
            >
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
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
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            {getAnsweredCount()} of {quiz.questions.length} questions answered
          </p>
        </div>

        <div className="flex gap-2">
          {currentQuestionIndex === quiz.questions.length - 1 ? (
            <Button onClick={submitQuiz} disabled={loading || getAnsweredCount() < quiz.questions.length}>
              {loading ? "Submitting..." : "Submit Quiz"}
            </Button>
          ) : (
            <Button onClick={nextQuestion}>
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
