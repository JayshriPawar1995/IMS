"use client"

// Centralized in-memory database for the LMS
export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "agent" | "field_officer"
  avatar?: string
  createdAt: string
}

export interface Course {
  id: string
  title: string
  description: string
  instructor: string
  duration: string
  level: "beginner" | "intermediate" | "advanced"
  category: string
  status: "active" | "draft"
  thumbnail?: string
  enrolledStudents: number
  totalLessons: number
  totalQuizzes: number
  createdAt: string
  targetRole: "agent" | "field_officer" | "both"
}

export interface Lesson {
  id: string
  courseId: string
  title: string
  description: string
  content: string
  videoUrl?: string
  videoThumbnail?: string
  duration: number
  order: number
  status: "active" | "draft"
  createdAt: string
}

export interface Quiz {
  id: string
  courseId: string
  lessonId?: string
  title: string
  description: string
  timeLimit: number
  passingScore: number
  maxAttempts: number
  isFinalQuiz: boolean
  questions: QuizQuestion[]
  status: "active" | "draft"
  createdAt: string,
  
  
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
  points: number
}

export interface Enrollment {
  id: string
  userId: string
  courseId: string
  enrolledAt: string
  progress: number
  status: "active" | "completed" | "paused"
  completedLessons: string[]
  quizAttempts: QuizAttempt[]
}

export interface QuizAttempt {
  id: string
  quizId: string
  userId: string
  answers: Record<string, number>
  score: number
  passed: boolean
  attemptedAt: string
  timeTaken: number
}

export interface LessonProgress {
  id: string
  userId: string
  lessonId: string
  completed: boolean
  timeSpent: number
  completedAt?: string
}

export interface SupportTicket {
  id: string
  userId: string
  subject: string
  category: "technical" | "course" | "billing" | "general"
  priority: "low" | "medium" | "high" | "urgent"
  description: string
  status: "open" | "in_progress" | "resolved" | "closed"
  assignedTo?: string
  createdAt: string
  updatedAt: string
  responses: SupportResponse[]
}

export interface SupportResponse {
  id: string
  ticketId: string
  userId: string
  message: string
  isAdminResponse: boolean
  createdAt: string
  attachments?: string[]
}

// Database class
class Database {
  private users: User[] = [
    {
      id: "1",
      name: "Admin User",
      email: "admin@zaytoon.com",
      role: "admin",
      createdAt: "2024-01-01",
    },
    {
      id: "2",
      name: "Zuniyed Ahmed",
      email: "zuniyed@zaytoon.com",
      role: "agent",
      createdAt: "2024-01-02",
    },
    {
      id: "3",
      name: "Field Officer",
      email: "field@zaytoon.com",
      role: "field_officer",
      createdAt: "2024-01-03",
    },
  ]

  private courses: Course[] = [
    {
      id: "1",
      title: "Village Digital Booth",
      description: "Learn about how to build VBD and all things about it",
      instructor: "Audity Mehnaz",
      duration: "6 weeks",
      level: "beginner",
      category: "VBD",
      status: "active",
      enrolledStudents: 45,
      totalLessons: 8,
      totalQuizzes: 3,
      createdAt: "2024-01-15",
      targetRole: "both",
    },
    {
      id: "2",
      title: "Bangla QR",
      description: "Learn everything about Bangla QR",
      instructor: "Audity Mehnaz",
      duration: "4 weeks",
      level: "advanced",
      category: "Bangla QR",
      status: "active",
      enrolledStudents: 32,
      totalLessons: 6,
      totalQuizzes: 2,
      createdAt: "2024-01-10",
      targetRole: "agent",
    },
  ]

  private lessons: Lesson[] = [
    {
      id: "1",
      courseId: "1",
      title: "Introduction to VDB",
      description: "Overview of VDB landscape and key concepts",
      content:
        "<h2>Welcome to VDB</h2><p>VDB encompasses all marketing efforts that use electronic devices or the internet. This includes search engine optimization, social media marketing, email marketing, and more.</p>",
      videoUrl: "https://www.youtube.com/watch?v=bixR-KIJKYM",
      videoThumbnail: "https://img.youtube.com/vi/bixR-KIJKYM/maxresdefault.jpg",
      duration: 15,
      order: 1,
      status: "active",
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      courseId: "1",
      title: "Understanding Your VDB",
      description: "Learn how to identify and analyze your target market",
      content:
        "<h2>VDB Analysis</h2><p>Understanding your VDB is crucial for effective marketing. Learn about demographics, psychographics, and behavioral patterns.</p>",
      videoUrl: "https://www.youtube.com/watch?v=iuL8hHjHvzA",
      videoThumbnail: "https://img.youtube.com/vi/iuL8hHjHvzA/maxresdefault.jpg",
      duration: 20,
      order: 2,
      status: "active",
      createdAt: "2024-01-15",
    },
  ]

