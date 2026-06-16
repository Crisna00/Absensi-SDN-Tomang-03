<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kelas extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'wali_id',         
        'tingkat',
        'kode_kelas',
        'wali_kelas_id',   // Kolom penanda jumlah kelas tetap ada di sini
    ];

    
    public function wali_kelas()
    {
        // Menghubungkan kolom 'wali_id' ke model WaliKelas
        return $this->belongsTo(WaliKelas::class, 'wali_id');
    }

    // Tetap pertahankan relasi ini jika 'wali_kelas_id' masih Anda gunakan di tempat lain
    public function waliKelas()
    {
        return $this->belongsTo(User::class, 'wali_kelas_id');
    }

    public function siswa()
    {
        return $this->hasMany(User::class, 'kelas_id')
                    ->where('role', 2); 
    }

    public function getSiswaCountAttribute()
    {
        return $this->siswa()->count();
    }

    public function getNamaLengkapAttribute()
    {
        return $this->nama_kelas . ' - Tingkat ' . $this->tingkat;
    }
}