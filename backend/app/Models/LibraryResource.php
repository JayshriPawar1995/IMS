<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LibraryResource extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'type',
        'file_path',
        'external_url',
        'category',
        'tags',
        'access_level',
        'is_featured',
        'download_count',
        'view_count',
        'uploaded_by',
    ];

    protected $casts = [
        'tags' => 'array',
        'is_featured' => 'boolean',
    ];

    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    public function scopeAccessibleBy($query, $role)
    {
        return $query->where(function($q) use ($role) {
            $q->where('access_level', 'public')
              ->orWhere('access_level', $role);
        });
    }

    public function incrementDownloadCount()
    {
        $this->increment('download_count');
    }

    public function incrementViewCount()
    {
        $this->increment('view_count');
    }
}
