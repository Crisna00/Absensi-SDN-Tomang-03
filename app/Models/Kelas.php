<?php

namespace App\Models;
use App\Models\WaliKelas;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kelas extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'wali_id',  
        'nama_kelas',       
        'tingkat',
        'kode_kelas',
        'wali_kelas_id',  
    ];

    
   public function waliKelas()
{
    return $this->belongsTo(WaliKelas::class, 'wali_id');
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