  private quizzes: Quiz[] = [
    {
      id: "1",
      courseId: "1",
      lessonId: "1",
      title: "VDB Basics Quiz",
      description: "Test your understanding of VDB fundamentals",
      timeLimit: 10,
      passingScore: 70,
      maxAttempts: 3,
      isFinalQuiz: false,
      status: "active",
      createdAt: "2024-01-15",
      questions: [
        {
          id: "1",
          question: "What does SEO stand for?",
          options: [
            "Search Engine Optimization",
            "Social Engine Optimization",
            "Search Engine Operation",
            "Social Engine Operation",
          ],
          correctAnswer: 0,
          explanation:
            "SEO stands for Search Engine Optimization, which is the practice of increasing website visibility in search engines.",
          points: 10,
        },
        {
          id: "2",
          question: "Which platform is primarily used for professional networking?",
          options: ["Facebook", "Instagram", "LinkedIn", "TikTok"],
          correctAnswer: 2,
          explanation: "LinkedIn is the primary platform for professional networking and B2B marketing.",
          points: 10,
        },
      ],
    },
  ]

  private enrollments: Enrollment[] = [
    {
      id: "1",
      userId: "2",
      courseId: "1",
      enrolledAt: "2024-01-20",
      progress: 25,
      status: "active",
      completedLessons: ["1"],
      quizAttempts: [],
    },
  ]

  private lessonProgress: LessonProgress[] = [
    {
      id: "1",
      userId: "2",
      lessonId: "1",
      completed: true,
      timeSpent: 15,
      completedAt: "2024-01-20",
    },
  ]

  private supportTickets: SupportTicket[] = [
    {
      id: "1",
      userId: "2",
      subject: "Unable to access course videos",
      category: "technical",
      priority: "high",
      description:
        "I'm having trouble loading the video content in the VDB course. The videos won't play and I get an error message.",
      status: "open",
      createdAt: "2024-01-25T10:30:00Z",
      updatedAt: "2024-01-25T10:30:00Z",
      responses: [],
    },
    {
      id: "2",
      userId: "3",
      subject: "Quiz submission not working",
      category: "technical",
      priority: "medium",
      description:
        "When I try to submit my quiz answers, the page refreshes but my answers aren't saved. This has happened multiple times.",
      status: "in_progress",
      assignedTo: "1",
      createdAt: "2024-01-24T14:15:00Z",
      updatedAt: "2024-01-25T09:00:00Z",
      responses: [
        {
          id: "1",
          ticketId: "2",
          userId: "1",
          message:
            "Thank you for reporting this issue. We're investigating the quiz submission problem and will have a fix deployed soon. In the meantime, please try using a different browser.",
          isAdminResponse: true,
          createdAt: "2024-01-25T09:00:00Z",
        },
      ],
    },
    {
      id: "3",
      userId: "2",
      subject: "Certificate not generated",
      category: "course",
      priority: "low",
      description:
        "I completed the VDB course but haven't received my certificate yet. Could you please check my completion status?",
      status: "resolved",
      assignedTo: "1",
      createdAt: "2024-01-23T16:45:00Z",
      updatedAt: "2024-01-24T11:30:00Z",
      responses: [
        {
          id: "2",
          ticketId: "3",
          userId: "1",
          message:
            "I've checked your course completion status and can see that you've successfully completed all requirements. Your certificate has been generated and is now available in your certificates section.",
          isAdminResponse: true,
          createdAt: "2024-01-24T11:30:00Z",
        },
      ],
    },
  ]

  // Course methods
  getCourses(): Course[] {
    return [...this.courses]
  }

  getCourse(id: string): Course | undefined {
    return this.courses.find((course) => course.id === id)
  }

  createCourse(
    course: Omit<Course, "id" | "createdAt" | "enrolledStudents" | "totalLessons" | "totalQuizzes">,
  ): Course {
    const newCourse: Course = {
      ...course,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      enrolledStudents: 0,
      totalLessons: 0,
      totalQuizzes: 0,
    }
    this.courses.push(newCourse)
    return newCourse
  }

  updateCourse(id: string, updates: Partial<Course>): Course | undefined {
    const index = this.courses.findIndex((course) => course.id === id)
    if (index !== -1) {
      this.courses[index] = { ...this.courses[index], ...updates }
      return this.courses[index]
    }
    return undefined
  }

