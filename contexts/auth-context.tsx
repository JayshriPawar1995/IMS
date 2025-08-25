// "use client"

// import type React from "react"
// import { createContext, useContext, useState, useEffect } from "react"

// interface User {
//   id: string
//   name: string
//   email: string
//   phone: string
//   role: "admin" | "agent" | "field_officer"
//   status: "pending" | "approved" | "rejected"
//   avatar?: string
// }

// interface AuthContextType {
//   user: User | null
//   isAuthenticated: boolean
//   login: (email: string, password: string) => Promise<boolean>
//   register: (userData: Omit<User, "id" | "status"> & { password: string }) => Promise<boolean>
//   logout: () => void
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined)

// // Mock users data
// const mockUsers: (User & { password: string })[] = [
//   {
//     id: "1",
//     name: "Admin User",
//     email: "admin@zaytoon.com",
//     phone: "+8801234567890",
//     role: "admin",
//     status: "approved",
//     password: "admin123",
//     avatar: "/placeholder.svg?height=40&width=40",
//   },
//   {
//     id: "2",
//     name: "Zuniyed Hossain",
//     email: "zuniyed@zaytoon.com",
//     phone: "+8801234567891",
//     role: "agent",
//     status: "approved",
//     password: "agent123",
//     avatar: "/placeholder.svg?height=40&width=40",
//   },
//   {
//     id: "3",
//     name: "Field Officer",
//     email: "field@zaytoon.com",
//     phone: "+8801234567892",
//     role: "field_officer",
//     status: "approved",
//     password: "field123",
//     avatar: "/placeholder.svg?height=40&width=40",
//   },
// ]

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User | null>(null)
//   const [isAuthenticated, setIsAuthenticated] = useState(false)

//   useEffect(() => {
//     const savedUser = localStorage.getItem("zaytoon_user")
//     if (savedUser) {
//       const userData = JSON.parse(savedUser)
//       setUser(userData)
//       setIsAuthenticated(true)
//     }
//   }, [])

//   const login = async (email: string, password: string): Promise<boolean> => {
//     const foundUser = mockUsers.find((u) => u.email === email && u.password === password && u.status === "approved")

//     if (foundUser) {
//       const { password: _, ...userWithoutPassword } = foundUser
//       setUser(userWithoutPassword)
//       setIsAuthenticated(true)
//       localStorage.setItem("zaytoon_user", JSON.stringify(userWithoutPassword))
//       return true
//     }
//     return false
//   }

//   const register = async (userData: Omit<User, "id" | "status"> & { password: string }): Promise<boolean> => {
//     // In a real app, this would make an API call
//     const newUser = {
//       ...userData,
//       id: Date.now().toString(),
//       status: "pending" as const,
//     }

//     mockUsers.push(newUser)
//     return true
//   }

//   const logout = () => {
//     setUser(null)
//     setIsAuthenticated(false)
//     localStorage.removeItem("zaytoon_user")
//   }

//   return (
//     <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>{children}</AuthContext.Provider>
//   )
// }

// export function useAuth() {
//   const context = useContext(AuthContext)
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider")
//   }
//   return context
// }
"use client"

import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  name: string
  email: string
  role: string
  phone: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (data: {
    name: string
    email: string
    phone: string
    role: string
    password: string
  }) => Promise<{ success: boolean; message: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Load from localStorage on refresh
  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
      setIsAuthenticated(true)
    }
  }, [])

  // ✅ Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        console.error("Login failed:", res.status)
        return false
      }

      const data = await res.json()

      if (data.token) {
        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))
        setUser(data.user)
        setIsAuthenticated(true)
        return true
      }

      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  // ✅ Register function
  const register = async (formData: {
    name: string
    email: string
    phone: string
    role: string
    password: string
  }) => {
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()
      return { success: res.ok, message: data.message || "Something went wrong" }
    } catch (error) {
      console.error("Register error:", error)
      return { success: false, message: "Network error" }
    }
  }

  // ✅ Logout function
  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
