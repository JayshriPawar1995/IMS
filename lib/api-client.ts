"use client"

/**
 * Centralized API helper for the Zaytoon LMS frontend
 * Updated to work with PHP Laravel backend
 */

const DEFAULT_BASE =
  process.env.NODE_ENV === "production" ? "https://your-php-backend.com/api" : "http://localhost:8000/api"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || DEFAULT_BASE

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  errors?: Record<string, string[]>
}

class ApiClient {
  private token: string | null

  constructor() {
    this.token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null
  }

  /* -------------------------------------------------- */
  /*  Helpers                                           */
  /* -------------------------------------------------- */
  setToken(token: string) {
    this.token = token
    if (typeof window !== "undefined") localStorage.setItem("auth_token", token)
  }

  clearToken() {
    this.token = null
    if (typeof window !== "undefined") localStorage.removeItem("auth_token")
  }

  private async request<T = unknown>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${BASE_URL}${endpoint}`
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers,
    }
    if (this.token) headers.Authorization = `Bearer ${this.token}`

    try {
      const res = await fetch(url, { ...options, headers })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || `API request failed (${res.status})`)
      }

      return data
    } catch (error) {
      console.error("API Error:", error)
      throw error
    }
  }

  /* -------------------  Auth  ----------------------- */
  async login(email: string, password: string): Promise<ApiResponse> {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  }

  async register(data: Record<string, unknown>): Promise<ApiResponse> {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async logout(): Promise<ApiResponse> {
    return this.request("/auth/logout", { method: "POST" })
  }

  async getUser(): Promise<ApiResponse> {
    return this.request("/auth/user")
  }

  /* ------------------- Courses ---------------------- */
  async getCourses(params?: Record<string, string | number>): Promise<ApiResponse> {
    const qs = params ? `?${new URLSearchParams(params as any)}` : ""
    return this.request(`/courses${qs}`)
  }

  async getCourse(id: string): Promise<ApiResponse> {
    return this.request(`/courses/${id}`)
  }

  async createCourse(data: FormData | Record<string, unknown>): Promise<ApiResponse> {
    const options: RequestInit = { method: "POST" }

    if (data instanceof FormData) {
      options.body = data
      // Don't set Content-Type for FormData, let browser set it
      options.headers = this.token ? { Authorization: `Bearer ${this.token}` } : {}
    } else {
      options.body = JSON.stringify(data)
      options.headers = {
        "Content-Type": "application/json",
        ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      }
    }

    return this.request("/courses", options)
  }

  async updateCourse(id: string, data: FormData | Record<string, unknown>): Promise<ApiResponse> {
    const options: RequestInit = { method: "PUT" }

    if (data instanceof FormData) {
      options.body = data
      options.headers = this.token ? { Authorization: `Bearer ${this.token}` } : {}
    } else {
      options.body = JSON.stringify(data)
      options.headers = {
        "Content-Type": "application/json",
        ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      }
    }

    return this.request(`/courses/${id}`, options)
  }

  async deleteCourse(id: string): Promise<ApiResponse> {
    return this.request(`/courses/${id}`, { method: "DELETE" })
  }

  async enrollCourse(id: string): Promise<ApiResponse> {
    return this.request(`/courses/${id}/enroll`, { method: "POST" })
  }

  /* ------------------- Lessons ---------------------- */
  async getLesson(id: string): Promise<ApiResponse> {
    return this.request(`/lessons/${id}`)
  }

  async createLesson(data: Record<string, unknown>): Promise<ApiResponse> {
    return this.request("/lessons", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateLesson(id: string, data: Record<string, unknown>): Promise<ApiResponse> {
    return this.request(`/lessons/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteLesson(id: string): Promise<ApiResponse> {
    return this.request(`/lessons/${id}`, { method: "DELETE" })
  }

