import React, { useState, useRef } from 'react';
import { Upload, X, Check, Image as ImageIcon, Loader2 } from 'lucide-react';
import { uploadImage } from '../../lib/storageHelper';

interface ImageUploaderProps {
  currentUrl?: string | null;
  bucket: 'avatars' | 'projects';
  onImageSelected: (url: string) => void;
  label?: string;
  aspectRatio?: 'square' | 'video';
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentUrl,
  bucket,
  onImageSelected,
  label = 'Upload Gambar',
  aspectRatio = 'square',
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProcessFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Harap pilih file gambar (JPG, PNG, WebP, dll.)');
      return;
    }
    setError(null);
    setUploading(true);

    try {
      const { url, error: uploadErr } = await uploadImage(file, bucket);
      if (uploadErr || !url) {
        setError(uploadErr || 'Gagal mengupload gambar');
      } else {
        setPreview(url);
        onImageSelected(url);
      }
    } catch {
      setError('Terjadi kendala saat memproses gambar');
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onImageSelected('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider">
          {label}
        </label>
      )}

      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-4 sm:p-6 text-center cursor-pointer transition-colors ${
          dragOver
            ? 'border-blue-500 bg-blue-50/50'
            : 'border-neutral-300 hover:border-blue-400 bg-neutral-50/60'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleProcessFile(e.target.files[0]);
            }
          }}
        />

        {uploading ? (
          <div className="py-8 flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="text-xs sm:text-sm font-medium text-neutral-600">
              Sedang mengunggah gambar...
            </p>
          </div>
        ) : preview ? (
          <div className="relative flex flex-col items-center">
            <div
              className={`overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xs ${
                aspectRatio === 'square'
                  ? 'w-32 h-32 sm:w-40 sm:h-40'
                  : 'w-full max-w-sm aspect-video'
              }`}
            >
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="mt-3 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <Check className="w-3.5 h-3.5" /> Gambar Terpilih
              </span>
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-full border border-rose-200 transition-colors"
              >
                <X className="w-3.5 h-3.5" /> Hapus
              </button>
            </div>
            <p className="text-xs text-neutral-400 mt-1.5">
              Klik atau drop gambar baru untuk mengganti
            </p>
          </div>
        ) : (
          <div className="py-6 flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-neutral-800">
              Tarik & letakkan gambar di sini, atau <span className="text-blue-600">klik untuk pilih</span>
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              Mendukung PNG, JPG, GIF, WebP (Maks. 5MB)
            </p>
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-rose-600 mt-1">{error}</p>
      )}
    </div>
  );
};
