<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'role',
        'status',
        'password',
        'avatar',
        'bio',
        'department',
        'employee_id',
        'date_of_birth',
        'gender',
        'address',
        'last_login_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'date_of_birth' => 'date',
        'last_login_at' => 'datetime',
    ];

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }

    public function supportTickets()
    {
        return $this->hasMany(SupportTicket::class);
    }

    public function supportResponses()
    {
        return $this->hasMany(SupportResponse::class);
    }

    public function certificates()
    {
        return $this->hasMany(Certificate::class);
    }

    public function lessonProgress()
    {
        return $this->hasMany(LessonProgress::class);
    }

    public function quizAttempts()
    {
        return $this->hasMany(QuizAttempt::class);
    }

    public function assignedTickets()
    {
        return $this->hasMany(SupportTicket::class, 'assigned_to');
    }

    public function createdNotices()
    {
        return $this->hasMany(Notice::class, 'created_by');
    }

    public function uploadedResources()
    {
        return $this->hasMany(LibraryResource::class, 'uploaded_by');
    }

    public function isAdmin()
    {
        return $this->role === 'admin';
    }

    public function isAgent()
    {
        return $this->role === 'agent';
    }

    public function isFieldOfficer()
    {
        return $this->role === 'field_officer';
    }

    public function isApproved()
    {
        return $this->status === 'approved';
    }
}
