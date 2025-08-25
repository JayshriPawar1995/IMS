<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuizAttempt extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'quiz_id',
        'enrollment_id',
        'answers',
        'score',
        'total_questions',
        'correct_answers',
        'passed',
        'started_at',
        'completed_at',
        'time_taken_minutes',
    ];

    protected $casts = [
        'answers' => 'array',
        'score' => 'decimal:2',
        'passed' => 'boolean',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function quiz()
    {
        return $this->belongsTo(Quiz::class);
    }

    public function enrollment()
    {
        return $this->belongsTo(Enrollment::class);
    }
}
