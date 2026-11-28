import { auth } from '../firebase';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').replace(/\/+$/, '');
const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  '';

export const R2_PUBLIC_URL = (
  import.meta.env.VITE_R2_PUBLIC_URL ||
  'https://pub-522d6b6a5e3d4ca3a2936d2a49d9e9d2.r2.dev'
).replace(/\/+$/, '');

export const R2_UPLOAD_URL = (
  import.meta.env.VITE_R2_UPLOAD_URL ||
  (supabaseUrl ? `${supabaseUrl}/functions/v1/r2-upload` : '')
).replace(/\/+$/, '');

/**
 * Resizes and compresses an image file in the browser (WebP) before uploading
 * to keep storage usage minimal and public gallery loads fast.
 */
export async function compressImageForUpload(
  file,
  { maxWidth = 1400, maxHeight = 1400, quality = 0.82 } = {}
) {
  if (!file || !file.type?.startsWith('image/') || file.type === 'image/svg+xml') {
    return file;
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = objectUrl;
    });

    const scale = Math.min(1, maxWidth / img.width, maxHeight / img.height);
    const targetW = Math.max(1, Math.round(img.width * scale));
    const targetH = Math.max(1, Math.round(img.height * scale));

    const canvas = document.createElement('canvas');
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;

    ctx.drawImage(img, 0, 0, targetW, targetH);

    const blob = await new Promise((resolve) =>
      canvas.toBlob((b) => resolve(b), 'image/webp', quality)
    );

    if (!blob || blob.size >= file.size) {
      return file;
    }

    const baseName = (file.name || 'achievement').replace(/\.[^.]+$/, '');
    return new File([blob], `${baseName}.webp`, { type: blob.type });
  } catch {
    return file;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

/**
 * Uploads an optimized achievement photo to Cloudflare R2 via the Supabase
 * Edge Function (`r2-upload`), returning its public Cloudflare R2 URL.
 */
export async function uploadAchievementPhotoToR2(rawFile) {
  if (!R2_UPLOAD_URL) {
    throw new Error(
      'Supabase URL is not configured. Check VITE_SUPABASE_URL in .env.'
    );
  }

  const user = auth.currentUser;
  if (!user) {
    throw new Error('Admin session expired. Please log in again.');
  }

  const optimizedFile = await compressImageForUpload(rawFile);
  const idToken = await user.getIdToken();

  const formData = new FormData();
  formData.append('file', optimizedFile);

  const headers = {
    'x-firebase-token': idToken,
  };
  if (supabaseKey) {
    headers.apikey = supabaseKey;
  }

  const response = await fetch(R2_UPLOAD_URL, {
    method: 'POST',
    headers,
    body: formData,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data?.url) {
    throw new Error(data?.error || `Upload failed with status ${response.status}`);
  }

  return {
    url: data.url,
    key: data.key,
    originalSize: rawFile.size,
    uploadedSize: optimizedFile.size,
  };
}

/**
 * Deletes an achievement photo from Cloudflare R2 via the Supabase Edge Function
 * when the URL belongs to our R2 bucket.
 */
export async function deleteAchievementPhotoFromR2(photoUrl) {
  if (!R2_UPLOAD_URL || !photoUrl || !photoUrl.startsWith(`${R2_PUBLIC_URL}/`)) {
    return;
  }

  const user = auth.currentUser;
  if (!user) return;

  try {
    const idToken = await user.getIdToken();
    const headers = {
      'x-firebase-token': idToken,
      'Content-Type': 'application/json',
    };
    if (supabaseKey) {
      headers.apikey = supabaseKey;
    }

    await fetch(R2_UPLOAD_URL, {
      method: 'DELETE',
      headers,
      body: JSON.stringify({ url: photoUrl }),
    });
  } catch {
    // Non-blocking cleanup
  }
}
