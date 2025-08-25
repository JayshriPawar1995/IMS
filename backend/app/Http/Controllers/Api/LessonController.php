<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lesson;
use App\Models\LessonProgress;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LessonController extends Controller
{
    public function show($id)
    {
        $lesson = Lesson::with(['course', 'module'])->findOrFail($id);
        
        // Check if user is enrolled in the course
        $enrollment = Enrollment::where('user_id', Auth::id())
            ->where('course_id', $lesson->course_id)
            ->first();
            
        if (!$enrollment) {
            return response()->json([
                'success' => false,
                'message' => 'You are not enrolled in this course'
            ], 403);
        }

        // Get user progress for this lesson
        $progress = LessonProgress::where('user_id', Auth::id())
            ->where('lesson_id', $id)
            ->first();
            
        $lesson->completed = $progress ? $progress->completed : false;
        $lesson->time_spent = $progress ? $progress->time_spent_minutes : 0;

        return response()->json([
            'success' => true,
            'data' => $lesson
        ]);
    }

    public function markComplete(Request $request, $id)
    {
        $lesson = Lesson::findOrFail($id);
        
        $enrollment = Enrollment::where('user_id', Auth::id())
            ->where('course_id', $lesson->course_id)
            ->first();
            
        if (!$enrollment) {
            return response()->json([
                'success' => false,
                'message' => 'You are not enrolled in this course'
            ], 403);
        }

        $progress = LessonProgress::updateOrCreate(
            [
                'user_id' => Auth::id(),
                'lesson_id' => $id,
                'enrollment_id' => $enrollment->id
            ],
            [
                'completed' => true,
                'completed_at' => now(),
                'time_spent_minutes' => $request->input('time_spent', 0)
            ]
        );

        // Update course progress
        $this->updateCourseProgress($enrollment);

        return response()->json([
            'success' => true,
            'data' => $progress,
            'message' => 'Lesson marked as complete'
        ]);
    }

    private function updateCourseProgress($enrollment)
    {
        $totalLessons = Lesson::where('course_id', $enrollment->course_id)->count();
        $completedLessons = LessonProgress::where('enrollment_id', $enrollment->id)
            ->where('completed', true)
            ->count();
            
        $progressPercentage = $totalLessons > 0 ? round(($completedLessons / $totalLessons) * 100) : 0;
        
        $enrollment->update([
            'progress_percentage' => $progressPercentage,
            'completed_at' => $progressPercentage === 100 ? now() : null,
            'status' => $progressPercentage === 100 ? 'completed' : 'active'
        ]);
    }
}