  deleteCourse(id: string): boolean {
    const index = this.courses.findIndex((course) => course.id === id)
    if (index !== -1) {
      this.courses.splice(index, 1)
      // Also delete related lessons and quizzes
      this.lessons = this.lessons.filter((lesson) => lesson.courseId !== id)
      this.quizzes = this.quizzes.filter((quiz) => quiz.courseId !== id)
      return true
    }
    return false
  }

  // Lesson methods
  getLessons(courseId?: string): Lesson[] {
    if (courseId) {
      return this.lessons.filter((lesson) => lesson.courseId === courseId).sort((a, b) => a.order - b.order)
    }
    return [...this.lessons]
  }

  getLesson(id: string): Lesson | undefined {
    return this.lessons.find((lesson) => lesson.id === id)
  }

  createLesson(lesson: Omit<Lesson, "id" | "createdAt">): Lesson {
    const newLesson: Lesson = {
      ...lesson,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    this.lessons.push(newLesson)

    // Update course total lessons count
    const course = this.getCourse(lesson.courseId)
    if (course) {
      this.updateCourse(course.id, { totalLessons: course.totalLessons + 1 })
    }

    return newLesson
  }

  updateLesson(id: string, updates: Partial<Lesson>): Lesson | undefined {
    const index = this.lessons.findIndex((lesson) => lesson.id === id)
    if (index !== -1) {
      this.lessons[index] = { ...this.lessons[index], ...updates }
      return this.lessons[index]
    }
    return undefined
  }

  deleteLesson(id: string): boolean {
    const lesson = this.getLesson(id)
    if (!lesson) return false

    const index = this.lessons.findIndex((l) => l.id === id)
    if (index !== -1) {
      this.lessons.splice(index, 1)

      // Update course total lessons count
      const course = this.getCourse(lesson.courseId)
      if (course) {
        this.updateCourse(course.id, { totalLessons: Math.max(0, course.totalLessons - 1) })
      }

      return true
    }
    return false
  }

  // Quiz methods
  getQuizzes(courseId?: string): Quiz[] {
    if (courseId) {
      return this.quizzes.filter((quiz) => quiz.courseId === courseId)
    }
    return [...this.quizzes]
  }

  getQuiz(id: string): Quiz | undefined {
    return this.quizzes.find((quiz) => quiz.id === id)
  }

  createQuiz(quiz: Omit<Quiz, "id" | "createdAt">): Quiz {
    const newQuiz: Quiz = {
      ...quiz,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    this.quizzes.push(newQuiz)

    // Update course total quizzes count
    const course = this.getCourse(quiz.courseId)
    if (course) {
      this.updateCourse(course.id, { totalQuizzes: course.totalQuizzes + 1 })
    }

    return newQuiz
  }

  updateQuiz(id: string, updates: Partial<Quiz>): Quiz | undefined {
    const index = this.quizzes.findIndex((quiz) => quiz.id === id)
    if (index !== -1) {
      this.quizzes[index] = { ...this.quizzes[index], ...updates }
      return this.quizzes[index]
    }
    return undefined
  }

  deleteQuiz(id: string): boolean {
    const quiz = this.getQuiz(id)
    if (!quiz) return false

    const index = this.quizzes.findIndex((q) => q.id === id)
    if (index !== -1) {
      this.quizzes.splice(index, 1)

      // Update course total quizzes count
      const course = this.getCourse(quiz.courseId)
      if (course) {
        this.updateCourse(course.id, { totalQuizzes: Math.max(0, course.totalQuizzes - 1) })
      }

      return true
    }
    return false
  }

  // Enrollment methods
  getEnrollments(userId?: string): Enrollment[] {
    if (userId) {
      return this.enrollments.filter((enrollment) => enrollment.userId === userId)
    }
    return [...this.enrollments]
  }

  getEnrollment(userId: string, courseId: string): Enrollment | undefined {
    return this.enrollments.find((enrollment) => enrollment.userId === userId && enrollment.courseId === courseId)
  }

  enrollUser(userId: string, courseId: string): Enrollment {
    const existingEnrollment = this.getEnrollment(userId, courseId)
    if (existingEnrollment) {
      return existingEnrollment
    }

    const newEnrollment: Enrollment = {
      id: Date.now().toString(),
      userId,
      courseId,
      enrolledAt: new Date().toISOString(),
      progress: 0,
      status: "active",
      completedLessons: [],
      quizAttempts: [],
    }

    this.enrollments.push(newEnrollment)

    // Update course enrolled students count
    const course = this.getCourse(courseId)
    if (course) {
      this.updateCourse(courseId, { enrolledStudents: course.enrolledStudents + 1 })
    }

    return newEnrollment
  }

  // Progress methods
  getLessonProgress(userId: string, lessonId: string): LessonProgress | undefined {
    return this.lessonProgress.find((progress) => progress.userId === userId && progress.lessonId === lessonId)
  }

  markLessonComplete(userId: string, lessonId: string, timeSpent: number): LessonProgress {
    const existing = this.getLessonProgress(userId, lessonId)
    if (existing) {
      existing.completed = true
      existing.timeSpent = timeSpent
      existing.completedAt = new Date().toISOString()
      return existing
    }

    const newProgress: LessonProgress = {
      id: Date.now().toString(),
      userId,
      lessonId,
      completed: true,
      timeSpent,
      completedAt: new Date().toISOString(),
    }

    this.lessonProgress.push(newProgress)

    // Update enrollment progress
    const lesson = this.getLesson(lessonId)
    if (lesson) {
      const enrollment = this.getEnrollment(userId, lesson.courseId)
      if (enrollment && !enrollment.completedLessons.includes(lessonId)) {
        enrollment.completedLessons.push(lessonId)
        const totalLessons = this.getLessons(lesson.courseId).length
        enrollment.progress = Math.round((enrollment.completedLessons.length / totalLessons) * 100)

        if (enrollment.progress === 100) {
          enrollment.status = "completed"
        }
      }
    }

    return newProgress
  }

  // Quiz attempt methods
  submitQuizAttempt(userId: string, quizId: string, answers: Record<string, number>): QuizAttempt {
    const quiz = this.getQuiz(quizId)
    if (!quiz) throw new Error("Quiz not found")

    let correctAnswers = 0
    quiz.questions.forEach((question) => {
      if (answers[question.id] === question.correctAnswer) {
        correctAnswers++
      }
    })

    const score = Math.round((correctAnswers / quiz.questions.length) * 100)
    const passed = score >= quiz.passingScore

    const attempt: QuizAttempt = {
      id: Date.now().toString(),
      quizId,
      userId,
      answers,
      score,
      passed,
      attemptedAt: new Date().toISOString(),
      timeTaken: 0,
    }

    // Add to enrollment quiz attempts
    const enrollment = this.getEnrollment(userId, quiz.courseId)
    if (enrollment) {
      enrollment.quizAttempts.push(attempt)
    }

    return attempt
  }

  // User methods
  getUsers(): User[] {
    return [...this.users]
  }

  getUser(id: string): User | undefined {
    return this.users.find((user) => user.id === id)
  }

  getUserByEmail(email: string): User | undefined {
    return this.users.find((user) => user.email === email)
  }

  // Support Ticket methods
  getSupportTickets(): SupportTicket[] {
    return [...this.supportTickets].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  }

  getSupportTicket(id: string): SupportTicket | undefined {
    return this.supportTickets.find((ticket) => ticket.id === id)
  }

  getUserSupportTickets(userId: string): SupportTicket[] {
    return this.supportTickets
      .filter((ticket) => ticket.userId === userId)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  }

  createSupportTicket(ticket: Omit<SupportTicket, "id" | "createdAt" | "updatedAt" | "responses">): SupportTicket {
    const newTicket: SupportTicket = {
      ...ticket,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      responses: [],
    }
    this.supportTickets.push(newTicket)
    return newTicket
  }

  updateSupportTicket(id: string, updates: Partial<SupportTicket>): SupportTicket | undefined {
    const index = this.supportTickets.findIndex((ticket) => ticket.id === id)
    if (index !== -1) {
      this.supportTickets[index] = {
        ...this.supportTickets[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      }
      return this.supportTickets[index]
    }
    return undefined
  }

  addSupportResponse(ticketId: string, response: Omit<SupportResponse, "id" | "createdAt">): SupportResponse {
    const ticket = this.getSupportTicket(ticketId)
    if (!ticket) throw new Error("Ticket not found")

    const newResponse: SupportResponse = {
      ...response,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }

    ticket.responses.push(newResponse)
    ticket.updatedAt = new Date().toISOString()

    // Auto-update status if admin responds
    if (response.isAdminResponse && ticket.status === "open") {
      ticket.status = "in_progress"
    }

    return newResponse
  }

  getSupportTicketStats() {
    const tickets = this.getSupportTickets()
    return {
      total: tickets.length,
      open: tickets.filter((t) => t.status === "open").length,
      inProgress: tickets.filter((t) => t.status === "in_progress").length,
      resolved: tickets.filter((t) => t.status === "resolved").length,
      closed: tickets.filter((t) => t.status === "closed").length,
      urgent: tickets.filter((t) => t.priority === "urgent").length,
      high: tickets.filter((t) => t.priority === "high").length,
    }
  }
}

// Export singleton instance
export const database = new Database()
