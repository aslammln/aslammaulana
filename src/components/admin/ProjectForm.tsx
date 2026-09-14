import React, { useState } from 'react';
import { Plus, Trash2, Edit2, ExternalLink, FolderGit2, X, Check } from 'lucide-react';
import { Project } from '../../types';
import { ImageUploader } from './ImageUploader';

interface ProjectFormProps {
  projects: Project[];
  onSaveProject: (project: Project) => Promise<void>;
  onDeleteProject: (id: string) => Promise<void>;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({
  projects,
  onSaveProject,
  onDeleteProject,
}) => {
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleStartAdd = () => {
    setIsNew(true);
    setEditingProject({
      id: `proj-${Date.now()}`,
      title: '',
      description: '',
      image_url: null,
      link: null,
      order: projects.length + 1,
    });
  };

  const handleStartEdit = (proj: Project) => {
    setIsNew(false);
    setEditingProject({ ...proj });
  };

  const handleCancel = () => {
    setEditingProject(null);
    setIsNew(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    setSaving(true);
    try {
      await onSaveProject(editingProject);
      setEditingProject(null);
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
            <FolderGit2 className="w-5 h-5 text-blue-600" />
            Manajemen Project & Portofolio
          </h3>
          <p className="text-xs sm:text-sm text-neutral-500">
            Tambah, perbarui karya, unggah gambar ke bucket projects, atau tautkan link Google Drive
          </p>
        </div>

        <button
          onClick={handleStartAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Project</span>
        </button>
      </div>

      {/* Modal / Form Edit atau Tambah */}
      {editingProject && (
        <div className="bg-neutral-50 border border-neutral-200/90 rounded-2xl p-5 sm:p-6 mb-6">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-200">
            <h4 className="text-base font-bold text-neutral-900">
              {isNew ? 'Tambah Project Baru' : 'Edit Project'}
            </h4>
            <button
              onClick={handleCancel}
              className="p-1 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-200/60"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Judul Project
                </label>
                <input
                  type="text"
                  required
                  value={editingProject.title}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  placeholder="Contoh: Kampanye Visual UMKM Kuliner"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Urutan Tampil (Order)
                </label>
                <input
                  type="number"
                  value={editingProject.order}
                  onChange={(e) => setEditingProject({ ...editingProject, order: parseInt(e.target.value) || 1 })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                Deskripsi Project
              </label>
              <textarea
                rows={3}
                required
                value={editingProject.description}
                onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                placeholder="Jelaskan peran, hasil karya, dampak atau metrik yang dicapai..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                Link Eksternal (Google Drive / Website / Canva)
              </label>
              <input
                type="url"
                value={editingProject.link || ''}
                onChange={(e) => setEditingProject({ ...editingProject, link: e.target.value || null })}
                placeholder="https://drive.google.com/..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <ImageUploader
                label="Gambar Project (Bucket projects)"
                bucket="projects"
                aspectRatio="video"
                currentUrl={editingProject.image_url}
                onImageSelected={(url) => setEditingProject({ ...editingProject, image_url: url || null })}
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200">
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
                <span>{saving ? 'Menyimpan...' : 'Simpan Project'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Daftar Project */}
      <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
        <table className="w-full text-left text-sm text-neutral-600">
          <thead className="bg-neutral-50 border-b border-neutral-200 text-xs font-semibold uppercase text-neutral-700">
            <tr>
              <th className="px-4 py-3.5 w-16">Urutan</th>
              <th className="px-4 py-3.5 w-24">Thumbnail</th>
              <th className="px-4 py-3.5">Judul & Deskripsi</th>
              <th className="px-4 py-3.5 w-32">Link</th>
              <th className="px-4 py-3.5 w-28 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {projects.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-neutral-400">
                  Belum ada data project. Klik "Tambah Project" untuk mulai.
                </td>
              </tr>
            ) : (
              projects.map((item) => (
                <tr key={item.id} className="hover:bg-neutral-50/70 transition-colors">
                  <td className="px-4 py-4 font-mono text-xs text-neutral-400">
                    #{item.order}
                  </td>
                  <td className="px-4 py-4">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-16 h-10 object-cover rounded-lg border border-neutral-200 bg-neutral-100"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-16 h-10 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-400 text-xs">
                        No img
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4 max-w-sm">
                    <div className="font-semibold text-neutral-900">{item.title}</div>
                    <div className="text-xs text-neutral-500 line-clamp-2 mt-0.5">
                      {item.description}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    {item.link ? (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
                      >
                        <span>Buka</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-neutral-400 text-xs">-</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleStartEdit(item)}
                        className="p-1.5 rounded-lg text-neutral-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Edit Project"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Yakin ingin menghapus project "${item.title}"?`)) {
                            onDeleteProject(item.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-neutral-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Hapus Project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
