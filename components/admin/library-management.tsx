"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Download, FileText, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface LibraryItem {
  id: string
  title: string
  description: string
  fileName: string
  fileSize: string
  category: string
  targetRole: "all" | "agent" | "field_officer"
  uploadDate: string
  downloads: number
}

export function LibraryManagement() {
  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>([
    {
      id: "1",
      title: "Digital Booth Setup Guide",
      description: "Comprehensive guide for setting up digital booths in rural areas",
      fileName: "digital-booth-guide.pdf",
      fileSize: "2.5 MB",
      category: "Training Materials",
      targetRole: "all",
      uploadDate: "2024-01-15",
      downloads: 45,
    },
    {
      id: "2",
      title: "Agent Handbook 2024",
      description: "Complete handbook for field agents with updated procedures",
      fileName: "agent-handbook-2024.pdf",
      fileSize: "3.2 MB",
      category: "Handbooks",
      targetRole: "agent",
      uploadDate: "2024-01-10",
      downloads: 32,
    },
    {
      id: "3",
      title: "Field Operations Manual",
      description: "Detailed manual for field operations management",
      fileName: "field-ops-manual.pdf",
      fileSize: "4.1 MB",
      category: "Manuals",
      targetRole: "field_officer",
      uploadDate: "2024-01-12",
      downloads: 28,
    },
  ])

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    targetRole: "all" as "all" | "agent" | "field_officer",
    file: null as File | null,
  })

  const { toast } = useToast()

  const categories = ["Training Materials", "Handbooks", "Manuals", "Policies", "Forms", "Templates"]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.file) {
      toast({
        title: "Error",
        description: "Please select a file to upload.",
        variant: "destructive",
      })
      return
    }

    const newItem: LibraryItem = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      fileName: formData.file.name,
      fileSize: `${(formData.file.size / (1024 * 1024)).toFixed(1)} MB`,
      category: formData.category,
      targetRole: formData.targetRole,
      uploadDate: new Date().toISOString().split("T")[0],
      downloads: 0,
    }

    setLibraryItems((prev) => [...prev, newItem])
    toast({ title: "File uploaded successfully!" })

    setFormData({
      title: "",
      description: "",
      category: "",
      targetRole: "all",
      file: null,
    })
    setIsAddDialogOpen(false)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, file }))
    }
  }

  const handleDelete = (itemId: string) => {
    setLibraryItems((prev) => prev.filter((item) => item.id !== itemId))
    toast({ title: "File deleted successfully!" })
  }

  const getTargetBadge = (target: string) => {
    switch (target) {
      case "all":
        return <Badge variant="outline">All Users</Badge>
      case "agent":
        return <Badge variant="outline">Agents</Badge>
      case "field_officer":
        return <Badge variant="outline">Field Officers</Badge>
      default:
        return <Badge variant="outline">{target}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">e-Library Management</h2>
          <p className="text-gray-600">Manage downloadable resources and documents</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Upload File
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload New File</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">File Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetRole">Target Audience</Label>
                  <Select
                    value={formData.targetRole}
                    onValueChange={(value: "all" | "agent" | "field_officer") =>
                      setFormData((prev) => ({ ...prev, targetRole: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="agent">Agents Only</SelectItem>
                      <SelectItem value="field_officer">Field Officers Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">File (PDF, DOC, DOCX)</Label>
                <Input id="file" type="file" accept=".pdf,.doc,.docx" onChange={handleFileUpload} required />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Upload File</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {libraryItems.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <p className="text-sm text-gray-500">{item.fileName}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-4">{item.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Size:</span>
                  <span>{item.fileSize}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Downloads:</span>
                  <span>{item.downloads}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Uploaded:</span>
                  <span>{new Date(item.uploadDate).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-4">
                <Badge variant="secondary">{item.category}</Badge>
                {getTargetBadge(item.targetRole)}
              </div>

              <Button variant="outline" className="w-full gap-2 bg-transparent">
                <Download className="w-4 h-4" />
                Download
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
