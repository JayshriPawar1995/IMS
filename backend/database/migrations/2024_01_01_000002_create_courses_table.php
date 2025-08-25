<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->string('instructor');
            $table->string('duration');
            $table->enum('level', ['beginner', 'intermediate', 'advanced']);
            $table->string('category');
            $table->enum('status', ['active', 'draft', 'archived'])->default('draft');
            $table->string('thumbnail')->nullable();
            $table->enum('target_role', ['agent', 'field_officer', 'both'])->default('both');
            $table->integer('passing_score')->default(70);
            $table->decimal('price', 10, 2)->default(0);
            $table->boolean('is_featured')->default(false);
            $table->json('tags')->nullable();
            $table->text('prerequisites')->nullable();
            $table->text('learning_outcomes')->nullable();
            $table->integer('estimated_hours')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('courses');
    }
};
