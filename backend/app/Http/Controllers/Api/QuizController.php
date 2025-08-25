<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Quiz;
use App\Models\QuizAttempt;
use App\Models\Enrollment;
use App\Models\Certificate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class QuizController extends Controller
{
    public function show($id)
    {
        $quiz = Quiz::with(['questions', 'course'])->findOrFail($id);
        
        // Check enrollment
        $enrollment = Enrollment::where('user_id', Auth::id())
            ->where('course_id', $quiz->course_id)
            ->first();
            
        if (!$enrollment) {
            return response()->json([
                'success' => false,
                'message' => 'You are not enrolled in this course'
            ], 403);
        }

        // Get user attempts
        $attempts = QuizAttempt::where('user_id', Auth::id())
            ->where('quiz_id', $id)
            ->orderBy('created_at', 'desc')
            ->get();
            
        $quiz->attempts_count = $attempts->count();
        $quiz->best_score = $attempts->max('score') ?? 0;
        $quiz->can_attempt = $attempts->count() < $quiz->max_attempts;
        $quiz->last_attempt = $attempts->first();

        // Remove correct answers from questions for security
        $quiz->questions->each(function($question) {
            unset($question->correct_answer);
            unset($question->explanation);
        });

        return response()->json([
            'success' => true,
            'data' => $quiz
        ]);
    }

    public function submit(Request $request, $id)
    {
        $quiz = Quiz::with(['questions', 'course'])->findOrFail($id);
        
        $enrollment = Enrollment::where('user_id', Auth::id())
            ->where('course_id', $quiz->course_id)
            ->first();
            
        if (!$enrollment) {
            return response()->json([
                'success' => false,
                'message' => 'You are not enrolled in this course'
            ], 403);
        }

        // Check attempt limit
        $attemptCount = QuizAttempt::where('user_id', Auth::id())
            ->where('quiz_id', $id)
            ->count();
            
        if ($attemptCount >= $quiz->max_attempts) {
            return response()->json([
                'success' => false,
                'message' => 'Maximum attempts exceeded'
            ], 400);
        }

        $request->validate([
            'answers' => 'required|array',
            'started_at' => 'required|date',
            'time_taken' => 'required|integer'
        ]);

        // Calculate score
        $answers = $request->answers;
        $correctAnswers = 0;
        $totalQuestions = $quiz->questions->count();
        
        foreach ($quiz->questions as $question) {
            $userAnswer = $answers[$question->id] ?? null;
            if ($userAnswer == $question->correct_answer) {
                $correctAnswers++;
            }
        }
        
        $score = $totalQuestions > 0 ? round(($correctAnswers / $totalQuestions) * 100) : 0;
        $passed = $score >= $quiz->passing_score;

        // Create attempt record
        $attempt = QuizAttempt::create([
            'user_id' => Auth::id(),
            'quiz_id' => $id,
            'enrollment_id' => $enrollment->id,
            'answers' => $answers,
            'score' => $score,
            'total_questions' => $totalQuestions,
            'passed' => $passed,
            'started_at' => $request->started_at,
            'completed_at' => now(),
            'time_taken_minutes' => $request->time_taken
        ]);

        // If this is the final quiz and user passed, generate certificate
        if ($quiz->is_final_quiz && $passed) {
            $this->generateCertificate($enrollment, $score);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'attempt' => $attempt,
                'score' => $score,
                'passed' => $passed,
                'correct_answers' => $correctAnswers,
                'total_questions' => $totalQuestions
            ],
            'message' => $passed ? 'Quiz passed successfully!' : 'Quiz completed. Try again to improve your score.'
        ]);
    }

    private function generateCertificate($enrollment, $finalScore)
    {
        $course = $enrollment->course;
        $user = $enrollment->user;
        
        // Generate unique certificate number
        $certificateNumber = 'ZBS-' . strtoupper(substr($course->category, 0, 2)) . '-' . date('Y') . '-' . str_pad($enrollment->id, 4, '0', STR_PAD_LEFT);
        
        // Determine grade
        $grade = $this->calculateGrade($finalScore);
        
        Certificate::create([
            'user_id' => $user->id,
            'course_id' => $course->id,
            'enrollment_id' => $enrollment->id,
            'certificate_number' => $certificateNumber,
            'certificate_name' => $course->title . ' Completion Certificate',
            'final_score' => $finalScore,
            'grade' => $grade,
            'issued_at' => now(),
            'valid_until' => now()->addYear(),
            'certificate_path' => 'certificates/' . $certificateNumber . '.pdf',
            'status' => 'active'
        ]);
    }
    
    private function calculateGrade($score)
    {
        if ($score >= 95) return 'A+';
        if ($score >= 90) return 'A';
        if ($score >= 85) return 'A-';
        if ($score >= 80) return 'B+';
        if ($score >= 75) return 'B';
        if ($score >= 70) return 'B-';
        return 'C';
    }
}
