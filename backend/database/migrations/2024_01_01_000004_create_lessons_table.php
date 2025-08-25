<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('lessons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained()->onDelete('cascade');
            $table->foreignId('module_id')->nullable()->constrained('course_modules')->onDelete('cascade');
            $table->string('title');
            $table->text('description')->nullable();
            $table->longText('content')->nullable();
            $table->string('video_url')->nullable();
            $table->string('video_thumbnail')->nullable();
            $table->integer('duration_minutes')->default(0);
            $table->integer('order_index')->default(0);
            $table->enum('status', ['active', 'draft'])->default('active');
            $table->enum('lesson_type', ['video', 'text', 'interactive', 'assignment'])->default('video');
            $table->json('attachments')->nullable();
            $table->boolean('is_preview')->default(false);
            $table->timestamps(); 
        });
    }

    public function down()
    {
        Schema::dropIfExists('lessons');
    }
};
