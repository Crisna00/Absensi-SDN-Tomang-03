<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WaliKelas extends Model
{
    use HasFactory;

    protected $fillable = [
        'kode_wali',
        'nama_wali',
        'deskripsi',
    ];

    public function kelas()
    {
        return $this->hasMany(Kelas::class);
    }
}