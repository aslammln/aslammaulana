-- =================================================================
-- SKEMA DATABASE LENGKAP SUPABASE (POSTGRESQL) - PORTOFOLIO WEBSITE
-- Sesuai Dokumen PRD (Versi 1.5)
--
-- CARA PENGGUNAAN:
-- 1. Buka Supabase Dashboard (https://supabase.com/dashboard)
-- 2. Pilih Project Anda -> Buka menu "SQL Editor"
-- 3. Tempelkan seluruh isi file ini, lalu klik tombol "RUN"
-- =================================================================

-- -----------------------------------------------------------------
-- 1. TABEL UTAMA (PORTFOLIO DATA)
-- -----------------------------------------------------------------

-- 1.1 Tabel profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name text NOT NULL,
  tagline text NOT NULL,
  description text NOT NULL,
  status text NOT NULL DEFAULT 'Terbuka untuk Kolaborasi',
  avatar_url text NOT NULL,
  resume_url text,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- 1.2 Tabel skills
CREATE TABLE IF NOT EXISTS public.skills (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name text NOT NULL,
  "order" int NOT NULL DEFAULT 1,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- 1.3 Tabel projects
CREATE TABLE IF NOT EXISTS public.projects (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title text NOT NULL,
  description text NOT NULL,
  image_url text,
  link text,
  "order" int NOT NULL DEFAULT 1,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- 1.4 Tabel experiences
CREATE TABLE IF NOT EXISTS public.experiences (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  institution text NOT NULL,
  role text NOT NULL,
  year text NOT NULL,
  location text NOT NULL,
  description text NOT NULL,
  "order" int NOT NULL DEFAULT 1,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- 1.5 Tabel courses
CREATE TABLE IF NOT EXISTS public.courses (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name text NOT NULL,
  organizer text NOT NULL,
  year text NOT NULL,
  location text NOT NULL,
  description text NOT NULL,
  "order" int NOT NULL DEFAULT 1,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- 1.6 Tabel languages
CREATE TABLE IF NOT EXISTS public.languages (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  language text NOT NULL,
  level text NOT NULL,
  "order" int NOT NULL DEFAULT 1,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- 1.7 Tabel contacts
CREATE TABLE IF NOT EXISTS public.contacts (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  platform text NOT NULL,
  value text NOT NULL,
  "order" int NOT NULL DEFAULT 1,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);


-- -----------------------------------------------------------------
-- 2. ROW LEVEL SECURITY (RLS) & POLICIES
--    - Publik (Anonim & Pengunjung): Hak Baca (SELECT) ke semua tabel
--    - Admin Terautentikasi (Authenticated): Akses Penuh (CRUD)
-- -----------------------------------------------------------------

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Kebijakan Akses Publik (Read-Only)
DROP POLICY IF EXISTS "Public read profiles" ON public.profiles;
CREATE POLICY "Public read profiles" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read skills" ON public.skills;
CREATE POLICY "Public read skills" ON public.skills FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read projects" ON public.projects;
CREATE POLICY "Public read projects" ON public.projects FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read experiences" ON public.experiences;
CREATE POLICY "Public read experiences" ON public.experiences FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read courses" ON public.courses;
CREATE POLICY "Public read courses" ON public.courses FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read languages" ON public.languages;
CREATE POLICY "Public read languages" ON public.languages FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read contacts" ON public.contacts;
CREATE POLICY "Public read contacts" ON public.contacts FOR SELECT USING (true);

-- Kebijakan Akses Admin (Authenticated Full CRUD)
DROP POLICY IF EXISTS "Authenticated users full access profiles" ON public.profiles;
CREATE POLICY "Authenticated users full access profiles" ON public.profiles FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users full access skills" ON public.skills;
CREATE POLICY "Authenticated users full access skills" ON public.skills FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users full access projects" ON public.projects;
CREATE POLICY "Authenticated users full access projects" ON public.projects FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users full access experiences" ON public.experiences;
CREATE POLICY "Authenticated users full access experiences" ON public.experiences FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users full access courses" ON public.courses;
CREATE POLICY "Authenticated users full access courses" ON public.courses FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users full access languages" ON public.languages;
CREATE POLICY "Authenticated users full access languages" ON public.languages FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users full access contacts" ON public.contacts;
CREATE POLICY "Authenticated users full access contacts" ON public.contacts FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- -----------------------------------------------------------------
-- 3. STORAGE BUCKETS (avatars & projects)
-- -----------------------------------------------------------------

-- Buat storage bucket publik jika belum ada
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true), ('projects', 'projects', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Kebijakan akses Storage: Publik boleh melihat/mengunduh
DROP POLICY IF EXISTS "Public view bucket objects" ON storage.objects;
CREATE POLICY "Public view bucket objects" ON storage.objects 
FOR SELECT 
USING (bucket_id IN ('avatars', 'projects'));

-- Kebijakan akses Storage: Admin terautentikasi boleh upload/update/delete
DROP POLICY IF EXISTS "Authenticated upload bucket objects" ON storage.objects;
CREATE POLICY "Authenticated upload bucket objects" ON storage.objects 
FOR INSERT TO authenticated 
WITH CHECK (bucket_id IN ('avatars', 'projects'));

DROP POLICY IF EXISTS "Authenticated update bucket objects" ON storage.objects;
CREATE POLICY "Authenticated update bucket objects" ON storage.objects 
FOR UPDATE TO authenticated 
USING (bucket_id IN ('avatars', 'projects'));

DROP POLICY IF EXISTS "Authenticated delete bucket objects" ON storage.objects;
CREATE POLICY "Authenticated delete bucket objects" ON storage.objects 
FOR DELETE TO authenticated 
USING (bucket_id IN ('avatars', 'projects'));


-- -----------------------------------------------------------------
-- 4. DATA AWAL (SEED DATA DEFAULT)
-- -----------------------------------------------------------------

-- Profile default
INSERT INTO public.profiles (id, name, tagline, description, status, avatar_url, resume_url)
VALUES (
  'prof-1',
  'Rania Aulia',
  'Creative Professional & Content Strategist',
  'Saya memiliki pengalaman dalam pengelolaan konten, desain grafis, dan komunikasi visual. Berfokus pada menciptakan karya yang berdampak dan bermakna.',
  'Terbuka untuk Kolaborasi',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
  'https://drive.google.com/file/d/sample-resume/view'
) ON CONFLICT (id) DO NOTHING;

-- Skills default
INSERT INTO public.skills (id, name, "order") VALUES
  ('sk-1', 'Canva', 1),
  ('sk-2', 'Adobe Illustrator', 2),
  ('sk-3', 'Microsoft Word', 3),
  ('sk-4', 'Microsoft Excel', 4),
  ('sk-5', 'Copywriting', 5),
  ('sk-6', 'Manajemen Media Sosial', 6),
  ('sk-7', 'Komunikasi Publik', 7),
  ('sk-8', 'Riset Konten', 8)
ON CONFLICT (id) DO NOTHING;

-- Projects default
INSERT INTO public.projects (id, title, description, image_url, link, "order") VALUES
  ('proj-1', 'Kampanye Visual UMKM Lokal', 'Desain materi promosi, banner digital, dan visual storytelling untuk 5 UMKM kuliner di Medan yang berhasil mendongkrak penjualan sebesar 30%.', 'https://images.unsplash.com/photo-1542744094-3a31f272c490?q=80&w=800&auto=format&fit=crop', 'https://drive.google.com/drive/folders/sample-umkm', 1),
  ('proj-2', 'Newsletter Bulanan Komunitas', 'Pengelolaan konten editorial dan perancangan desain tata letak newsletter berkala untuk 500+ pembaca aktif.', 'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?q=80&w=800&auto=format&fit=crop', 'https://drive.google.com/drive/folders/sample-newsletter', 2),
  ('proj-3', 'Brand Identity & Media Kit', 'Perancangan identitas visual lengkap mencakup palet warna, tipografi, template media sosial, dan materi cetak profesional.', 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=800&auto=format&fit=crop', 'https://drive.google.com/drive/folders/sample-brand', 3)
ON CONFLICT (id) DO NOTHING;

-- Experiences default
INSERT INTO public.experiences (id, institution, role, year, location, description, "order") VALUES
  ('exp-1', 'PT Kreasi Digital Nusantara', 'Content Creator Intern', '2023 – 2024', 'Medan', 'Merancang strategi konten editorial mingguan, memproduksi materi grafis, serta meningkatkan engagement akun media sosial sebesar 45%.', 1),
  ('exp-2', 'Himpunan Mahasiswa Komunikasi', 'Koordinator Acara', '2022 – 2023', 'Medan', 'Memimpin divisi kepanitiaan dalam menyelenggarakan seminar komunikasi nasional dengan 300+ peserta.', 2)
ON CONFLICT (id) DO NOTHING;

-- Courses default
INSERT INTO public.courses (id, name, organizer, year, location, description, "order") VALUES
  ('crs-1', 'Digital Content Masterclass', 'Rakamin Academy', '2023', 'Online', 'Pelatihan intensif strategi storytelling digital, analisis performa konten, dan optimasi visual untuk berbagai kanal media sosial.', 1),
  ('crs-2', 'Workshop Desain Visual Praktis', 'Kemenparekraf & Studio Kreatif', '2022', 'Medan', 'Pendalaman prinsip tata letak visual, tipografi, dan komposisi warna untuk kampanye promosi dan periklanan.', 2)
ON CONFLICT (id) DO NOTHING;

-- Languages default
INSERT INTO public.languages (id, language, level, "order") VALUES
  ('lang-1', 'Bahasa Indonesia', 'Native', 1),
  ('lang-2', 'Bahasa Inggris', 'Intermediate', 2),
  ('lang-3', 'Bahasa Mandarin', 'Beginner', 3)
ON CONFLICT (id) DO NOTHING;

-- Contacts default
INSERT INTO public.contacts (id, platform, value, "order") VALUES
  ('cnt-1', 'WhatsApp', 'https://wa.me/6281234567890', 1),
  ('cnt-2', 'Email', 'mailto:rania.aulia.creative@gmail.com', 2),
  ('cnt-3', 'Instagram', 'https://instagram.com/rania.creative', 3),
  ('cnt-4', 'LinkedIn', 'https://linkedin.com/in/rania-aulia', 4)
ON CONFLICT (id) DO NOTHING;
