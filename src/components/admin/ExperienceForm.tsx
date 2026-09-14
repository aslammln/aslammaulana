import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Briefcase, X, Check } from 'lucide-react';
import { Experience } from '../../types';

interface ExperienceFormProps {
  experiences: Experience[];
  onSaveExperience: (experience: Experience) => Promise<void>;
  onDeleteExperience: (id: string) => Promise<void>;
}

export const ExperienceForm: React.FC<ExperienceFormProps> = ({
  experiences,
  onSaveExperience,
  onDeleteExperience,
}) => {
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleStartAdd = () => {
    setIsNew(true);
    setEditingExp({
      id: `exp-${Date.now()}`,
      institution: '',
      role: '',
      year: '',
      location: '',
      description: '',
      order: experiences.length + 1,
    });
  };

  const handleStartEdit = (exp: Experience) => {
    setIsNew(false);
    setEditingExp({ ...exp });
  };

  const handleCancel = () => {
    setEditingExp(null);
    setIsNew(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExp) return;
    setSaving(true);
    try {
      await onSaveExperience(editingExp);
      setEditingExp(null);
      setIsNew(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-600" />
            Manajemen Pengalaman Kerja
          </h3>
          <p className="text-xs sm:text-sm text-neutral-500">
            Kelola rekam jejak karier, nama instansi, posisi, rentang tahun, dan uraian tugas
          </p>
        </div>

        <button
          onClick={handleStartAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pengalaman</span>
        </button>
      </div>

      {editingExp && (
        <div className="bg-neutral-50 border border-neutral-200/90 rounded-2xl p-5 sm:p-6 mb-6">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-200">
            <h4 className="text-base font-bold text-neutral-900">
              {isNew ? 'Tambah Pengalaman Baru' : 'Edit Pengalaman'}
            </h4>
            <button
              onClick={handleCancel}
              className="p-1 rounded-lg text-neutral-400 hover:text-neutral-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Jabatan / Posisi (Role)
                </label>
                <input
                  type="text"
                  required
                  value={editingExp.role}
                  onChange={(e) => setEditingExp({ ...editingExp, role: e.target.value })}
                  placeholder="Contoh: Content Creator Intern"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Nama Instansi / Perusahaan
                </label>
                <input
                  type="text"
                  required
                  value={editingExp.institution}
                  onChange={(e) => setEditingExp({ ...editingExp, institution: e.target.value })}
                  placeholder="Contoh: PT Kreasi Digital Nusantara"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Tahun / Periode
                </label>
                <input
                  type="text"
                  required
                  value={editingExp.year}
                  onChange={(e) => setEditingExp({ ...editingExp, year: e.target.value })}
                  placeholder="Contoh: 2023 – 2024"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                    Lokasi
                  </label>
                  <input
                    type="text"
                    required
                    value={editingExp.location}
                    onChange={(e) => setEditingExp({ ...editingExp, location: e.target.value })}
                    placeholder="Contoh: Medan / Remote"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                    Urutan
                  </label>
                  <input
                    type="number"
                    value={editingExp.order}
                    onChange={(e) => setEditingExp({ ...editingExp, order: parseInt(e.target.value) || 1 })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                Deskripsi Singkat & Tanggung Jawab
              </label>
              <textarea
                rows={3}
                required
                value={editingExp.description}
                onChange={(e) => setEditingExp({ ...editingExp, description: e.target.value })}
                placeholder="Uraikan pencapaian dan tanggung jawab utama Anda..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-200/50 rounded-xl"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-xs disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                <span>{saving ? 'Menyimpan...' : 'Simpan'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-neutral-200 bg-white shadow-xs gap-3 hover:border-blue-200 transition-colors"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-neutral-900 text-base">{exp.role}</span>
                <span className="text-neutral-400">at</span>
                <span className="font-semibold text-blue-600">{exp.institution}</span>
              </div>
              <div className="text-xs text-neutral-500">
                {exp.year} • {exp.location}
              </div>
              <p className="text-xs text-neutral-600 line-clamp-2 max-w-2xl mt-1">
                {exp.description}
              </p>
            </div>

            <div className="flex items-center gap-1 shrink-0 self-end sm:self-center">
              <button
                onClick={() => handleStartEdit(exp)}
                className="p-1.5 rounded-lg text-neutral-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                title="Edit"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  if (confirm(`Hapus pengalaman "${exp.role} - ${exp.institution}"?`)) {
                    onDeleteExperience(exp.id);
                  }
                }}
                className="p-1.5 rounded-lg text-neutral-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Hapus"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
