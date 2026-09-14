import React, { useState } from 'react';
import { Database, Check, Copy, AlertCircle, RefreshCw } from 'lucide-react';
import { isSupabaseConfigured } from '../../lib/supabase';

export const SupabaseSetupGuide: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const sqlSchema = `-- ==========================================
-- PRD Schema Portfolio Website (Supabase SQL)
-- Jalankan script ini di Supabase SQL Editor
-- ==========================================

-- 1. Tabel profiles
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

-- 2. Tabel skills
CREATE TABLE IF NOT EXISTS public.skills (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name text NOT NULL,
  "order" int NOT NULL DEFAULT 1,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- 3. Tabel projects
CREATE TABLE IF NOT EXISTS public.projects (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title text NOT NULL,
  description text NOT NULL,
  image_url text,
  link text,
  "order" int NOT NULL DEFAULT 1,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- 4. Tabel experiences
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

-- 5. Tabel courses
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

-- 6. Tabel languages
CREATE TABLE IF NOT EXISTS public.languages (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  language text NOT NULL,
  level text NOT NULL,
  "order" int NOT NULL DEFAULT 1,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- 7. Tabel contacts
CREATE TABLE IF NOT EXISTS public.contacts (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  platform text NOT NULL,
  value text NOT NULL,
  "order" int NOT NULL DEFAULT 1,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS) & Public Read Access
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public read skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Public read projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Public read experiences" ON public.experiences FOR SELECT USING (true);
CREATE POLICY "Public read courses" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Public read languages" ON public.languages FOR SELECT USING (true);
CREATE POLICY "Public read contacts" ON public.contacts FOR SELECT USING (true);

-- Admin CRUD Access
CREATE POLICY "Authenticated users full access profiles" ON public.profiles FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users full access skills" ON public.skills FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users full access projects" ON public.projects FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users full access experiences" ON public.experiences FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users full access courses" ON public.courses FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users full access languages" ON public.languages FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users full access contacts" ON public.contacts FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Storage Buckets: avatars & projects
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true), ('projects', 'projects', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Policies
DROP POLICY IF EXISTS "Public view bucket objects" ON storage.objects;
CREATE POLICY "Public view bucket objects" ON storage.objects FOR SELECT USING (bucket_id IN ('avatars', 'projects'));

DROP POLICY IF EXISTS "Authenticated upload bucket objects" ON storage.objects;
CREATE POLICY "Authenticated upload bucket objects" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id IN ('avatars', 'projects'));

DROP POLICY IF EXISTS "Authenticated update bucket objects" ON storage.objects;
CREATE POLICY "Authenticated update bucket objects" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id IN ('avatars', 'projects'));

DROP POLICY IF EXISTS "Authenticated delete bucket objects" ON storage.objects;
CREATE POLICY "Authenticated delete bucket objects" ON storage.objects FOR DELETE TO authenticated USING (bucket_id IN ('avatars', 'projects'));

-- Seed Data Default (Rania Aulia)
INSERT INTO public.profiles (id, name, tagline, description, status, avatar_url, resume_url)
VALUES ('prof-1', 'Rania Aulia', 'Creative Professional & Content Strategist', 'Saya memiliki pengalaman dalam pengelolaan konten, desain grafis, dan komunikasi visual. Berfokus pada menciptakan karya yang berdampak dan bermakna.', 'Terbuka untuk Kolaborasi', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop', 'https://drive.google.com/file/d/sample-resume/view')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.skills (id, name, "order") VALUES
  ('sk-1', 'Canva', 1), ('sk-2', 'Adobe Illustrator', 2), ('sk-3', 'Microsoft Word', 3), ('sk-4', 'Microsoft Excel', 4),
  ('sk-5', 'Copywriting', 5), ('sk-6', 'Manajemen Media Sosial', 6), ('sk-7', 'Komunikasi Publik', 7), ('sk-8', 'Riset Konten', 8)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.projects (id, title, description, image_url, link, "order") VALUES
  ('proj-1', 'Kampanye Visual UMKM Lokal', 'Desain materi promosi, banner digital, dan visual storytelling untuk 5 UMKM kuliner di Medan yang berhasil mendongkrak penjualan sebesar 30%.', 'https://images.unsplash.com/photo-1542744094-3a31f272c490?q=80&w=800&auto=format&fit=crop', 'https://drive.google.com/drive/folders/sample-umkm', 1),
  ('proj-2', 'Newsletter Bulanan Komunitas', 'Pengelolaan konten editorial dan perancangan desain tata letak newsletter berkala untuk 500+ pembaca aktif.', 'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?q=80&w=800&auto=format&fit=crop', 'https://drive.google.com/drive/folders/sample-newsletter', 2),
  ('proj-3', 'Brand Identity & Media Kit', 'Perancangan identitas visual lengkap mencakup palet warna, tipografi, template media sosial, dan materi cetak profesional.', 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=800&auto=format&fit=crop', 'https://drive.google.com/drive/folders/sample-brand', 3)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.experiences (id, institution, role, year, location, description, "order") VALUES
  ('exp-1', 'PT Kreasi Digital Nusantara', 'Content Creator Intern', '2023 – 2024', 'Medan', 'Merancang strategi konten editorial mingguan, memproduksi materi grafis, serta meningkatkan engagement akun media sosial sebesar 45%.', 1),
  ('exp-2', 'Himpunan Mahasiswa Komunikasi', 'Koordinator Acara', '2022 – 2023', 'Medan', 'Memimpin divisi kepanitiaan dalam menyelenggarakan seminar komunikasi nasional dengan 300+ peserta.', 2)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.courses (id, name, organizer, year, location, description, "order") VALUES
  ('crs-1', 'Digital Content Masterclass', 'Rakamin Academy', '2023', 'Online', 'Pelatihan intensif strategi storytelling digital, analisis performa konten, dan optimasi visual untuk berbagai kanal media sosial.', 1),
  ('crs-2', 'Workshop Desain Visual Praktis', 'Kemenparekraf & Studio Kreatif', '2022', 'Medan', 'Pendalaman prinsip tata letak visual, tipografi, dan komposisi warna untuk kampanye promosi dan periklanan.', 2)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.languages (id, language, level, "order") VALUES
  ('lang-1', 'Bahasa Indonesia', 'Native', 1), ('lang-2', 'Bahasa Inggris', 'Intermediate', 2), ('lang-3', 'Bahasa Mandarin', 'Beginner', 3)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.contacts (id, platform, value, "order") VALUES
  ('cnt-1', 'WhatsApp', 'https://wa.me/6281234567890', 1), ('cnt-2', 'Email', 'mailto:rania.aulia.creative@gmail.com', 2),
  ('cnt-3', 'Instagram', 'https://instagram.com/rania.creative', 3), ('cnt-4', 'LinkedIn', 'https://linkedin.com/in/rania-aulia', 4)
ON CONFLICT (id) DO NOTHING;
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sqlSchema);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-neutral-200">
        <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
          <Database className="w-5 h-5 text-blue-600" />
          Status Database & Konfigurasi Supabase
        </h3>
        <p className="text-xs sm:text-sm text-neutral-500">
          Panduan integrasi Supabase PostgreSQL, Authentication, dan Supabase Storage sesuai PRD
        </p>
      </div>

      {/* Status Card */}
      <div
        className={`p-4 sm:p-5 rounded-2xl border ${
          isSupabaseConfigured
            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
            : 'bg-blue-50/60 border-blue-200 text-blue-900'
        }`}
      >
        <div className="flex items-start gap-3">
          {isSupabaseConfigured ? (
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-700">
              <Check className="w-5 h-5" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 text-blue-700">
              <AlertCircle className="w-5 h-5" />
            </div>
          )}

          <div className="flex-1">
            <h4 className="font-bold text-sm sm:text-base">
              {isSupabaseConfigured
                ? 'Supabase Terhubung!'
                : 'Mode Penyimpanan Lokal Aktif (Data Tersimpan di Browser)'}
            </h4>
            <p className="text-xs sm:text-sm mt-1 leading-relaxed opacity-90">
              {isSupabaseConfigured
                ? 'Aplikasi telah membaca environment variable Supabase URL dan Anon Key. Data dan gambar disinkronkan ke Supabase cloud.'
                : 'Aplikasi saat ini berjalan menggunakan penyimpanan lokal browser (localStorage). Semua fitur CRUD, upload foto, dan perubahan portofolio bekerja 100% instan dan tersimpan. Anda dapat menghubungkan Supabase kapan saja.'}
            </p>
          </div>
        </div>
      </div>

      {/* SQL Script Box */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">
            Script SQL Supabase (Sesuai Schema PRD Bagian 5 & 6)
          </label>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Salin SQL Schema</span>
              </>
            )}
          </button>
        </div>

        <pre className="p-4 rounded-xl bg-neutral-900 text-neutral-100 text-xs font-mono overflow-x-auto max-h-72 leading-relaxed border border-neutral-800">
          {sqlSchema}
        </pre>
      </div>

      {/* Panduan Konfigurasi .env */}
      <div className="p-4 sm:p-5 rounded-2xl border border-neutral-200 bg-white space-y-3">
        <h4 className="text-xs font-semibold text-neutral-800 uppercase tracking-wider">
          Konfigurasi File Environment (.env)
        </h4>
        <p className="text-xs text-neutral-600 leading-relaxed">
          File <code className="bg-neutral-100 text-neutral-800 px-1.5 py-0.5 rounded font-mono">/.env</code> telah disiapkan di root proyek. Buka Supabase Dashboard &gt; <strong>Project Settings</strong> &gt; <strong>API</strong>, lalu isi variabel berikut:
        </p>
        <pre className="p-3.5 rounded-xl bg-neutral-900 text-neutral-100 text-xs font-mono overflow-x-auto leading-relaxed border border-neutral-800">
{`# File: .env
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=ey... (opsional)
CRON_SECRET=rahasia-cron-keepalive (opsional)`}
        </pre>
        <p className="text-2xs text-neutral-500">
          Catatan: Setelah memperbarui file <code>.env</code>, dev server akan memuat variabel lingkungan secara otomatis.
        </p>
      </div>

      {/* Keepalive Notice */}
      <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 text-xs text-neutral-600 space-y-1.5">
        <div className="font-semibold text-neutral-800 flex items-center gap-1.5">
          <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
          Keep-Alive Cron Endpoint (PRD Bagian 9)
        </div>
        <p>
          Tersedia konfigurasi <code className="bg-white px-1.5 py-0.5 rounded border border-neutral-200">vercel.json</code> dengan jadwal harian pukul 08:00 WIB (01:00 UTC) untuk mencegah Supabase free-tier terjeda otomatis.
        </p>
      </div>
    </div>
  );
};
