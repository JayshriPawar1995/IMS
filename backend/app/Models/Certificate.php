<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Certificate extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'course_id',
        'enrollment_id',
        'certificate_number',
        'certificate_name',
        'final_score',
        'grade',
        'issued_at',
        'valid_until',
        'certificate_path',
        'status',
        'metadata',
    ];

    protected $casts = [
        'final_score' => 'decimal:2',
        'issued_at' => 'datetime',
        'valid_until' => 'datetime',
        'metadata' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function enrollment()
    {
        return $this->belongsTo(Enrollment::class);
    }
}
