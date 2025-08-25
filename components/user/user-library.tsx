"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, Search, Filter } from "lucide-react"

interface LibraryItem {
  id: string
  title: string
  description: string
  fileName: string
  fileSize: string
  category: string
  downloadCount: number
  uploadDate: string
}

export function UserLibrary() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const [libraryItems] = useState<LibraryItem[]>([
    {
      id: "1",
      title: "Digital Booth Setup Guide",
      description: "Comprehensive guide for setting up digital booths in rural areas",
      fileName: "digital-booth-guide.pdf",
      fileSize: "2.5 MB",
      category: "Training Materials",
      downloadCount: 45,
      uploadDate: "2024-01-15",
    },
    {
      id: "2",
      title: "Agent Handbook 2024",
      description: "Complete handbook for field agents with updated procedures",
      fileName: "agent-handbook-2024.pdf",
      fileSize: "3.2 MB",
      category: "Handbooks",
      downloadCount: 32,
      uploadDate: "2024-01-10",
    },
    {
      id: "3",
      title: "Customer Service Templates",
      description: "Ready-to-use templates for customer service interactions",
      fileName: "service-templates.docx",
      fileSize: "1.8 MB",
      category: "Templates",
      downloadCount: 28,
      uploadDate: "2024-01-12",
    },
    {
      id: "4",
      title: "Digital Marketing Checklist",
      description: "Step-by-step checklist for digital marketing campaigns",
      fileName: "marketing-checklist.pdf",
      fileSize: "1.2 MB",
      category: "Checklists",
      downloadCount: 41,
      uploadDate: "2024-01-08",
    },
    {
      id: "5",
      title: "Field Operations Manual",
      description: "Detailed manual for field operations management",
      fileName: "field-ops-manual.pdf",
      fileSize: "4.1 MB",
      category: "Manuals",
      downloadCount: 23,
      uploadDate: "2024-01-05",
    },
  ])

  const categories = ["all", "Training Materials", "Handbooks", "Templates", "Checklists", "Manuals"]

  const filteredItems = libraryItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800">e-Library</h2>
        <p className="text-gray-600">Access downloadable resources and documents</p>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Library Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <p className="text-sm text-gray-500">{item.fileName}</p>
                </div>
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
                  <span>{item.downloadCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Uploaded:</span>
                  <span>{new Date(item.uploadDate).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-4">
                <Badge variant="secondary">{item.category}</Badge>
              </div>

              <Button className="w-full gap-2">
                <Download className="w-4 h-4" />
                Download
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Resources Found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
