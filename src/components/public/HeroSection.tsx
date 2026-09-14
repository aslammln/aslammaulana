import React from 'react';
import { ExternalLink, ArrowDown, Send } from 'lucide-react';
import { Profile } from '../../types';

interface HeroSectionProps {
  profile: Profile;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ profile }) => {
  // Split name for visual highlight: highlight first or main part in blue
  const nameParts = profile.name.trim().split(' ');
  const firstName = nameParts[0] || '';
  const remainingName = nameParts.slice(1).join(' ');

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="beranda" className="pt-28 pb-16 md:py-24 border-b border-neutral-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 lg:gap-16">
          
          {/* Kolom Kiri: Foto Profil (1:1, rounded-2xl) & Label Status */}
          <div className="flex flex-col items-center md:items-start shrink-0">
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-2xl overflow-hidden shadow-md border border-neutral-200/80 bg-neutral-100">
              <img
                src={profile.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop'}
                alt={profile.name}
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Label Status Kecil di Bawah Foto Profil */}
            {profile.status && (
              <div className="mt-3.5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/70 text-xs font-medium text-emerald-800">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                </span>
                <span>{profile.status}</span>
              </div>
            )}
          </div>

          {/* Kolom Kanan: Konten Teks & Tombol Aksi */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left flex-1">
            {/* Badge Kecil "Portofolio Profesional" */}
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-medium mb-3">
              Portofolio Profesional
            </div>

            {/* Nama Besar, bagian nama utama berwarna biru */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 mb-2.5">
              <span className="text-blue-600">{firstName}</span> {remainingName}
            </h1>

            {/* Tagline / Jabatan */}
            <h2 className="text-lg sm:text-xl font-medium text-neutral-700 mb-4">
              {profile.tagline}
            </h2>

            {/* Deskripsi Singkat */}
            <p className="text-base sm:text-lg text-neutral-600 max-w-2xl leading-relaxed mb-8">
              {profile.description}
            </p>

            {/* Tombol Aksi */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              {/* Tombol "Hubungi Saya" — primary, latar biru, teks putih */}
              <button
                id="btn-hubungi-saya"
                onClick={() => handleScrollTo('kontak')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <Send className="w-4 h-4" />
                <span>Hubungi Saya</span>
              </button>

              {/* Tombol "Lihat Project" — secondary / outline */}
              <button
                id="btn-lihat-project"
                onClick={() => handleScrollTo('project')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-neutral-300 hover:bg-neutral-50 text-neutral-800 font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2"
              >
                <ArrowDown className="w-4 h-4" />
                <span>Lihat Project</span>
              </button>

              {/* Tombol "Resume" — muncul hanya jika resume_url tidak kosong */}
              {profile.resume_url && profile.resume_url.trim() !== '' && (
                <a
                  id="btn-resume-drive"
                  href={profile.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-50 text-blue-700 font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Resume</span>
                </a>
              )}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
