<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\WaliKelas; 
use Illuminate\Http\Request;

class WaliKelasController extends Controller
{
    public function index(Request $request)
    {
        $query = WaliKelas::withCount('kelas');
        
        if ($request->has('search') && $request->search !== '') {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('kode_wali', 'like', "%{$search}%")
                  ->orWhere('nama_wali', 'like', "%{$search}%")
                  ->orWhere('deskripsi', 'like', "%{$search}%");
            });
        }
        
        
        $wali_kelas = $query->latest()->paginate(10);
        
        return view('admin.wali_kelas.index', compact('wali_kelas'));
    }

    public function create()
    {
       return view('admin.wali_kelas.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'kode_wali' => 'required|string|max:10|unique:wali_kelas,kode_wali',
            'nama_wali' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
        ], [
            'kode_wali.required' => 'Kode Wali Kelas wajib diisi',
            'kode_wali.unique'   => 'Kode Wali Kelas sudah digunakan',
            'nama_wali.required' => 'Nama Wali Kelas wajib diisi',
        ]);

        WaliKelas::create($validated);

        return redirect()->route('admin.wali-kelas.index')
            ->with('success', 'Wali Kelas berhasil ditambahkan');
    }

    public function show($id)
{
    $waliKelas = WaliKelas::withCount('kelas')
        ->with(['kelas' => function ($query) {
            $query->withCount('siswa');
        }])
        ->findOrFail($id);

    return response()->json([
        'success' => true,
        'wali_kelas' => [
            'id'          => $waliKelas->id,
            'kode_wali'   => $waliKelas->kode_wali,
            'nama_wali'   => $waliKelas->nama_wali,
            'deskripsi'   => $waliKelas->deskripsi,
            'kelas_count' => $waliKelas->kelas_count,
            'kelas'       => $waliKelas->kelas->map(function ($kelas) {
                return [
                    'id'          => $kelas->id,
                    'nama_kelas'  => $kelas->nama_kelas,
                    'siswa_count' => $kelas->siswa_count,
                ];
            }),
            'created_at'  => $waliKelas->created_at,
            'updated_at'  => $waliKelas->updated_at,
        ]
    ]);
}

public function edit($id)
{
    $waliKelas = WaliKelas::findOrFail($id);

    return response()->json([
        'success' => true,
        'wali_kelas' => [
            'id' => $waliKelas->id,
            'kode_wali' => $waliKelas->kode_wali,
            'nama_wali' => $waliKelas->nama_wali,
            'deskripsi' => $waliKelas->deskripsi,
        ]
    ]);
}
public function update(Request $request, $id)
{
    $waliKelas = WaliKelas::findOrFail($id);

    $validated = $request->validate([
        'kode_wali' => 'required|string|max:10|unique:wali_kelas,kode_wali,' . $waliKelas->id,
        'nama_wali' => 'required|string|max:255',
        'deskripsi' => 'nullable|string',
    ]);

    $waliKelas->update($validated);

    return redirect()->route('admin.wali-kelas.index')
        ->with('success', 'Wali Kelas berhasil diperbarui');
}

    public function destroy($id)
{
    $waliKelas = WaliKelas::findOrFail($id);

    if ($waliKelas->kelas()->count() > 0) {
        return redirect()->route('admin.wali-kelas.index')
            ->with('error', 'Wali Kelas tidak dapat dihapus karena masih mengampu ' . $waliKelas->kelas()->count() . ' kelas');
    }

    $waliKelas->delete();

    return redirect()->route('admin.wali-kelas.index')
        ->with('success', 'Wali Kelas berhasil dihapus');
}
}