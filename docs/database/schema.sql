-- =============================================================================
-- Database Schema — Website Profil SMPN 3 Manado
-- Project: Profile_School_rpl
-- Database: PostgreSQL (Supabase)
-- =============================================================================
--
-- Cara pakai:
--   1. Buat project di Supabase (https://supabase.com)
--   2. Buka SQL Editor di dashboard Supabase
--   3. Jalankan script ini secara berurutan (atau Run All)
--
-- Catatan:
--   - Urutan CREATE TABLE disusun agar foreign key valid
--   - Sesuaikan dengan environment production sebelum deploy
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. admin — Akun administrator website
-- -----------------------------------------------------------------------------
CREATE TABLE public.admin (
  id_admin integer NOT NULL DEFAULT nextval('admin_id_admin_seq'::regclass),
  username character varying NOT NULL UNIQUE,
  password_hash character varying NOT NULL,
  nama_lengkap character varying NOT NULL,
  email character varying,
  created_at timestamp with time zone DEFAULT now(),
  reset_password_token character varying,
  reset_password_expires timestamp without time zone,
  CONSTRAINT admin_pkey PRIMARY KEY (id_admin)
);

COMMENT ON TABLE public.admin IS 'Data akun admin untuk login panel admin';

-- -----------------------------------------------------------------------------
-- 2. pengunjung — Statistik kunjungan harian website
-- -----------------------------------------------------------------------------
CREATE TABLE public.pengunjung (
  id integer NOT NULL DEFAULT nextval('pengunjung_id_seq'::regclass),
  tanggal date NOT NULL DEFAULT CURRENT_DATE UNIQUE,
  jumlah integer NOT NULL DEFAULT 0,
  CONSTRAINT pengunjung_pkey PRIMARY KEY (id)
);

COMMENT ON TABLE public.pengunjung IS 'Pencatatan jumlah pengunjung per hari';

-- -----------------------------------------------------------------------------
-- 3. pesan_kontak — Kotak saran / pesan dari pengunjung
-- -----------------------------------------------------------------------------
CREATE TABLE public.pesan_kontak (
  id_pesan integer NOT NULL DEFAULT nextval('pesan_kontak_id_pesan_seq'::regclass),
  nama_pengirim character varying NOT NULL,
  email_pengirim character varying NOT NULL,
  isi_pesan text NOT NULL,
  tanggal_kirim timestamp with time zone DEFAULT now(),
  is_read boolean DEFAULT false,
  balasan_admin text,
  tanggal_balas timestamp with time zone,
  CONSTRAINT pesan_kontak_pkey PRIMARY KEY (id_pesan)
);

COMMENT ON TABLE public.pesan_kontak IS 'Pesan masuk dari formulir kotak saran publik';

-- -----------------------------------------------------------------------------
-- 4. profil_sekolah — Informasi identitas & profil sekolah
-- -----------------------------------------------------------------------------
CREATE TABLE public.profil_sekolah (
  id_profil integer NOT NULL DEFAULT nextval('profil_sekolah_id_profil_seq'::regclass),
  nama_sekolah character varying NOT NULL,
  npsn character varying,
  no_telepon character varying,
  email_sekolah character varying,
  alamat text,
  visi text,
  misi text,
  sejarah text,
  logo_url text,
  updated_at timestamp with time zone DEFAULT now(),
  id_admin integer,
  jumlah_siswa integer DEFAULT 0,
  akreditas character varying,
  sambutan_kepsek text,
  jumlah_guru integer DEFAULT 0,
  jumlah_kelas integer DEFAULT 0,
  kurikulum_url text,
  deskripsi_kurikulum text,
  sertifikat_akreditasi_url text,
  deskripsi_akreditasi text,
  CONSTRAINT profil_sekolah_pkey PRIMARY KEY (id_profil),
  CONSTRAINT fk_admin_profil FOREIGN KEY (id_admin) REFERENCES public.admin(id_admin)
);

COMMENT ON TABLE public.profil_sekolah IS 'Data profil, visi-misi, statistik, dan dokumen sekolah';

-- -----------------------------------------------------------------------------
-- 5. berita_pengumuman — Berita & pengumuman sekolah
-- -----------------------------------------------------------------------------
CREATE TABLE public.berita_pengumuman (
  id_berita integer NOT NULL DEFAULT nextval('berita_pengumuman_id_berita_seq'::regclass),
  kategori character varying NOT NULL,
  judul character varying NOT NULL,
  isi_konten text NOT NULL,
  gambar_url text,
  tgl_publikasi timestamp with time zone DEFAULT now(),
  id_admin integer,
  status character varying DEFAULT 'active'::character varying,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT berita_pengumuman_pkey PRIMARY KEY (id_berita),
  CONSTRAINT fk_admin_berita FOREIGN KEY (id_admin) REFERENCES public.admin(id_admin)
);

COMMENT ON TABLE public.berita_pengumuman IS 'Konten berita dan pengumuman sekolah';

-- -----------------------------------------------------------------------------
-- 6. faq — Pertanyaan yang sering diajukan
-- -----------------------------------------------------------------------------
CREATE TABLE public.faq (
  id_faq integer NOT NULL DEFAULT nextval('faq_id_faq_seq'::regclass),
  pertanyaan text NOT NULL,
  jawaban text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  id_admin integer,
  kategori character varying NOT NULL DEFAULT 'Umum'::character varying,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT faq_pkey PRIMARY KEY (id_faq),
  CONSTRAINT fk_admin_faq FOREIGN KEY (id_admin) REFERENCES public.admin(id_admin)
);

COMMENT ON TABLE public.faq IS 'FAQ untuk halaman publik';

-- -----------------------------------------------------------------------------
-- 7. galeri — Foto kegiatan sekolah
-- -----------------------------------------------------------------------------
CREATE TABLE public.galeri (
  id_galeri integer NOT NULL DEFAULT nextval('galeri_id_galeri_seq'::regclass),
  judul_foto character varying,
  deskripsi text,
  file_url character varying NOT NULL,
  tgl_upload timestamp with time zone DEFAULT now(),
  id_admin integer,
  kategori character varying NOT NULL DEFAULT 'umum'::character varying
    CHECK (kategori::text = ANY (ARRAY['umum'::character varying, 'fasilitas'::character varying, 'ekskul'::character varying]::text[])),
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT galeri_pkey PRIMARY KEY (id_galeri),
  CONSTRAINT fk_admin_galeri FOREIGN KEY (id_admin) REFERENCES public.admin(id_admin)
);

COMMENT ON TABLE public.galeri IS 'Galeri foto — kategori: umum, fasilitas, ekskul';

-- -----------------------------------------------------------------------------
-- 8. guru_staf — Direktori guru & staf
-- -----------------------------------------------------------------------------
CREATE TABLE public.guru_staf (
  id_guru integer NOT NULL DEFAULT nextval('guru_staf_id_guru_seq'::regclass),
  nama_lengkap character varying NOT NULL,
  nip character varying,
  jabatan character varying NOT NULL,
  mata_pelajaran character varying,
  foto_url text,
  created_at timestamp with time zone DEFAULT now(),
  id_admin integer,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  status character varying DEFAULT 'aktif'::character varying,
  CONSTRAINT guru_staf_pkey PRIMARY KEY (id_guru),
  CONSTRAINT fk_admin_guru FOREIGN KEY (id_admin) REFERENCES public.admin(id_admin)
);

COMMENT ON TABLE public.guru_staf IS 'Data guru dan staf sekolah';

-- -----------------------------------------------------------------------------
-- 9. prestasi — Prestasi siswa / sekolah
-- -----------------------------------------------------------------------------
CREATE TABLE public.prestasi (
  id_prestasi integer NOT NULL DEFAULT nextval('prestasi_id_prestasi_seq'::regclass),
  nama_lomba character varying NOT NULL,
  nama_pemenang character varying NOT NULL,
  tingkat character varying,
  tahun_meraih integer NOT NULL,
  foto_url text,
  created_at timestamp with time zone DEFAULT now(),
  id_admin integer,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT prestasi_pkey PRIMARY KEY (id_prestasi),
  CONSTRAINT fk_admin_prestasi FOREIGN KEY (id_admin) REFERENCES public.admin(id_admin)
);

COMMENT ON TABLE public.prestasi IS 'Data prestasi lomba dan kompetisi';

-- -----------------------------------------------------------------------------
-- 10. timeline_ppdb — Jadwal & timeline PPDB
-- -----------------------------------------------------------------------------
CREATE TABLE public.timeline_ppdb (
  id_timeline integer NOT NULL DEFAULT nextval('timeline_ppdb_id_timeline_seq'::regclass),
  judul character varying NOT NULL,
  tanggal_mulai date NOT NULL,
  tanggal_selesai date NOT NULL,
  deskripsi text,
  id_admin integer,
  status character varying DEFAULT 'akan_datang'::character varying
    CHECK (status::text = ANY (ARRAY['akan_datang'::character varying, 'berlangsung'::character varying, 'selesai'::character varying]::text[])),
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT timeline_ppdb_pkey PRIMARY KEY (id_timeline),
  CONSTRAINT fk_admin FOREIGN KEY (id_admin) REFERENCES public.admin(id_admin)
);

COMMENT ON TABLE public.timeline_ppdb IS 'Timeline jadwal PPDB — status: akan_datang, berlangsung, selesai';

-- =============================================================================
-- Ringkasan Relasi
-- =============================================================================
--
--  admin (1) ──< profil_sekolah
--  admin (1) ──< berita_pengumuman
--  admin (1) ──< faq
--  admin (1) ──< galeri
--  admin (1) ──< guru_staf
--  admin (1) ──< prestasi
--  admin (1) ──< timeline_ppdb
--
--  pengunjung      → mandiri (tanpa FK)
--  pesan_kontak    → mandiri (tanpa FK)
-- =============================================================================
