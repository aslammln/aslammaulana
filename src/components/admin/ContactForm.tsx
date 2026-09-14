import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Mail, X, Check, ExternalLink } from 'lucide-react';
import { Contact } from '../../types';

interface ContactFormProps {
  contacts: Contact[];
  onSaveContact: (contact: Contact) => Promise<void>;
  onDeleteContact: (id: string) => Promise<void>;
}

export const ContactForm: React.FC<ContactFormProps> = ({
  contacts,
  onSaveContact,
  onDeleteContact,
}) => {
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleStartAdd = () => {
    setIsNew(true);
    setEditingContact({
      id: `cnt-${Date.now()}`,
      platform: 'WhatsApp',
      value: 'https://wa.me/',
      order: contacts.length + 1,
    });
  };

  const handleStartEdit = (contact: Contact) => {
    setIsNew(false);
    setEditingContact({ ...contact });
  };

  const handleCancel = () => {
    setEditingContact(null);
    setIsNew(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingContact) return;
    setSaving(true);
    try {
      await onSaveContact(editingContact);
      setEditingContact(null);
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
            <Mail className="w-5 h-5 text-blue-600" />
            Manajemen Kontak & Media Sosial
          </h3>
          <p className="text-xs sm:text-sm text-neutral-500">
            Kelola saluran komunikasi (WhatsApp, Email, Instagram, LinkedIn, dsb.)
          </p>
        </div>

        <button
          onClick={handleStartAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Kontak</span>
        </button>
      </div>

      {editingContact && (
        <div className="bg-neutral-50 border border-neutral-200/90 rounded-2xl p-5 mb-6">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-200">
            <h4 className="text-base font-bold text-neutral-900">
              {isNew ? 'Tambah Kontak Baru' : 'Edit Kontak'}
            </h4>
            <button
              onClick={handleCancel}
              className="p-1 rounded-lg text-neutral-400 hover:text-neutral-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Platform
                </label>
                <input
                  type="text"
                  required
                  value={editingContact.platform}
                  onChange={(e) => setEditingContact({ ...editingContact, platform: e.target.value })}
                  placeholder="WhatsApp / Email / Instagram / LinkedIn"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Nilai / URL Tautan
                </label>
                <input
                  type="text"
                  required
                  value={editingContact.value}
                  onChange={(e) => setEditingContact({ ...editingContact, value: e.target.value })}
                  placeholder="https://wa.me/62... atau mailto:... atau https://instagram.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                Urutan (Order)
              </label>
              <input
                type="number"
                value={editingContact.order}
                onChange={(e) => setEditingContact({ ...editingContact, order: parseInt(e.target.value) || 1 })}
                className="w-28 px-3.5 py-2 rounded-xl border border-neutral-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
      <div className="space-y-2.5">
        {contacts.map((c) => (
          <div
            key={c.id}
            className="flex items-center justify-between p-4 rounded-xl border border-neutral-200 bg-white shadow-xs hover:border-blue-200 transition-colors"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <span className="w-6 h-6 rounded-md bg-neutral-100 text-neutral-500 text-xs flex items-center justify-center font-mono">
                {c.order}
              </span>
              <div className="min-w-0">
                <div className="font-semibold text-neutral-900 text-sm">{c.platform}</div>
                <div className="text-xs text-neutral-500 truncate max-w-sm sm:max-w-md">
                  {c.value}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href={c.value}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg text-neutral-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                title="Buka tautan"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
              <button
                onClick={() => handleStartEdit(c)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                title="Edit"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  if (confirm(`Hapus kontak "${c.platform}"?`)) {
                    onDeleteContact(c.id);
                  }
                }}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
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
