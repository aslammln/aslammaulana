import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Globe, X, Check } from 'lucide-react';
import { Language } from '../../types';

interface LanguageFormProps {
  languages: Language[];
  onSaveLanguage: (language: Language) => Promise<void>;
  onDeleteLanguage: (id: string) => Promise<void>;
}

export const LanguageForm: React.FC<LanguageFormProps> = ({
  languages,
  onSaveLanguage,
  onDeleteLanguage,
}) => {
  const [editingLang, setEditingLang] = useState<Language | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleStartAdd = () => {
    setIsNew(true);
    setEditingLang({
      id: `lang-${Date.now()}`,
      language: '',
      level: 'Intermediate',
      order: languages.length + 1,
    });
  };

  const handleStartEdit = (lang: Language) => {
    setIsNew(false);
    setEditingLang({ ...lang });
  };

  const handleCancel = () => {
    setEditingLang(null);
    setIsNew(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLang) return;
    setSaving(true);
    try {
      await onSaveLanguage(editingLang);
      setEditingLang(null);
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
            <Globe className="w-5 h-5 text-blue-600" />
            Manajemen Kemahiran Bahasa
          </h3>
          <p className="text-xs sm:text-sm text-neutral-500">
            Format tampilan di halaman publik: {`{bahasa} — {level}`}
          </p>
        </div>

        <button
          onClick={handleStartAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Bahasa</span>
        </button>
      </div>

      {editingLang && (
        <div className="bg-neutral-50 border border-neutral-200/90 rounded-2xl p-5 mb-6">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-200">
            <h4 className="text-base font-bold text-neutral-900">
              {isNew ? 'Tambah Bahasa Baru' : 'Edit Bahasa'}
            </h4>
            <button
              onClick={handleCancel}
              className="p-1 rounded-lg text-neutral-400 hover:text-neutral-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                Nama Bahasa
              </label>
              <input
                type="text"
                required
                value={editingLang.language}
                onChange={(e) => setEditingLang({ ...editingLang, language: e.target.value })}
                placeholder="Contoh: Bahasa Indonesia, Bahasa Inggris"
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                Level Kemahiran
              </label>
              <input
                type="text"
                required
                value={editingLang.level}
                onChange={(e) => setEditingLang({ ...editingLang, level: e.target.value })}
                placeholder="Contoh: Native, Intermediate, Beginner, Fluent"
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                Urutan (Order)
              </label>
              <input
                type="number"
                value={editingLang.order}
                onChange={(e) => setEditingLang({ ...editingLang, order: parseInt(e.target.value) || 1 })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="sm:col-span-3 flex justify-end gap-2.5 pt-2">
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
      <div className="max-w-xl space-y-2.5">
        {languages.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-3.5 rounded-xl border border-neutral-200 bg-white shadow-xs hover:border-blue-200 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-md bg-neutral-100 text-neutral-500 text-xs flex items-center justify-center font-mono">
                {item.order}
              </span>
              <div>
                <span className="font-semibold text-neutral-900 text-sm">{item.language}</span>
                <span className="text-neutral-500 text-sm ml-2">— {item.level}</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => handleStartEdit(item)}
                className="p-1 rounded-lg text-neutral-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                title="Edit"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  if (confirm(`Hapus bahasa "${item.language}"?`)) {
                    onDeleteLanguage(item.id);
                  }
                }}
                className="p-1 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Hapus"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
