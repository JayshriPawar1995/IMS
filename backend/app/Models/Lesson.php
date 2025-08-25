<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lesson extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'module_id',
        'title',
        'description',
        'content',
        'video_url',
        'video_thumbnail',
        'duration_minutes',
        'order_index',
        'status',
        'lesson_type',
        'attachments',
        'is_preview',
    ];

    protected $casts = [
        'attachments' => 'array',
        'is_preview' => 'boolean',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function module()
    {
        return $this->belongsTo(CourseModule::class, 'module_id');
    }

    public function quiz()
    {
        return $this->hasOne(Quiz::class);
    }

    public function progress()
    {
        return $this->hasMany(LessonProgress::class);
    }

    public function userProgress($userId)
    {
        return $this->hasOne(LessonProgress::class)->where('user_id', $userId);
    }
}
