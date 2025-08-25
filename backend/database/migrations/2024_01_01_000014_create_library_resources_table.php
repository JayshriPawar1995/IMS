<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('library_resources', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('type', ['document', 'video', 'audio', 'image', 'link'])->default('document');
            $table->string('file_path')->nullable();
            $table->string('external_url')->nullable();
            $table->string('category');
            $table->json('tags')->nullable();
            $table->enum('access_level', ['public', 'agents', 'field_officers', 'admins'])->default('public');
            $table->boolean('is_featured')->default(false);
            $table->integer('download_count')->default(0);
            $table->integer('view_count')->default(0);
            $table->foreignId('uploaded_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('library_resources');
    }
};
