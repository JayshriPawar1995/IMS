<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('certificates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('course_id')->constrained()->onDelete('cascade');
            $table->foreignId('enrollment_id')->constrained()->onDelete('cascade');
            $table->string('certificate_number')->unique();
            $table->string('certificate_name');
            $table->decimal('final_score', 5, 2);
            $table->string('grade');
            $table->timestamp('issued_at');
            $table->timestamp('valid_until')->nullable();
            $table->string('certificate_path')->nullable();
            $table->enum('status', ['active', 'revoked', 'expired'])->default('active');
            $table->json('metadata')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('certificates');
    }
};
