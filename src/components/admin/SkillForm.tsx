import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Wrench, X, Check } from 'lucide-react';
import { Skill } from '../../types';

interface SkillFormProps {
  skills: Skill[];
  onSaveSkill: (skill: Skill) => Promise<void>;
  onDeleteSkill: (id: string) => Promise<void>;
}

export const SkillForm: React.FC<SkillFormProps> = ({
  skills,
  onSaveSkill,
  onDeleteSkill,
}) => {
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleStartAdd = () => {
    setIsNew(true);
    setEditingSkill({
      id: `sk-${Date.now()}`,
      name: '',
      order: skills.length + 1,
    });
  };

  const handleStartEdit = (skill: Skill) => {
    setIsNew(false);
    setEditingSkill({ ...skill });
  };

  const handleCancel = () => {
    setEditingSkill(null);
    setIsNew(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill) return;
    setSaving(true);
    try {
      await onSaveSkill(editingSkill);
      setEditingSkill(null);
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
            <Wrench className="w-5 h-5 text-blue-600" />
            Manajemen Keahlian & Skill
          </h3>
          <p className="text-xs sm:text-sm text-neutral-500">
            Daftar kompetensi yang tampil sebagai chip pada bagian keahlian
          </p>
        </div>

        <button
          onClick={handleStartAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Keahlian</span>
        </button>
      </div>

      {editingSkill && (
        <div className="bg-neutral-50 border border-neutral-200/90 rounded-2xl p-5 mb-6">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-200">
            <h4 className="text-base font-bold text-neutral-900">
              {isNew ? 'Tambah Keahlian Baru' : 'Edit Keahlian'}
            </h4>
            <button
              onClick={handleCancel}
              className="p-1 rounded-lg text-neutral-400 hover:text-neutral-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                Nama Keahlian
              </label>
              <input
                type="text"
                required
                value={editingSkill.name}
                onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                placeholder="Contoh: Canva, Copywriting, Adobe Illustrator"
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                Urutan (Order)
              </label>
              <input
                type="number"
                value={editingSkill.order}
                onChange={(e) => setEditingSkill({ ...editingSkill, order: parseInt(e.target.value) || 1 })}
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

      {/* Grid of skill tags for fast editing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="flex items-center justify-between p-3.5 rounded-xl border border-neutral-200 bg-white shadow-xs hover:border-blue-200 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-md bg-neutral-100 text-neutral-500 text-xs flex items-center justify-center font-mono">
                {skill.order}
              </span>
              <span className="font-semibold text-neutral-900 text-sm">{skill.name}</span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => handleStartEdit(skill)}
                className="p-1 rounded-lg text-neutral-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                title="Edit"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  if (confirm(`Hapus keahlian "${skill.name}"?`)) {
                    onDeleteSkill(skill.id);
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
