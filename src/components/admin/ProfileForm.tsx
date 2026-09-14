import React, { useState } from 'react';
import { Save, CheckCircle2, User } from 'lucide-react';
import { Profile } from '../../types';
import { ImageUploader } from './ImageUploader';

interface ProfileFormProps {
  profile: Profile;
  onSave: (updated: Partial<Profile>) => Promise<void>;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ profile, onSave }) => {
  const [formData, setFormData] = useState<Profile>({ ...profile });
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(formData);
      setSuccessMessage(true);
      setTimeout(() => setSuccessMessage(false), 3500);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
        <div>
          <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Informasi Profil Pribadi
          </h3>
          <p className="text-xs sm:text-sm text-neutral-500">
            Kelola nama, jabatan, deskripsi, status ketersediaan, foto, dan resume
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors shadow-xs disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Menyimpan...' : 'Simpan Profil'}</span>
        </button>
      </div>

      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Profil berhasil disimpan dan diperbarui!</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nama Lengkap */}
        <div>
          <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
            Nama Lengkap
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Contoh: Rania Aulia"
            className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>

        {/* Jabatan / Tagline */}
        <div>
          <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
            Jabatan / Tagline
          </label>
          <input
            type="text"
            required
            value={formData.tagline}
            onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
            placeholder="Contoh: Creative Professional & Content Strategist"
            className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>

        {/* Status Ketersediaan */}
        <div>
          <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
            Label Status
          </label>
          <input
            type="text"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            placeholder="Contoh: Terbuka untuk Kolaborasi"
            className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          <p className="text-xs text-neutral-400 mt-1">
            Ditampilkan di bawah foto profil dengan indikator status aktif
          </p>
        </div>

        {/* URL Resume / Google Drive */}
        <div>
          <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
            URL Resume (Google Drive)
          </label>
          <input
            type="url"
            value={formData.resume_url || ''}
            onChange={(e) => setFormData({ ...formData, resume_url: e.target.value || null })}
            placeholder="https://drive.google.com/..."
            className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          <p className="text-xs text-neutral-400 mt-1">
            Jika dikosongkan, tombol "Resume" tidak akan ditampilkan di halaman publik
          </p>
        </div>
      </div>

      {/* Deskripsi Singkat */}
      <div>
        <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
          Deskripsi Singkat Profil
        </label>
        <textarea
          rows={3}
          required
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Tuliskan ringkasan latar belakang, minat, dan spesialisasi Anda..."
          className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm leading-relaxed"
        />
      </div>

      {/* Foto Profil (Image Uploader) */}
      <div className="pt-2">
        <ImageUploader
          label="Foto Profil (Rasio 1:1, Bucket avatars)"
          bucket="avatars"
          currentUrl={formData.avatar_url}
          aspectRatio="square"
          onImageSelected={(url) => setFormData({ ...formData, avatar_url: url })}
        />
      </div>
    </form>
  );
};
