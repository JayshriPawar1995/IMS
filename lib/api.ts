// Mock API functions for backend simulation
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// User Management API
export const userApi = {
  async getUsers(): Promise<ApiResponse<any[]>> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))
    return {
      success: true,
      data: [], // Would return actual user data
      message: "Users fetched successfully",
    }
  },

  async approveUser(userId: string): Promise<ApiResponse<any>> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return {
      success: true,
      message: "User approved successfully",
    }
  },

  async rejectUser(userId: string): Promise<ApiResponse<any>> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return {
      success: true,
      message: "User rejected successfully",
    }
  },
}

// Course Management API
export const courseApi = {
  async getCourses(): Promise<ApiResponse<any[]>> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return {
      success: true,
      data: [],
      message: "Courses fetched successfully",
    }
  },

  async createCourse(courseData: any): Promise<ApiResponse<any>> {
    await new Promise((resolve) => setTimeout(resolve, 800))
    return {
      success: true,
      data: { id: Date.now().toString(), ...courseData },
      message: "Course created successfully",
    }
  },

  async updateCourse(courseId: string, courseData: any): Promise<ApiResponse<any>> {
    await new Promise((resolve) => setTimeout(resolve, 600))
    return {
      success: true,
      message: "Course updated successfully",
    }
  },

  async deleteCourse(courseId: string): Promise<ApiResponse<any>> {
    await new Promise((resolve) => setTimeout(resolve, 400))
    return {
      success: true,
      message: "Course deleted successfully",
    }
  },
}

// Quiz API
export const quizApi = {
  async getQuizzes(): Promise<ApiResponse<any[]>> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return {
      success: true,
      data: [],
      message: "Quizzes fetched successfully",
    }
  },

  async submitQuiz(quizId: string, answers: any): Promise<ApiResponse<any>> {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const score = Math.floor(Math.random() * 40) + 60 // Random score 60-100
    return {
      success: true,
      data: { score, passed: score >= 70 },
      message: "Quiz submitted successfully",
    }
  },
}

// Certificate API
export const certificateApi = {
  async getCertificates(): Promise<ApiResponse<any[]>> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return {
      success: true,
      data: [],
      message: "Certificates fetched successfully",
    }
  },

  async generateCertificate(courseId: string): Promise<ApiResponse<any>> {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    return {
      success: true,
      data: { certificateUrl: "/certificates/sample.pdf" },
      message: "Certificate generated successfully",
    }
  },
}

// Notification API
export const notificationApi = {
  async getNotifications(): Promise<ApiResponse<any[]>> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return {
      success: true,
      data: [],
      message: "Notifications fetched successfully",
    }
  },

  async markAsRead(notificationId: string): Promise<ApiResponse<any>> {
    await new Promise((resolve) => setTimeout(resolve, 200))
    return {
      success: true,
      message: "Notification marked as read",
    }
  },
}

// Support API
export const supportApi = {
  async createTicket(ticketData: any): Promise<ApiResponse<any>> {
    await new Promise((resolve) => setTimeout(resolve, 800))
    return {
      success: true,
      data: { id: Date.now().toString(), ...ticketData },
      message: "Support ticket created successfully",
    }
  },

  async getTickets(): Promise<ApiResponse<any[]>> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return {
      success: true,
      data: [],
      message: "Tickets fetched successfully",
    }
  },
}

// Library API
export const libraryApi = {
  async getLibraryItems(): Promise<ApiResponse<any[]>> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return {
      success: true,
      data: [],
      message: "Library items fetched successfully",
    }
  },

  async downloadFile(fileId: string): Promise<ApiResponse<any>> {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return {
      success: true,
      data: { downloadUrl: "/files/sample.pdf" },
      message: "File download initiated",
    }
  },
}
