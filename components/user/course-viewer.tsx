// "use client";

// import { useEffect, useMemo, useRef, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Progress } from "@/components/ui/progress";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Play, CheckCircle, Clock, Video, ArrowLeft, ArrowRight, Trophy } from "lucide-react";
// import { useAuth } from "@/contexts/auth-context";
// import { QuizViewer } from "./quiz-viewer"; // keep if you already have it

// // ===== Types that match your API payloads =====
// export interface Course {
//   id: number | string;
//   title?: string;        // your UI uses title/description
//   description?: string;
//   name?: string;         // fallback if API returns 'name'
//   instructor?: string | null;
//   duration?: string | number | null;
//   level?: string | null;
//   category?: string | null;
//   totalLessons?: number | null;
//   totalQuizzes?: number | null;
//   enrolledStudents?: number | null;
//   status?: string | null;
// }

// export interface Lesson {
//   id: number | string;
//   courseId: number | string;
//   title: string;
//   description?: string | null;
//   content?: string | null;
//   videoUrl?: string | null;
//   videoThumbnail?: string | null;
//   duration?: number | null; // minutes
//   order?: number | null;    // optional ordering
//   status?: string | null;
// }

// export interface QuizQuestion {
//   id: string | number;
//   question: string;
//   options: string[];
//   correctIndex: number;
// }

// export interface Quiz {
//   id: string | number;
//   courseId: string | number;
//   title: string;
//   description?: string;
//   timeLimit?: number; // minutes
//   passingScore?: number; // percent
//   isFinalQuiz?: boolean;
//   questions: QuizQuestion[];
// }

// export interface Enrollment {
//   id: string | number;
//   userId: string | number;
//   courseId: string | number;
//   status: "in-progress" | "completed" | string;
//   progress: number; // 0..100
//   // optional extras from API:
//   completedLessons?: Array<string | number>;
// }

// // ===== Props =====
// interface CourseViewerProps {
//   courseId: string;
//   onBack: () => void;
// }

// export function CourseViewer({ courseId, onBack }: CourseViewerProps) {
//   const { user } = useAuth();

//   const [course, setCourse] = useState<Course | null>(null);
//   const [lessons, setLessons] = useState<Lesson[]>([]);
//   const [quizzes, setQuizzes] = useState<Quiz[]>([]);
//   const [enrollment, setEnrollment] = useState<Enrollment | null>(null);

//   const [viewMode, setViewMode] = useState<"overview" | "lesson" | "quiz">("overview");
//   const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
//   const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);

//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState<string | null>(null);
//   const lessonStartRef = useRef<number | null>(null);

//   const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
//   const authHeader = useMemo(
//     () => (token ? { Authorization: `Bearer ${token}` } : {}),
//     [token]
//   );

//   // ---------- Helpers ----------
//   const titleSafe = useMemo(() => course?.title || course?.name || "Course", [course]);

//   const extractYouTubeId = (url?: string | null): string | null => {
//     if (!url) return null;
//     const regex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
//     const match = url.match(regex);
//     return match ? match[1] : null;
//   };

//   const isLessonCompleted = (lessonId: string | number): boolean => {
//     if (!enrollment?.completedLessons) return false;
//     return enrollment.completedLessons.includes(lessonId);
//   };

//   const sortedLessons = useMemo(() => {
//     // If your API provides `order` use it, otherwise keep as-is.
//     return [...lessons].sort((a, b) => {
//       const ao = a.order ?? 999999;
//       const bo = b.order ?? 999999;
//       if (ao !== bo) return ao - bo;
//       // fallback: by id (number-ish)
//       const an = Number(a.id);
//       const bn = Number(b.id);
//       if (!Number.isNaN(an) && !Number.isNaN(bn)) return an - bn;
//       return 0;
//     });
//   }, [lessons]);

//   const getNextLesson = (): Lesson | null => {
//     if (!currentLesson) return null;
//     const idx = sortedLessons.findIndex((l) => String(l.id) === String(currentLesson.id));
//     return idx >= 0 && idx < sortedLessons.length - 1 ? sortedLessons[idx + 1] : null;
//     };
//   const getPreviousLesson = (): Lesson | null => {
//     if (!currentLesson) return null;
//     const idx = sortedLessons.findIndex((l) => String(l.id) === String(currentLesson.id));
//     return idx > 0 ? sortedLessons[idx - 1] : null;
//   };

