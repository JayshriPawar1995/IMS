"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Download, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Course {
  id: number
  title: string
}

interface Certificate {
  id: string
  name: string
  courseId: number
  courseTitle: string
  template: string
  issuedCount: number
  createdDate: string
}

export function CertificateManagement() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    courseId: 0,
    template: null as File | null,
  })

  const { toast } = useToast()

  // ✅ Fetch courses from backend
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("/api/courses")
        const data = await res.json()
        if (res.ok && Array.isArray(data)) {
          // normalize name => title
          const mappedCourses: Course[] = data.map((c: any) => ({ id: c.id, title: c.name }))
          setCourses(mappedCourses)
        } else {
          console.error("Failed to fetch courses:", data)
        }
      } catch (err) {
        console.error(err)
      }
    }

    const fetchCertificates = async () => {
      try {
        const res = await fetch("/api/certificates")
        const data = await res.json()
        if (res.ok && Array.isArray(data)) {
          // normalize API keys
          const mappedCertificates: Certificate[] = data.map((c: any) => ({
    id: c.id.toString(),
    name: c.name,
    courseId: c.course_id,
    courseTitle: c.courseName || "No course name",
    template: c.template || "No template",
    issuedCount: c.issued_count ?? 0,
    createdDate: c.created_date ? new Date(c.created_date).toISOString() : new Date().toISOString(),
}))

          setCertificates(mappedCertificates)
        } else {
          console.error("Failed to fetch certificates:", data)
        }
      } catch (err) {
        console.error(err)
      }
    }

    fetchCourses()
    fetchCertificates()
  }, [])

  // ✅ Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setFormData((prev) => ({ ...prev, template: file }))
  }

  // ✅ Handle certificate creation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.courseId || !formData.name || !formData.template) return

    const form = new FormData()
    form.append("name", formData.name)
    form.append("courseId", formData.courseId.toString())
    form.append("template", formData.template!)

    try {
      const res = await fetch("/api/certificates", {
        method: "POST",
        body: form,
      })
      const data = await res.json()
      if (res.ok) {
        // normalize the response
        const newCert: Certificate = {
          id: data.id.toString(),
          name: data.name,
          courseId: data.course_id,
          courseTitle: data.courseName || "",
          template: data.template,
          issuedCount: data.issued_count,
          createdDate: data.created_date,
        }
        setCertificates((prev) => [...prev, newCert])
        toast({ title: "Certificate created successfully!" })
        setFormData({ name: "", courseId: 0, template: null })
        setIsAddDialogOpen(false)
      } else {
        toast({ title: "Error creating certificate", description: data.error })
      }
    } catch (err) {
      console.error(err)
      toast({ title: "Error creating certificate" })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Certificate Management</h2>
          <p className="text-gray-600">Manage course completion certificates</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Certificate
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Certificate</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Certificate Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Digital Marketing Expert Certificate"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="course">Associated Course</Label>
                <select
                  id="course"
                  value={formData.courseId}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, courseId: Number(e.target.value) }))
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value={0}>Select a course</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="template">Certificate Template (PDF)</Label>
                <Input
                  id="template"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  required
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Certificate</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Certificate List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(certificates) &&
          certificates.map((cert) => (
            <Card key={cert.id}>
              <CardHeader>
                <CardTitle>{cert.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Associated Course:</p>
                    <p className="font-medium">{cert.courseTitle}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Template:</p>
                    <p className="font-medium">{cert.template.split("/").pop()}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">Issued:</p>
                      <Badge variant="secondary">{cert.issuedCount} times</Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Created:</p>
                     <p className="text-sm">{new Date(cert.createdDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2"> 
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => window.open(cert.template, "_blank")}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => {
                        const link = document.createElement("a")
                        link.href = cert.template
                        link.download = cert.template.split("/").pop() || "certificate.pdf"
                        link.click()
                      }}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  )
}
