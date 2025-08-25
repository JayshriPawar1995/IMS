<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'instructor',
        'duration',
        'level',
        'category',
        'status',
        'thumbnail',
        'target_role',
        'passing_score',
        'price',
        'is_featured',
        'tags',
        'prerequisites',
        'learning_outcomes',
        'estimated_hours',
    ];

    protected $casts = [
        'tags' => 'array',
        'is_featured' => 'boolean',
        'price' => 'decimal:2',
    ];

    public function modules()
    {
        return $this->hasMany(CourseModule::class)->orderBy('order_index');
    }

    public function lessons()
    {
        return $this->hasMany(Lesson::class)->orderBy('order_index');
    }

    public function quizzes()
    {
        return $this->hasMany(Quiz::class);
    }

    public function finalQuiz()
    {
        return $this->hasOne(Quiz::class)->where('is_final_quiz', true);
    }

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }

    public function certificates()
    {
        return $this->hasMany(Certificate::class);
    }

    public function getEnrolledStudentsCountAttribute()
    {
        return $this->enrollments()->count();
    }

    public function getTotalLessonsCountAttribute()
    {
        return $this->lessons()->count();
    }

    public function getTotalQuizzesCountAttribute()
    {
        return $this->quizzes()->count();
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeForRole($query, $role)
    {
        if ($role === 'both') {
            return $query;
        }
        return $query->where(function($q) use ($role) {
            $q->where('target_role', $role)->orWhere('target_role', 'both');
        });
    }
}