//   // ---------- Load everything ----------
//   useEffect(() => {
//     let active = true;
//     (async () => {
//       setLoading(true);
//       setErr(null);
//       try {
//         // Course
//         const cRes = await fetch(`/api/courses/${courseId}`, { headers: { ...authHeader } });
//         if (!cRes.ok) throw new Error(`Course load failed (${cRes.status})`);
//         const cData: Course = await cRes.json();
//         if (!active) return;
//         setCourse(cData);

//         // Lessons
//         const lRes = await fetch(`/api/lessons/${courseId}`, { headers: { ...authHeader } });
//         if (!lRes.ok) throw new Error(`Lessons load failed (${lRes.status})`);
//         const lData: Lesson[] = await lRes.json();
//         if (!active) return;
//         setLessons(Array.isArray(lData) ? lData : []);

//         // Quizzes (optional)
//         try {
//           const qRes = await fetch(`/api/quizzes?courseId=${courseId}`, { headers: { ...authHeader } });
//           const ok = qRes.ok;
//           const qData = ok ? await qRes.json() : [];
//           if (active) setQuizzes(Array.isArray(qData) ? qData : []);
//         } catch {
//           if (active) setQuizzes([]);
//         }

//         // Enrollment for this user/course
//         if (user?.id) {
//           const eRes = await fetch(`/api/enrollments?userId=${user.id}&courseId=${courseId}`, {
//             headers: { ...authHeader },
//             credentials: "include",
//           });
//           if (eRes.ok) {
//             const eData = await eRes.json();
//             // API might return a single object or an array:
//             const enrollmentObj = Array.isArray(eData) ? eData[0] : eData;
//             if (active) setEnrollment(enrollmentObj || null);
//           } else {
//             if (active) setEnrollment(null);
//           }
//         } else {
//           setEnrollment(null);
//         }
//       } catch (e: any) {
//         if (active) setErr(e?.message || "Failed to load course");
//       } finally {
//         if (active) setLoading(false);
//       }
//     })();
//     return () => {
//       active = false;
//     };
//   }, [courseId, user?.id, authHeader]);

