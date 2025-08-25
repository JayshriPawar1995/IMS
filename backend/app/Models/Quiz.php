<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Quiz extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'lesson_id',
        'title',
        'description',
        'time_limit_minutes',
        'passing_score',
        'max_attempts',
        'is_final_quiz',
        'shuffle_questions',
        'show_results_immediately',
        'status',
    ];

    protected $casts = [
        'is_final_quiz' => 'boolean',
        'shuffle_questions' => 'boolean',
        'show_results_immediately' => 'boolean',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function lesson()
    {
        return $this->belongsTo(Lesson::class);
    }

    public function questions()
    {
        return $this->hasMany(QuizQuestion::class)->orderBy('order_index');
    }

    public function attempts()
    {
        return $this->hasMany(QuizAttempt::class);
    }

    public function userAttempts($userId)
    {
        return $this->hasMany(QuizAttempt::class)->where('user_id', $userId);
    }
}
