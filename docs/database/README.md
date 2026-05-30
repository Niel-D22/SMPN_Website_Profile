# Database Schema

Skema database PostgreSQL untuk project **Profile_School_rpl** (Website Profil SMPN 3 Manado).

## File

| File | Keterangan |
| :--- | :--------- |
| [`schema.sql`](./schema.sql) | Definisi semua tabel database |

## Tabel

| Tabel | Fungsi |
| :---- | :----- |
| `admin` | Akun administrator (login panel admin) |
| `pengunjung` | Statistik kunjungan website per hari |
| `pesan_kontak` | Pesan dari kotak saran pengunjung |
| `profil_sekolah` | Profil, visi-misi, statistik, dokumen sekolah |
| `berita_pengumuman` | Berita dan pengumuman |
| `faq` | Pertanyaan yang sering diajukan |
| `galeri` | Foto galeri (umum, fasilitas, ekskul) |
| `guru_staf` | Direktori guru dan staf |
| `prestasi` | Data prestasi siswa/sekolah |
| `timeline_ppdb` | Jadwal timeline PPDB |

## Cara Menjalankan di Supabase

1. Login ke [Supabase Dashboard](https://supabase.com/dashboard)
2. Pilih project Anda
3. Buka menu **SQL Editor**
4. Salin isi `schema.sql` dan jalankan

> Jika database sudah berisi tabel yang sama, jangan jalankan ulang tanpa backup — gunakan **migrations** atau sesuaikan manual agar tidak bentrok.

## Koneksi dari Backend

Backend project memakai connection string PostgreSQL melalui variabel `DATABASE_URL` di `BE/.env`.  
Lihat panduan lengkap di [README utama](../../README.md#-konfigurasi-environment-variable).