//   // ---------- Actions ----------
//   const enrollInCourse = async () => {
//     if (!user?.id) return;
//     try {
//       const res = await fetch(`/api/enrollments`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", ...authHeader },
//         body: JSON.stringify({ userId: user.id, courseId }),
//       });
//       if (!res.ok) throw new Error(`Enroll failed (${res.status})`);
//       const e = await res.json();
//       setEnrollment(e);
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   const startLesson = (lesson: Lesson) => {
//     setCurrentLesson(lesson);
//     lessonStartRef.current = Date.now();
//     setViewMode("lesson");
//   };

//   const completeLesson = async () => {
//     if (!currentLesson || !user?.id || !lessonStartRef.current) return;
//     const timeSpentMin = Math.max(1, Math.round((Date.now() - lessonStartRef.current) / 60000));
//     try {
//       await fetch(`/api/lesson-progress`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", ...authHeader },
//         body: JSON.stringify({ userId: user.id, lessonId: currentLesson.id, timeSpent: timeSpentMin }),
//       });
//       // Refresh enrollment/progress
//       const eRes = await fetch(`/api/enrollments?userId=${user.id}&courseId=${courseId}`, {
//         headers: { ...authHeader },
//         credentials: "include",
//       });
//       if (eRes.ok) {
//         const eData = await eRes.json();
//         const enrollmentObj = Array.isArray(eData) ? eData[0] : eData;
//         setEnrollment(enrollmentObj || null);
//       }
//     } catch (e) {
//       console.error(e);
//     } finally {
//       setViewMode("overview");
//       lessonStartRef.current = null;
//     }
//   };

//   const startQuiz = (quiz: Quiz) => {
//     setCurrentQuiz(quiz);
//     setViewMode("quiz");
//   };

//   const onQuizComplete = async () => {
//     // After quiz, refresh enrollment (in case progress changed)
//     if (user?.id) {
//       try {
//         const eRes = await fetch(`/api/enrollments?userId=${user.id}&courseId=${courseId}`, {
//           headers: { ...authHeader },
//           credentials: "include",
//         });
//         if (eRes.ok) {
//           const eData = await eRes.json();
//           const enrollmentObj = Array.isArray(eData) ? eData[0] : eData;
//           setEnrollment(enrollmentObj || null);
//         }
//       } catch {}
//     }
//     setViewMode("overview");
//   };

//   // ---------- UI States ----------
//   if (loading) {
//     return (
//       <div className="max-w-6xl mx-auto py-10 text-center text-gray-600">
//         Loading course…
//       </div>
//     );
//   }

//   if (err || !course) {
//     return (
//       <div className="max-w-6xl mx-auto py-10 text-center">
//         <p className="text-red-600 mb-4">{err || "Course not found"}</p>
//         <Button variant="outline" onClick={onBack}>Back to Courses</Button>
//       </div>
//     );
//   }

//   // QUIZ MODE
//   if (viewMode === "quiz" && currentQuiz) {
//     return (
//       <QuizViewer
//         quiz={currentQuiz}
//         onComplete={onQuizComplete}
//         onBack={() => setViewMode("overview")}
//       />
//     );
//   }

//   // LESSON MODE
//   if (viewMode === "lesson" && currentLesson) {
//     return (
//       <div className="max-w-4xl mx-auto space-y-6">
//         <div className="flex items-center gap-4">
//           <Button variant="outline" onClick={() => setViewMode("overview")}>
//             <ArrowLeft className="w-4 h-4 mr-2" />
//             Back to Course
//           </Button>
//           <div>
//             <h1 className="text-2xl font-bold">{currentLesson.title}</h1>
//             {currentLesson.description && <p className="text-gray-600">{currentLesson.description}</p>}
//           </div>
//           <Badge variant={isLessonCompleted(currentLesson.id) ? "default" : "secondary"}>
//             {isLessonCompleted(currentLesson.id) ? "Completed" : "In Progress"}
//           </Badge>
//         </div>

//         <Card>
//           <CardContent className="p-6">
//             {currentLesson.videoUrl && extractYouTubeId(currentLesson.videoUrl) && (
//               <div className="mb-6">
//                 <div className="aspect-video">
//                   <iframe
//                     src={`https://www.youtube.com/embed/${extractYouTubeId(currentLesson.videoUrl)}`}
//                     className="w-full h-full rounded-lg"
//                     allowFullScreen
//                     title={currentLesson.title}
//                   />
//                 </div>
//               </div>
//             )}

//             {currentLesson.content && (
//               <div className="prose max-w-none">
//                 <div dangerouslySetInnerHTML={{ __html: currentLesson.content }} />
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         <div className="flex items-center justify-between">
//           <Button
//             variant="outline"
//             onClick={() => {
//               const prev = getPreviousLesson();
//               if (prev) startLesson(prev);
//             }}
//             disabled={!getPreviousLesson()}
//           >
//             <ArrowLeft className="w-4 h-4 mr-2" />
//             Previous Lesson
//           </Button>

//           <div className="flex gap-2">
//             {!isLessonCompleted(currentLesson.id) && (
//               <Button onClick={completeLesson}>
//                 <CheckCircle className="w-4 h-4 mr-2" />
//                 Mark Complete
//               </Button>
//             )}

//             <Button
//               onClick={() => {
//                 const next = getNextLesson();
//                 if (next) startLesson(next);
//               }}
//               disabled={!getNextLesson()}
//             >
//               Next Lesson
//               <ArrowRight className="w-4 h-4 ml-2" />
//             </Button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // OVERVIEW MODE
//   const completedCount = enrollment?.completedLessons?.length ?? 0;

//   return (
//     <div className="max-w-6xl mx-auto space-y-6">
//       <div className="flex items-center gap-4">
//         <Button variant="outline" onClick={onBack}>
//           <ArrowLeft className="w-4 h-4 mr-2" />
//           Back to Courses
//         </Button>
//         <div className="flex-1">
//           <h1 className="text-3xl font-bold">{titleSafe}</h1>
//           {course.description && <p className="text-gray-600 mt-2">{course.description}</p>}
//         </div>
//       </div>

//       {enrollment ? (
//         <Card>
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-lg font-semibold">Your Progress</h3>
//               <Badge variant={enrollment.status === "completed" ? "default" : "secondary"}>
//                 {enrollment.status}
//               </Badge>
//             </div>
//             <div className="space-y-2">
//               <div className="flex justify-between text-sm">
//                 <span>Course Progress</span>
//                 <span>{Math.round(enrollment.progress || 0)}%</span>
//               </div>
//               <Progress value={enrollment.progress || 0} className="h-2" />
//               <p className="text-sm text-gray-600">
//                 {completedCount} of {lessons.length} lessons completed
//               </p>
//             </div>
//           </CardContent>
//         </Card>
//       ) : (
//         <Card>
//           <CardContent className="p-6 text-center">
//             <h3 className="text-lg font-semibold mb-2">Enroll in this Course</h3>
//             <p className="text-gray-600 mb-4">
//               Get access to all lessons, quizzes, and earn a certificate upon completion.
//             </p>
//             <Button onClick={enrollInCourse}>Enroll Now</Button>
//           </CardContent>
//         </Card>
//       )}

//       <Tabs defaultValue="lessons" className="w-full">
//         <TabsList className="grid w-full grid-cols-3">
//           <TabsTrigger value="lessons">Lessons</TabsTrigger>
//           <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
//           <TabsTrigger value="info">Course Info</TabsTrigger>
//         </TabsList>

//         {/* Lessons */}
//         <TabsContent value="lessons" className="space-y-4">
//           {sortedLessons.length === 0 ? (
//             <Card>
//               <CardContent className="text-center py-8">
//                 <p className="text-gray-500">No lessons available yet.</p>
//               </CardContent>
//             </Card>
//           ) : (
//             sortedLessons.map((lesson, index) => (
//               <Card key={lesson.id} className="hover:shadow-md transition-shadow">
//                 <CardHeader>
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-3">
//                       <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">
//                         {lesson.order ?? index + 1}
//                       </div>
//                       <div>
//                         <CardTitle className="text-lg">{lesson.title}</CardTitle>
//                         {lesson.description && <CardDescription>{lesson.description}</CardDescription>}
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       {isLessonCompleted(lesson.id) && (
//                         <Badge variant="outline">
//                           <CheckCircle className="w-3 h-3 mr-1" />
//                           Completed
//                         </Badge>
//                       )}
//                       <Button
//                         size="sm"
//                         onClick={() => startLesson(lesson)}
//                         disabled={!enrollment}
//                         variant={isLessonCompleted(lesson.id) ? "outline" : "default"}
//                       >
//                         {isLessonCompleted(lesson.id) ? "Review" : "Start"}
//                         <Play className="w-4 h-4 ml-2" />
//                       </Button>
//                     </div>
//                   </div>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="flex items-center gap-4">
//                     {lesson.videoUrl && (
//                       <div className="flex items-center gap-2 text-sm">
//                         <Video className="w-4 h-4" />
//                         <span>Video Lesson</span>
//                       </div>
//                     )}
//                     <div className="flex items-center gap-2 text-sm">
//                       <Clock className="w-4 h-4" />
//                       <span>{lesson.duration ?? 0} min</span>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))
//           )}
//         </TabsContent>

//         {/* Quizzes */}
//         <TabsContent value="quizzes" className="space-y-4">
//           {quizzes.length === 0 ? (
//             <Card>
//               <CardContent className="text-center py-8">
//                 <p className="text-gray-500">No quizzes available yet.</p>
//               </CardContent>
//             </Card>
//           ) : (
//             quizzes.map((quiz) => (
//               <Card key={quiz.id} className="hover:shadow-md transition-shadow">
//                 <CardHeader>
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <CardTitle className="text-lg flex items-center gap-2">
//                         {quiz.isFinalQuiz && <Trophy className="w-5 h-5" />}
//                         {quiz.title}
//                       </CardTitle>
//                       {quiz.description && <CardDescription>{quiz.description}</CardDescription>}
//                     </div>
//                     <Button size="sm" onClick={() => startQuiz(quiz)} disabled={!enrollment}>
//                       Start Quiz
//                     </Button>
//                   </div>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="flex items-center gap-4">
//                     {!!quiz.timeLimit && (
//                       <div className="flex items-center gap-2 text-sm">
//                         <Clock className="w-4 h-4" />
//                         <span>{quiz.timeLimit} min</span>
//                       </div>
//                     )}
//                     {!!quiz.passingScore && (
//                       <div className="text-sm text-gray-600">Passing Score: {quiz.passingScore}%</div>
//                     )}
//                     <div className="text-sm text-gray-600">{quiz.questions?.length ?? 0} questions</div>
//                     {quiz.isFinalQuiz && <Badge variant="outline">Final Quiz</Badge>}
//                   </div>
//                 </CardContent>
//               </Card>
//             ))
//           )}
//         </TabsContent>

//         {/* Info */}
//         <TabsContent value="info">
//           <Card>
//             <CardHeader>
//               <CardTitle>Course Information</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <h4 className="font-semibold">Instructor</h4>
//                   <p className="text-gray-600">{course.instructor ?? "—"}</p>
//                 </div>
//                 <div>
//                   <h4 className="font-semibold">Duration</h4>
//                   <p className="text-gray-600">{course.duration ?? "—"}</p>
//                 </div>
//                 <div>
//                   <h4 className="font-semibold">Level</h4>
//                   <Badge variant="outline">{course.level ?? "—"}</Badge>
//                 </div>
//                 <div>
//                   <h4 className="font-semibold">Category</h4>
//                   <p className="text-gray-600">{course.category ?? "—"}</p>
//                 </div>
//               </div>
//               <div>
//                 <h4 className="font-semibold mb-2">Course Statistics</h4>
//                 <div className="grid grid-cols-3 gap-4 text-center">
//                   <div className="p-3 border rounded">
//                     <div className="text-2xl font-bold">{course.totalLessons ?? lessons.length}</div>
//                     <div className="text-sm text-gray-600">Lessons</div>
//                   </div>
//                   <div className="p-3 border rounded">
//                     <div className="text-2xl font-bold">{course.totalQuizzes ?? quizzes.length}</div>
//                     <div className="text-sm text-gray-600">Quizzes</div>
//                   </div>
//                   <div className="p-3 border rounded">
//                     <div className="text-2xl font-bold">{course.enrolledStudents ?? "—"}</div>
//                     <div className="text-sm text-gray-600">Students</div>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent> 
//       </Tabs>
//     </div>
//   );
// }



"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, CheckCircle, Clock, Video, ArrowLeft, ArrowRight, Trophy } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { QuizViewer } from "./quiz-viewer";

// ===== Types that match your API payloads =====
export interface Course {
  id: number | string;
  title?: string;
  description?: string;
  name?: string;
  instructor?: string | null;
  duration?: string | number | null;
  level?: string | null;
  category?: string | null;
  totalLessons?: number | null;
  totalQuizzes?: number | null;
  enrolledStudents?: number | null;
  status?: string | null;
}

export interface Lesson {
  id: number | string;
  courseId: number | string;
  title: string;
  description?: string | null;
  content?: string | null;
  videoUrl?: string | null;
  videoThumbnail?: string | null;
  duration?: number | null;
  order?: number | null;
  status?: string | null;
}


export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
  points: number
}
// export interface Quiz {
//   id: string | number;
//   courseId: string | number;
//   title: string;
//   description?: string;
//   timeLimit?: number;
//   passingScore?: number;
//   isFinalQuiz?: boolean;
//   questions: QuizQuestion[];
//   status: "active" | "draft"
//   createdAt: string,
//   attemptscount?: number,
//   maxAttempts: number
// }


export interface Quiz {
  id: string
  courseId: string
   lessonId?: string
  title: string
  description: string
  timeLimit: number
  passingScore: number
  isFinalQuiz: boolean
  questions: QuizQuestion[]
  status: "active" | "draft"
  createdAt: string
  attemptscount: number
  maxAttempts: number
}


export interface Enrollment { 
  id: string | number;
  userId: string | number;
  courseId: string | number;
  status: "in-progress" | "completed" | string;
  progress: number;
  completedLessons?: Array<string | number>; 
}    

// ===== Props =====
interface CourseViewerProps {
  courseId: string;
  onBack: () => void;
}

export function CourseViewer({ courseId, onBack }: CourseViewerProps) {
  const { user } = useAuth();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);

  const [viewMode, setViewMode] = useState<"overview" | "lesson" | "quiz">("overview");
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const lessonStartRef = useRef<number | null>(null);

  // Memoize getHeaders (safe even if effect no longer depends on it)
  const getHeaders = useCallback((): HeadersInit => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  }, [token]);

  // ---------- Helpers ----------
  const titleSafe = useMemo(() => course?.title || course?.name || "Course", [course]);

  const extractYouTubeId = (url?: string | null): string | null => {
    if (!url) return null;
    const regex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const isLessonCompleted = (lessonId: string | number): boolean => {
    if (!enrollment?.completedLessons) return false;
    return enrollment.completedLessons.includes(lessonId);
  };

  const sortedLessons = useMemo(() => {
    return [...lessons].sort((a, b) => {
      const ao = a.order ?? 999999;
      const bo = b.order ?? 999999;
      if (ao !== bo) return ao - bo;
      const an = Number(a.id);
      const bn = Number(b.id);
      if (!Number.isNaN(an) && !Number.isNaN(bn)) return an - bn;
      return 0;
    });
  }, [lessons]);

  const getNextLesson = (): Lesson | null => {
    if (!currentLesson) return null;
    const idx = sortedLessons.findIndex((l) => String(l.id) === String(currentLesson.id));
    return idx >= 0 && idx < sortedLessons.length - 1 ? sortedLessons[idx + 1] : null;
  };

  const getPreviousLesson = (): Lesson | null => {
    if (!currentLesson) return null;
    const idx = sortedLessons.findIndex((l) => String(l.id) === String(currentLesson.id));
    return idx > 0 ? sortedLessons[idx - 1] : null;
  };

  // ---------- Load everything ----------
  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        // Course
        const cRes = await fetch(`/api/courses/${courseId}`, { headers: getHeaders() });
        if (!cRes.ok) throw new Error(`Course load failed (${cRes.status})`);
        const cData: Course = await cRes.json();
        if (!active) return;
        setCourse(cData);

        // Lessons
        const lRes = await fetch(`/api/lessons/${courseId}`, { headers: getHeaders() });
        if (!lRes.ok) throw new Error(`Lessons load failed (${lRes.status})`);
        const lData: Lesson[] = await lRes.json();
        if (!active) return;
        setLessons(Array.isArray(lData) ? lData : []);

        // Quizzes (optional)
        try {
          const qRes = await fetch(`/api/quizzes?courseId=${courseId}`, { headers: getHeaders() });
          const ok = qRes.ok;
          const qData = ok ? await qRes.json() : [];
          if (active) setQuizzes(Array.isArray(qData) ? qData : []);
        } catch {
          if (active) setQuizzes([]);
        }

        // Enrollment for this user/course
        if (user?.id) {
          const eRes = await fetch(`/api/enrollments?userId=${user.id}&courseId=${courseId}`, {
            headers: getHeaders(),
            credentials: "include",
          });
          if (eRes.ok) {
            const eData = await eRes.json();
            const enrollmentObj = Array.isArray(eData) ? eData[0] : eData;
            if (active) setEnrollment(enrollmentObj || null);
          } else {
            if (active) setEnrollment(null);
          }
        } else {
          setEnrollment(null);
        }
      } catch (e: any) {
        if (active) setErr(e?.message || "Failed to load course");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [courseId, user?.id]); // ✅ removed getHeaders from deps

  // ---------- Actions ----------
  const enrollInCourse = async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`/api/enrollments`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ userId: user.id, courseId }),
      });
      if (!res.ok) throw new Error(`Enroll failed (${res.status})`);
      const e = await res.json();
      setEnrollment(e);
    } catch (e) {
      console.error(e);
    }
  };

  const startLesson = (lesson: Lesson) => {
    setCurrentLesson(lesson);
    lessonStartRef.current = Date.now();
    setViewMode("lesson");
  };

  const completeLesson = async () => {
    if (!currentLesson || !user?.id || !lessonStartRef.current) return;
    const timeSpentMin = Math.max(1, Math.round((Date.now() - lessonStartRef.current) / 60000));
    try {
      await fetch(`/api/lesson-progress`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ userId: user.id, lessonId: currentLesson.id, timeSpent: timeSpentMin }),
      });
      // Refresh enrollment/progress
      const eRes = await fetch(`/api/enrollments?userId=${user.id}&courseId=${courseId}`, {
        headers: getHeaders(),
        credentials: "include",
      });
      if (eRes.ok) {
        const eData = await eRes.json();
        const enrollmentObj = Array.isArray(eData) ? eData[0] : eData;
        setEnrollment(enrollmentObj || null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setViewMode("overview");
      lessonStartRef.current = null;
    }
  };

  const startQuiz = (quiz: Quiz) => {
    setCurrentQuiz(quiz);
    setViewMode("quiz");
  };

  const onQuizComplete = async () => {
    if (user?.id) {
      try {
        const eRes = await fetch(`/api/enrollments?userId=${user.id}&courseId=${courseId}`, {
          headers: getHeaders(),
          credentials: "include",
        });
        if (eRes.ok) {
          const eData = await eRes.json();
          const enrollmentObj = Array.isArray(eData) ? eData[0] : eData;
          setEnrollment(enrollmentObj || null);
        }
      } catch {}
    }
    setViewMode("overview");
  };

  // ---------- UI States ----------
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-10 text-center text-gray-600">
        Loading course…
      </div>
    );
  }

  if (err || !course) {
    return (
      <div className="max-w-6xl mx-auto py-10 text-center">
        <p className="text-red-600 mb-4">{err || "Course not found"}</p>
        <Button variant="outline" onClick={onBack}>Back to Courses</Button>
      </div>
    );
  }

  if (viewMode === "quiz" && currentQuiz) {
    return (
      <QuizViewer
        quiz={currentQuiz}
        onComplete={onQuizComplete}
        onBack={() => setViewMode("overview")}
      />
    );
  }

  if (viewMode === "lesson" && currentLesson) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setViewMode("overview")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Course
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{currentLesson.title}</h1>
            {currentLesson.description && <p className="text-gray-600">{currentLesson.description}</p>}
          </div>
          <Badge variant={isLessonCompleted(currentLesson.id) ? "default" : "secondary"}>
            {isLessonCompleted(currentLesson.id) ? "Completed" : "In Progress"}
          </Badge>
        </div>

        <Card>
          <CardContent className="p-6">
            {currentLesson.videoUrl && extractYouTubeId(currentLesson.videoUrl) && (
              <div className="mb-6">
                <div className="aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${extractYouTubeId(currentLesson.videoUrl)}`}
                    className="w-full h-full rounded-lg"
                    allowFullScreen
                    title={currentLesson.title}
                  />
                </div>
              </div>
            )}

            {currentLesson.content && (
              <div className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ __html: currentLesson.content }} />
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => {
              const prev = getPreviousLesson();
              if (prev) startLesson(prev);
            }}
            disabled={!getPreviousLesson()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous Lesson
          </Button>

          <div className="flex gap-2">
            {!isLessonCompleted(currentLesson.id) && (
              <Button onClick={completeLesson}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark Complete
              </Button>
            )}

            <Button
              onClick={() => {
                const next = getNextLesson();
                if (next) startLesson(next);
              }}
              disabled={!getNextLesson()}
            >
              Next Lesson
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const completedCount = enrollment?.completedLessons?.length ?? 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Courses
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{titleSafe}</h1>
          {course.description && <p className="text-gray-600 mt-2">{course.description}</p>}
        </div>
      </div>

      {enrollment ? (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Your Progress</h3>
              <Badge variant={enrollment.status === "completed" ? "default" : "secondary"}>
                {enrollment.status}
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Course Progress</span>
                <span>{Math.round(enrollment.progress || 0)}%</span>
              </div>
              <Progress value={enrollment.progress || 0} className="h-2" />
              <p className="text-sm text-gray-600">
                {completedCount} of {lessons.length} lessons completed
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Enroll in this Course</h3>
            <p className="text-gray-600 mb-4">
              Get access to all lessons, quizzes, and earn a certificate upon completion.
            </p>
            <Button onClick={enrollInCourse}>Enroll Now</Button>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="lessons" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="lessons">Lessons</TabsTrigger>
          <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
          <TabsTrigger value="info">Course Info</TabsTrigger>
        </TabsList>

        <TabsContent value="lessons" className="space-y-4">
          {sortedLessons.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">No lessons available yet.</p>
              </CardContent>
            </Card>
          ) : (
            sortedLessons.map((lesson, index) => (
              <Card key={lesson.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">
                        {lesson.order ?? index + 1}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{lesson.title}</CardTitle>
                        {lesson.description && <CardDescription>{lesson.description}</CardDescription>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isLessonCompleted(lesson.id) && (
                        <Badge variant="outline">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Completed
                        </Badge>
                      )}
                      <Button
                        size="sm"
                        onClick={() => startLesson(lesson)}
                        disabled={!enrollment}
                        variant={isLessonCompleted(lesson.id) ? "outline" : "default"}
                      >
                        {isLessonCompleted(lesson.id) ? "Review" : "Start"}
                        <Play className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    {lesson.videoUrl && (
                      <div className="flex items-center gap-2 text-sm">
                        <Video className="w-4 h-4" />
                        <span>Video Lesson</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>{lesson.duration ?? 0} min</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="quizzes" className="space-y-4">
          {quizzes.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">No quizzes available yet.</p>
              </CardContent>
            </Card>
          ) : (
            quizzes.map((quiz) => (
              <Card key={quiz.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {quiz.isFinalQuiz && <Trophy className="w-5 h-5" />}
                        {quiz.title}
                      </CardTitle>
                      {quiz.description && <CardDescription>{quiz.description}</CardDescription>}
                    </div>
                    <Button size="sm" onClick={() => startQuiz(quiz)} disabled={!enrollment}>
                      Start Quiz
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    {!!quiz.timeLimit && (
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4" />
                        <span>{quiz.timeLimit} min</span>
                      </div>
                    )}
                    {!!quiz.passingScore && (
                      <div className="text-sm text-gray-600">Passing Score: {quiz.passingScore}%</div>
                    )}
                    <div className="text-sm text-gray-600">{quiz.questions?.length ?? 0} questions</div>
                    {quiz.isFinalQuiz && <Badge variant="outline">Final Quiz</Badge>}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>Course Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold">Instructor</h4>
                  <p className="text-gray-600">{course.instructor ?? "—"}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Duration</h4>
                  <p className="text-gray-600">{course.duration ?? "—"}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Level</h4>
                  <Badge variant="outline">{course.level ?? "—"}</Badge>
                </div>
                <div>
                  <h4 className="font-semibold">Category</h4>
                  <p className="text-gray-600">{course.category ?? "—"}</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Course Statistics</h4>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 border rounded">
                    <div className="text-2xl font-bold">{course.totalLessons ?? lessons.length}</div>
                    <div className="text-sm text-gray-600">Lessons</div>
                  </div>
                  <div className="p-3 border rounded">
                    <div className="text-2xl font-bold">{course.totalQuizzes ?? quizzes.length}</div>
                    <div className="text-sm text-gray-600">Quizzes</div>
                  </div>
                  <div className="p-3 border rounded">
                    <div className="text-2xl font-bold">{course.enrolledStudents ?? "—"}</div>
                    <div className="text-sm text-gray-600">Students</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 

