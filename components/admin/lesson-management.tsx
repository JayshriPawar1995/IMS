"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Video, Clock, Eye, ArrowUp, ArrowDown } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Lesson {
  id: string
  courseId: string
  title: string
  description: string
  content: string
  videoUrl?: string
  videoThumbnail?: string
  duration: number
  status: "active" | "draft"
  order: number
}

interface LessonManagementProps {
  courseId: string
}

export function LessonManagement({ courseId }: LessonManagementProps) {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)
  const [previewLesson, setPreviewLesson] = useState<Lesson | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    videoUrl: "",
    duration: "",
    status: "draft" as "active" | "draft",
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchLessons()
  }, [courseId])

  const fetchLessons = async () => {
    try {
      const res = await fetch(`/api/lessons?courseId=${courseId}`)
      if (!res.ok) throw new Error("Failed to fetch lessons")
      const data = await res.json()
      setLessons(data)
    } catch (err: any) {
      console.error(err)
      toast({ title: "Error fetching lessons", description: err.message, variant: "destructive" })
    }
  }

  const extractYouTubeId = (url: string): string | null => {
    const regex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
    const match = url.match(regex)
    return match ? match[1] : null
  }

  const getYouTubeThumbnail = (url: string): string => {
    const videoId = extractYouTubeId(url)
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : ""
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const lessonData = {
      ...formData,
      courseId,
      duration: Number.parseInt(formData.duration) || 0,
      
      videoThumbnail: formData.videoUrl ? getYouTubeThumbnail(formData.videoUrl) : undefined,
    }

    try {
      if (editingLesson) {
        const res = await fetch(`/api/lessons/${editingLesson.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(lessonData),
        })
        if (!res.ok) throw new Error("Failed to update lesson")
        toast({ title: "Lesson updated successfully!" })
      } else {
        const res = await fetch("/api/lessons", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(lessonData),
        })
        if (!res.ok) throw new Error("Failed to create lesson")
        toast({ title: "Lesson created successfully!" })
      }

      setFormData({ title: "", description: "", content: "", videoUrl: "", duration: "", status: "draft" })
      setEditingLesson(null)
      setIsAddDialogOpen(false)
      fetchLessons()
    } catch (err: any) {
      console.error(err)
      toast({ title: "Something went wrong", description: err.message, variant: "destructive" })
    }
  }

  const handleEdit = (lesson: Lesson) => {
    setEditingLesson(lesson)
    setFormData({
      title: lesson.title,
      description: lesson.description,
      content: lesson.content,
      videoUrl: lesson.videoUrl || "",
      duration: lesson.duration.toString(),
      status: lesson.status,
    })
    setIsAddDialogOpen(true)
  }

  const handleDelete = async (lessonId: string) => {
    if (!confirm("Are you sure you want to delete this lesson?")) return
    try {
      const res = await fetch(`/api/lessons/${lessonId}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete lesson")
      toast({ title: "Lesson deleted successfully!" })
      fetchLessons()
    } catch (err: any) {
      console.error(err)
      toast({ title: "Error deleting lesson", description: err.message, variant: "destructive" })
    }
  }

  const moveLesson = (lessonId: string, direction: "up" | "down") => {
  const currentIndex = lessons.findIndex((l) => l.id === lessonId)
  if (currentIndex === -1) return

  const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1
  if (newIndex < 0 || newIndex >= lessons.length) return

  const updatedLessons = [...lessons]
  const [movedLesson] = updatedLessons.splice(currentIndex, 1)
  updatedLessons.splice(newIndex, 0, movedLesson)

  setLessons(updatedLessons)
  toast({ title: "Lesson order updated!" })
}
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold">Course Lessons</h3>
          <p className="text-gray-600">Manage lessons for this course</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Lesson
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingLesson ? "Edit Lesson" : "Add New Lesson"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Lesson Form */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Lesson Title</Label>
                  <Input id="title" value={formData.title} onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input id="duration" type="number" value={formData.duration} onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="videoUrl">YouTube Video URL</Label>
                <Input id="videoUrl" type="url" value={formData.videoUrl} onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))} />
                {formData.videoUrl && <img src={getYouTubeThumbnail(formData.videoUrl)} className="w-32 h-18 object-cover rounded border mt-2" />}
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Lesson Content (HTML)</Label>
                <Textarea id="content" value={formData.content} onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))} className="min-h-[200px] font-mono text-sm" placeholder="<h2>Lesson Title</h2><p>Your content here...</p>" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value: "active" | "draft") => setFormData(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => { setIsAddDialogOpen(false); setEditingLesson(null); setFormData({ title:"", description:"", content:"", videoUrl:"", duration:"", status:"draft" }) }}>Cancel</Button>
                <Button type="submit">{editingLesson ? "Update Lesson" : "Create Lesson"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lessons List */}
      <div className="space-y-4">
        {lessons.length === 0 ? (
          <Card><CardContent className="text-center py-8"><p className="text-gray-500">No lessons yet. Add your first lesson!</p></CardContent></Card>
        ) : (
          lessons.map((lesson, index) => (
            <Card key={lesson.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">{lesson.order}</div>
                    <div>
                      <CardTitle className="text-lg">{lesson.title}</CardTitle>
                      <p className="text-sm text-gray-600">{lesson.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => moveLesson(lesson.id, "up")} disabled={index===0} title="Move Up"><ArrowUp className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => moveLesson(lesson.id, "down")} disabled={index===lessons.length-1} title="Move Down"><ArrowDown className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => setPreviewLesson(lesson)} title="Preview"><Eye className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(lesson)} title="Edit"><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(lesson.id)} title="Delete"><Trash2 className="w-4 h-4 text-red-500" /></Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-3">
                  {lesson.videoUrl && <div className="flex items-center gap-2 text-sm"><Video className="w-4 h-4 text-red-500" /><span>YouTube Video</span></div>}
                  <div className="flex items-center gap-2 text-sm"><Clock className="w-4 h-4 text-orange-500" /><span>{lesson.duration} min</span></div>
                  <Badge variant={lesson.status === "active" ? "default" : "secondary"}>{lesson.status}</Badge>
                </div>
                {lesson.videoThumbnail && <img src={lesson.videoThumbnail} alt={lesson.title} className="w-full h-32 object-cover rounded border mb-3" />}
                <div className="text-sm text-gray-600 line-clamp-2" dangerouslySetInnerHTML={{ __html: lesson.content.substring(0, 200) + "..." }} />
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Preview Dialog */}
      {previewLesson && (
        <Dialog open={!!previewLesson} onOpenChange={() => setPreviewLesson(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Preview: {previewLesson.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {previewLesson.videoUrl && <div className="aspect-video"><iframe src={`https://www.youtube.com/embed/${extractYouTubeId(previewLesson.videoUrl)}`} className="w-full h-full rounded" allowFullScreen /></div>}
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: previewLesson.content }} />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
