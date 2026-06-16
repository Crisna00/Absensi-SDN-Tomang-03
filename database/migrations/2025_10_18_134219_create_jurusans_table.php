<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('wali_kelas', function (Blueprint $table) {
            $table->id();
            $table->string('kode_wali', 10)->unique();
            $table->string('nama_wali');
            $table->text('deskripsi')->nullable();
            $table->timestamps();

            $table->index('kode_wali');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('wali_kelas');
    }
};