  async markLessonComplete(id: string, timeSpent: number): Promise<ApiResponse> {
    return this.request(`/lessons/${id}/complete`, {
      method: "POST",
      body: JSON.stringify({ time_spent: timeSpent }),
    })
  }

  /* ------------------- Quizzes ---------------------- */
  async getQuiz(id: string): Promise<ApiResponse> {
    return this.request(`/quizzes/${id}`)
  }

  async createQuiz(data: Record<string, unknown>): Promise<ApiResponse> {
    return this.request("/quizzes", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateQuiz(id: string, data: Record<string, unknown>): Promise<ApiResponse> {
    return this.request(`/quizzes/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteQuiz(id: string): Promise<ApiResponse> {
    return this.request(`/quizzes/${id}`, { method: "DELETE" })
  }

  async submitQuiz(id: string, answers: unknown, startedAt: string, timeTaken: number): Promise<ApiResponse> {
    return this.request(`/quizzes/${id}/submit`, {
      method: "POST",
      body: JSON.stringify({ answers, started_at: startedAt, time_taken: timeTaken }),
    })
  }

  /* ------------------- Users (Admin) ---------------- */
  async getUsers(): Promise<ApiResponse> {
    return this.request("/users")
  }

  async approveUser(id: string): Promise<ApiResponse> {
    return this.request(`/users/${id}/approve`, { method: "POST" })
  }

  async rejectUser(id: string): Promise<ApiResponse> {
    return this.request(`/users/${id}/reject`, { method: "POST" })
  }

  async updateUser(id: string, data: Record<string, unknown>): Promise<ApiResponse> {
    return this.request(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  /* ------------------- Support Tickets -------------- */
  async getSupportTickets(): Promise<ApiResponse> {
    return this.request("/support-tickets")
  }

  async getSupportTicket(id: string): Promise<ApiResponse> {
    return this.request(`/support-tickets/${id}`)
  }

  async createSupportTicket(data: Record<string, unknown>): Promise<ApiResponse> {
    return this.request("/support-tickets", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateSupportTicket(id: string, data: Record<string, unknown>): Promise<ApiResponse> {
    return this.request(`/support-tickets/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async addSupportResponse(ticketId: string, message: string): Promise<ApiResponse> {
    return this.request(`/support-tickets/${ticketId}/responses`, {
      method: "POST",
      body: JSON.stringify({ message }),
    })
  }

  /* ------------------- Certificates ---------------- */
  async getCertificates(): Promise<ApiResponse> {
    return this.request("/certificates")
  }

  async downloadCertificate(id: string): Promise<ApiResponse> {
    return this.request(`/certificates/${id}/download`)
  }

  /* ------------------- Notices ---------------------- */
  async getNotices(): Promise<ApiResponse> {
    return this.request("/notices")
  }

  async createNotice(data: Record<string, unknown>): Promise<ApiResponse> {
    return this.request("/notices", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateNotice(id: string, data: Record<string, unknown>): Promise<ApiResponse> {
    return this.request(`/notices/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteNotice(id: string): Promise<ApiResponse> {
    return this.request(`/notices/${id}`, { method: "DELETE" })
  }

  /* ------------------- Library Resources ------------ */
  async getLibraryResources(): Promise<ApiResponse> {
    return this.request("/library-resources")
  }

  async createLibraryResource(data: FormData): Promise<ApiResponse> {
    return this.request("/library-resources", {
      method: "POST",
      body: data,
      headers: this.token ? { Authorization: `Bearer ${this.token}` } : {},
    })
  }

  async updateLibraryResource(id: string, data: Record<string, unknown>): Promise<ApiResponse> {
    return this.request(`/library-resources/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteLibraryResource(id: string): Promise<ApiResponse> {
    return this.request(`/library-resources/${id}`, { method: "DELETE" })
  }

  async downloadResource(id: string): Promise<ApiResponse> {
    return this.request(`/library-resources/${id}/download`)
  }
}

export const apiClient = new ApiClient()
