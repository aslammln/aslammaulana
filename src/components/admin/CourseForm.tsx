import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Award, X, Check } from 'lucide-react';
import { Course } from '../../types';

interface CourseFormProps {
  courses: Course[];
  onSaveCourse: (course: Course) => Promise<void>;
  onDeleteCourse: (id: string) => Promise<void>;
}

export const CourseForm: React.FC<CourseFormProps> = ({
  courses,
  onSaveCourse,
  onDeleteCourse,
}) => {
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleStartAdd = () => {
    setIsNew(true);
    setEditingCourse({
      id: `crs-${Date.now()}`,
      name: '',
      organizer: '',
      year: '',
      location: '',
      description: '',
      order: courses.length + 1,
    });
  };

  const handleStartEdit = (course: Course) => {
    setIsNew(false);
    setEditingCourse({ ...course });
  };

  const handleCancel = () => {
    setEditingCourse(null);
    setIsNew(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;
    setSaving(true);
    try {
      await onSaveCourse(editingCourse);
      setEditingCourse(null);
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
            <Award className="w-5 h-5 text-blue-600" />
            Manajemen Pelatihan & Kursus
          </h3>
          <p className="text-xs sm:text-sm text-neutral-500">
            Kelola daftar sertifikasi, lokakarya, dan kursus pengembangan profesional
          </p>
        </div>

        <button
          onClick={handleStartAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pelatihan</span>
        </button>
      </div>

      {editingCourse && (
        <div className="bg-neutral-50 border border-neutral-200/90 rounded-2xl p-5 sm:p-6 mb-6">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-200">
            <h4 className="text-base font-bold text-neutral-900">
              {isNew ? 'Tambah Pelatihan Baru' : 'Edit Pelatihan'}
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
                  Nama Kursus / Pelatihan
                </label>
                <input
                  type="text"
                  required
                  value={editingCourse.name}
                  onChange={(e) => setEditingCourse({ ...editingCourse, name: e.target.value })}
                  placeholder="Contoh: Digital Content Masterclass"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Penyelenggara
                </label>
                <input
                  type="text"
                  required
                  value={editingCourse.organizer}
                  onChange={(e) => setEditingCourse({ ...editingCourse, organizer: e.target.value })}
                  placeholder="Contoh: Rakamin Academy / Google"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Tahun
                </label>
                <input
                  type="text"
                  required
                  value={editingCourse.year}
                  onChange={(e) => setEditingCourse({ ...editingCourse, year: e.target.value })}
                  placeholder="Contoh: 2023"
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
                    value={editingCourse.location}
                    onChange={(e) => setEditingCourse({ ...editingCourse, location: e.target.value })}
                    placeholder="Contoh: Online / Jakarta"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                    Urutan
                  </label>
                  <input
                    type="number"
                    value={editingCourse.order}
                    onChange={(e) => setEditingCourse({ ...editingCourse, order: parseInt(e.target.value) || 1 })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                Deskripsi Singkat
              </label>
              <textarea
                rows={2}
                required
                value={editingCourse.description}
                onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                placeholder="Materi yang dipelajari dan kompetensi yang diraih..."
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {courses.map((crs) => (
          <div
            key={crs.id}
            className="flex flex-col justify-between p-4 rounded-xl border border-neutral-200 bg-white shadow-xs hover:border-blue-200 transition-colors"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-bold text-neutral-900 text-sm">{crs.name}</h4>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleStartEdit(crs)}
                    className="p-1 rounded text-neutral-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Hapus pelatihan "${crs.name}"?`)) {
                        onDeleteCourse(crs.id);
                      }
                    }}
                    className="p-1 rounded text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Hapus"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="text-xs font-semibold text-blue-600 mb-1">{crs.organizer}</div>
              <div className="text-xs text-neutral-400 mb-2">
                {crs.year} • {crs.location}
              </div>
              <p className="text-xs text-neutral-600 line-clamp-2">{crs.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
