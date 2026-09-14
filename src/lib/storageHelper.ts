import { supabase, isSupabaseConfigured } from './supabase';

export async function uploadImage(
  file: File,
  bucket: 'avatars' | 'projects'
): Promise<{ url: string | null; error: string | null }> {
  // If Supabase is connected, attempt upload to the specified bucket
  if (isSupabaseConfigured && supabase) {
    try {
      const fileExt = file.name.split('.').pop() || 'png';
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (!uploadError) {
        const { data: publicUrlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(filePath);

        return { url: publicUrlData.publicUrl, error: null };
      }
      console.warn('Supabase storage upload failed, falling back to local data URL:', uploadError.message);
    } catch (err: unknown) {
      console.warn('Supabase storage error:', err);
    }
  }

  // Local fallback: convert to base64 data URL for preview and local persistence
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({ url: reader.result as string, error: null });
    };
    reader.onerror = () => {
      resolve({ url: null, error: 'Gagal memproses file gambar' });
    };
    reader.readAsDataURL(file);
  });
}
