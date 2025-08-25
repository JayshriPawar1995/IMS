"use client"

import { Clock, BookOpen, FileText, Users, ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/auth-context"

export function DashboardOverview() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              Welcome Back 👋<br />
              {user?.name}
            </h1>
            <div className="flex justify-center">
              <img
                src="/placeholder.svg?height=300&width=400"
                alt="Learning illustration"
                className="max-w-full h-auto"
              />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Enrolled Courses</p>
                  <p className="text-3xl font-bold text-blue-600">03</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm text-gray-500">Course Progress</p>
                  <p className="text-3xl font-bold text-green-600">74%</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <Progress value={74} className="h-2" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Certifications</p>
                  <p className="text-3xl font-bold text-purple-600">05</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Continue Courses & Notice Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Continue Courses */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800">Continue your courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Basics of Building Village Digital Booth</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-500" />
                    <span className="text-sm text-gray-600">50 Minute</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-gray-600">21 Lessons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-gray-600">5 Assignments</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">34 Students</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notice Board */}
        <div>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">Notice board</CardTitle>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="w-6 h-6">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="w-6 h-6">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Server Update</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    We will be working on a minor Update in Zaytoon LMS site. So it will be inaccessible till 26th July 2024 
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" />
                    <AvatarFallback>HR</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">Tech Team </p>
                    <p className="text-xs text-gray-500">Jan 21th, 2025 • 10:30 AM</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
