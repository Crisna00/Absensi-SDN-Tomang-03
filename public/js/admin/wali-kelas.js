document.addEventListener('DOMContentLoaded', function() {
    const csrfToken = document.querySelector('input[name="_token"]').value;

    const showButtons = document.querySelectorAll('.btn-show-wali-kelas');
    showButtons.forEach(button => {
        button.addEventListener('click', function() {
            const waliKelasId = this.getAttribute('data-wali-kelas-id');
            const modal = new bootstrap.Modal(document.getElementById('showWaliKelasModal'));
            const content = document.getElementById('showWaliKelasContent');
            
            content.innerHTML = `
                <div class="text-center py-5">
                    <div class="spinner-border text-primary" role="status"></div>
                </div>
            `;
            
            modal.show();
            
            fetch(`/admin/wali-kelas/${waliKelasId}`, {
                method: 'GET',
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const waliKelas = data.waliKelas;
                    
                    let kelasHtml = '';
                   if (waliKelas.kelas && waliKelas.kelas.length > 0) {
                       kelasHtml = waliKelas.kelas.map(kelas => `
                            <div class="col-md-6">
                                <div class="card border">
                                    <div class="card-body">
                                        <div class="d-flex justify-content-between align-items-start">
                                            <div>
                                                <h6 class="mb-1">${kelas.nama_kelas}</h6>
                                                <small class="text-muted">
                                                    <i class="bi bi-people-fill me-1"></i>${kelas.siswa_count || 0} Siswa
                                                </small>
                                            </div>
                                            ${kelas.wali_kelas ? `
                                                <span class="badge bg-info-soft text-info">
                                                    <i class="bi bi-person-badge me-1"></i>
                                                    ${kelas.wali_kelas.name}
                                                </span>
                                            ` : ''}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `).join('');
                    } else {
                        kelasHtml = `
                            <div class="col-12">
                                <div class="alert alert-info mb-0">
                                    <i class="bi bi-info-circle me-2"></i>
                                   'Belum ada kelas yang diampu oleh wali kelas ini'
                                </div>
                            </div>
                        `;
                    }
                    
                    content.innerHTML = `
                        <div class="row g-4">
                            <!-- Info Utama -->
                            <div class="col-12">
                                <div class="card bg-primary-soft border-0">
                                    <div class="card-body">
                                        <div class="row align-items-center">
                                            <div class="col-auto">
                                                <div class="avatar avatar-xl bg-primary text-white">
                                                    <span class="fs-3 fw-bold">${waliKelas.kode_wali}</span>
                                                </div>
                                            </div>
                                            <div class="col">
                                              <h4 class="mb-1">${waliKelas.nama_wali}</h4>
                                              <p class="text-muted mb-0">
                                                    <i class="bi bi-door-open me-2"></i>
                                                    ${waliKelas.kelas_count || 0} Kelas Diampu
                                             </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Deskripsi -->
                            ${waliKelas.deskripsi ? `
                                <div class="col-12">
                                    <h6 class="mb-2">
                                        <i class="bi bi-info-circle me-2 text-primary"></i>Deskripsi
                                    </h6>
                                    <p class="text-muted mb-0">${waliKelas.deskripsi}</p>
                                </div>
                            ` : ''}

                            <!-- Daftar Kelas -->
                            <div class="col-12">
                                <h6 class="mb-3">
                                    <i class="bi bi-building me-2 text-primary"></i>
                                    Daftar Kelas (${waliKelas.kelas_count || 0})
                                </h6>
                                <div class="row g-3">
                                    ${kelasHtml}
                                </div>
                            </div>

                            <!-- Informasi Tambahan -->
                            <div class="col-12">
                                <div class="border-top pt-3">
                                    <div class="row text-muted small">
                                        <div class="col-md-6">
                                            <i class="bi bi-calendar-plus me-2"></i>
                                            <strong>Dibuat:</strong> ${new Date(waliKelas.created_at).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                        <div class="col-md-6">
                                            <i class="bi bi-calendar-check me-2"></i>
                                            <strong>Diperbarui:</strong> ${new Date(waliKelas.updated_at).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                }
            })
            .catch(error => {
                console.error('Error:', error);
                content.innerHTML = `
                    <div class="alert alert-danger">
                        <i class="bi bi-exclamation-triangle me-2"></i>
                        text: 'Gagal memuat data wali kelas',
                    </div>
                `;
            });
        });
    });

    const editButtons = document.querySelectorAll('.btn-edit-wali-kelas');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const waliKelasId = this.getAttribute('data-wali-kelas-id');
            const modal = new bootstrap.Modal(document.getElementById('editWaliKelasModal'));
            const form = document.getElementById('editWaliKelasForm');
            const loading = document.getElementById('editWaliKelasLoading');
            const formContent = document.getElementById('editWaliKelasFormContent');
            const submitBtn = document.getElementById('editWaliKelasSubmitBtn');
            
            loading.style.display = 'block';
            formContent.style.display = 'none';
            submitBtn.style.display = 'none';
            
            modal.show();
            
            fetch(`/admin/wali-kelas/${waliKelasId}/edit`, {
                method: 'GET',
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const waliKelas = data.waliKelas;
                    
                    form.action = `/admin/wali-kelas/${waliKelas.id}`;
                    
                    document.getElementById('edit_kode_wali').value = waliKelas.kode_wali;
                    document.getElementById('edit_nama_wali').value = waliKelas.nama_wali;
                    document.getElementById('edit_deskripsi').value = waliKelas.deskripsi || '';
                    
                    loading.style.display = 'none';
                    formContent.style.display = 'block';
                    submitBtn.style.display = 'inline-block';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal!',
                    text: 'Gagal memuat data wali kelas',
                    confirmButtonColor: '#dc3545'
                });
                modal.hide();
            });
        });
    });

    const deleteButtons = document.querySelectorAll('.btn-delete');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const form = this.closest('.delete-form');
            const waliKelasName = this.getAttribute('data-name');
            
            Swal.fire({
                title: 'Hapus Wali Kelas?',
                html: `Apakah Anda yakin ingin menghapus<br><strong>${waliKelasName}</strong>?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#dc3545',
                cancelButtonColor: '#6c757d',
                confirmButtonText: 'Ya, Hapus!',
                cancelButtonText: 'Batal',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        title: 'Menghapus...',
                        allowOutsideClick: false,
                        didOpen: () => Swal.showLoading()
                    });
                    
                    form.submit();
                }
            });
        });
    });

    const createForm = document.getElementById('createWaliKelasForm');
    if (createForm) {
        createForm.addEventListener('submit', function(e) {
           const kodeWali = this.querySelector('input[name="kode_wali"]').value.trim();
           const namaWali = this.querySelector('input[name="nama_wali"]').value.trim();
            
            if (!kodeWali || !namaWali) {
                e.preventDefault();
                Swal.fire({
                    icon: 'warning',
                    title: 'Peringatan!',
                    text: 'Kode dan Nama Wali Kelas wajib diisi',
                    confirmButtonColor: '#0d6efd'
                });
                return false;
            }
        });
    }

    const editForm = document.getElementById('editWaliKelasForm');
    if (editForm) {
        editForm.addEventListener('submit', function(e) {
            const kodeWali = document.getElementById('edit_kode_wali').value.trim();
            const namaWali = document.getElementById('edit_nama_wali').value.trim();
            
            if (!kodeWali || !namaWali) {
                e.preventDefault();
                Swal.fire({
                    icon: 'warning',
                    title: 'Peringatan!',
                    text: 'Kode dan Nama Wali Kelas wajib diisi',
                    confirmButtonColor: '#0d6efd'
                });
                return false;
            }
        });
    }

    const createModal = document.getElementById('createWaliKelasModal');
    if (createModal) {
        createModal.addEventListener('hidden.bs.modal', function() {
            createForm.reset();
        });
    }

    const editModal = document.getElementById('editWaliKelasModal');
    if (editModal) {
        editModal.addEventListener('hidden.bs.modal', function() {
            editForm.reset();
            document.getElementById('editWaliKelasLoading').style.display = 'block';
            document.getElementById('editWaliKelasFormContent').style.display = 'none';
            document.getElementById('editWaliKelasSubmitBtn').style.display = 'none';
        });
    }

    const searchInput = document.querySelector('input[name="search"]');
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('keyup', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                if (this.value.length >= 3 || this.value.length === 0) {
                    this.closest('form').submit();
                }
            }, 500);
        });
    }

    const kodeWaliInputs = document.querySelectorAll('input[name="kode_wali"]');
    kodeWaliInputs.forEach(input => {
        input.addEventListener('input', function() {
            this.value = this.value.toUpperCase();
        });
    });
});

if (typeof Swal !== 'undefined') {
    const successMessage = document.querySelector('meta[name="success-message"]');
    if (successMessage) {
        Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: successMessage.getAttribute('content'),
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false,
            toast: true,
            position: 'top-end',
            customClass: {
                popup: 'colored-toast'
            }
        });
    }

    const errorMessage = document.querySelector('meta[name="error-message"]');
    if (errorMessage) {
        Swal.fire({
            icon: 'error',
            title: 'Gagal!',
            text: errorMessage.getAttribute('content'),
            confirmButtonColor: '#dc3545'
        });
    }
}