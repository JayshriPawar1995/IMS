"use client"

import type React from "react"

import { useEffect , useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Clock, HelpCircle, Trophy, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { database, type Quiz, type QuizQuestion, type Lesson } from "@/lib/database"

interface QuizManagementProps {
  courseId: string 
}

export function QuizManagement({ courseId }: QuizManagementProps) {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
const [lessons, setLessons] = useState<Lesson[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    lessonId: "",
    timeLimit: "",
    passingScore: "",
    maxAttempts: "",
    isFinalQuiz: false,
    status: "draft" as "active" | "draft",
  })
  const [questions, setQuestions] = useState<Omit<QuizQuestion, "id">[]>([])

  const { toast } = useToast()

  useEffect(() => {
  const fetchData = async () => {
    try {
      const [quizRes, lessonRes] = await Promise.all([ 
        fetch(`/api/quizzes?courseId=${courseId}`),
        fetch(`/api/lessons?courseId=${courseId}`),
      ])

      const quizzesData = await quizRes.json()
      const lessonsData = await lessonRes.json()

      setQuizzes(quizzesData)
      setLessons(lessonsData)
    } catch (err) {
      console.error("Failed to fetch quizzes/lessons:", err)
    }
  }

  fetchData()
}, [courseId])

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
        explanation: "",
        points: 10,
      },
    ])
  }

  const updateQuestion = (index: number, field: keyof Omit<QuizQuestion, "id">, value: any) => {
    const updated = [...questions]
    updated[index] = { ...updated[index], [field]: value }
    setQuestions(updated)
  }

  const updateQuestionOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updated = [...questions]
    const newOptions = [...updated[questionIndex].options]
    newOptions[optionIndex] = value
    updated[questionIndex] = { ...updated[questionIndex], options: newOptions }
    setQuestions(updated)
  }

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index))
  }

  

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  if (questions.length === 0) {
    toast({ title: "Please add at least one question", variant: "destructive" })
    return
  }

  const quizData = {
    ...formData,
    courseId,
    lessonId: formData.lessonId || null,
    timeLimit: Number.parseInt(formData.timeLimit) || 30,
    passingScore: Number.parseInt(formData.passingScore) || 70,
    maxAttempts: Number.parseInt(formData.maxAttempts) || 3,
    questions: questions.map((q, index) => ({ ...q, id: `q${index + 1}` })),
  }

  try {
    if (editingQuiz) {
      await fetch(`/api/quizzes/${editingQuiz.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quizData),
      })
      toast({ title: "Quiz updated successfully!" })
    } else {
      await fetch(`/api/quizzes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quizData),
      })
      toast({ title: "Quiz created successfully!" })
    }

    const res = await fetch(`/api/quizzes?courseId=${quizData.courseId}`)
    const data = await res.json()
    setQuizzes(data)
    resetForm()
  } catch (err) {
    toast({ title: "Something went wrong", variant: "destructive" }) 
  }
}


  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      lessonId: "",
      timeLimit: "",
      passingScore: "",
      maxAttempts: "",
      isFinalQuiz: false,
      status: "draft",
    })
    setQuestions([])
    setIsAddDialogOpen(false)
  }

  const handleEdit = (quiz: Quiz) => {
    setEditingQuiz(quiz)
    setFormData({
      title: quiz.title,
      description: quiz.description,
      lessonId: quiz.lessonId || "",
      timeLimit: quiz.timeLimit.toString(),
      passingScore: quiz.passingScore.toString(),
      maxAttempts: quiz.maxAttempts.toString(),
      isFinalQuiz: quiz.isFinalQuiz,
      status: quiz.status,
    })
    setQuestions(quiz.questions.map((q) => ({ ...q, id: undefined }) as any))
    setIsAddDialogOpen(true)
  }

  // const handleDelete = (quizId: string) => {
  //   if (confirm("Are you sure you want to delete this quiz?")) {
  //     database.deleteQuiz(quizId)
  //     setQuizzes(database.getQuizzes(courseId))
  //     toast({ title: "Quiz deleted successfully!" })
  //   }
  // }

  const handleDelete = async (quizId: string) => {
  if (confirm("Are you sure you want to delete this quiz?")) {
    await fetch(`/api/quizzes/${quizId}`, { method: "DELETE" })
    const res = await fetch(`/api/quizzes`)
    setQuizzes(await res.json())
    toast({ title: "Quiz deleted successfully!" })
  }
}


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold">Course Quizzes</h3>
          <p className="text-gray-600">Manage quizzes and assessments for this course</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Quiz
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingQuiz ? "Edit Quiz" : "Add New Quiz"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Quiz Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lessonId">Associated Lesson (Optional)</Label>
                  <Select
                    value={formData.lessonId}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, lessonId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select lesson or leave empty for course quiz" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No specific lesson</SelectItem>
                      {lessons.map((lesson) => (
                        <SelectItem key={lesson.id} value={lesson.id}>
                          {lesson.title}
                        </SelectItem>
                      ))}
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
                  required
                />
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
                  <Input
                    id="timeLimit"
                    type="number"
                    value={formData.timeLimit}
                    onChange={(e) => setFormData((prev) => ({ ...prev, timeLimit: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passingScore">Passing Score (%)</Label>
                  <Input
                    id="passingScore"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.passingScore}
                    onChange={(e) => setFormData((prev) => ({ ...prev, passingScore: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxAttempts">Max Attempts</Label>
                  <Input
                    id="maxAttempts"
                    type="number"
                    min="1"
                    value={formData.maxAttempts}
                    onChange={(e) => setFormData((prev) => ({ ...prev, maxAttempts: e.target.value }))}
                    required
                  />
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

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isFinalQuiz"
                  checked={formData.isFinalQuiz}
                  onChange={(e) => setFormData((prev) => ({ ...prev, isFinalQuiz: e.target.checked }))}
                  className="rounded"
                />
                <Label htmlFor="isFinalQuiz">This is the final course quiz (generates certificate)</Label>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-semibold">Questions</h4>
                  <Button type="button" onClick={addQuestion} variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Question
                  </Button>
                </div>

                {questions.map((question, questionIndex) => (
                  <Card key={questionIndex} className="p-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <h5 className="font-medium">Question {questionIndex + 1}</h5>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeQuestion(questionIndex)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <Label>Question Text</Label>
                        <Textarea
                          value={question.question}
                          onChange={(e) => updateQuestion(questionIndex, "question", e.target.value)}
                          placeholder="Enter your question here..."
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Answer Options</Label>
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`correct-${questionIndex}`}
                              checked={question.correctAnswer === optionIndex}
                              onChange={() => updateQuestion(questionIndex, "correctAnswer", optionIndex)}
                            />
                            <Input
                              value={option}
                              onChange={(e) => updateQuestionOption(questionIndex, optionIndex, e.target.value)}
                              placeholder={`Option ${optionIndex + 1}`}
                              required
                            />
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Explanation (Optional)</Label>
                          <Textarea
                            value={question.explanation}
                            onChange={(e) => updateQuestion(questionIndex, "explanation", e.target.value)}
                            placeholder="Explain why this answer is correct..."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Points</Label>
                          <Input
                            type="number"
                            min="1"
                            value={question.points}
                            onChange={(e) =>
                              updateQuestion(questionIndex, "points", Number.parseInt(e.target.value) || 10)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}

                {questions.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <HelpCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No questions added yet. Click "Add Question" to get started.</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">{editingQuiz ? "Update Quiz" : "Create Quiz"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {quizzes.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">No quizzes created yet. Add your first quiz to get started.</p>
            </CardContent>
          </Card>
        ) : (
          quizzes.map((quiz) => (
            <Card key={quiz.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {quiz.isFinalQuiz && <Trophy className="w-5 h-5 text-yellow-500" />}
                      {quiz.title}
                    </CardTitle>
                    <p className="text-sm text-gray-600">{quiz.description}</p>
                    {quiz.lessonId && (
                      <p className="text-xs text-blue-600 mt-1">
                        Associated with: {lessons.find((l) => l.id === quiz.lessonId)?.title}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(quiz)} title="Edit">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(quiz.id)} title="Delete">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-orange-500" />
                    <span>{quiz.timeLimit} min</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <HelpCircle className="w-4 h-4 text-blue-500" />
                    <span>{quiz.questions.length} questions</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-600">Passing: {quiz.passingScore}%</span>
                  </div>
                  <Badge variant={quiz.status === "active" ? "default" : "secondary"}>{quiz.status}</Badge>
                  {quiz.isFinalQuiz && (
                    <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                      Final Quiz
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
