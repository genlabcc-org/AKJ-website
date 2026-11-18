import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY;

export const BLOG_IMAGES_BUCKET = 'blog-images';

export const supabase =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

/**
 * Packs category, content, and images into the existing `avatar` text column
 * when the Supabase `blogs` table has not yet had `category`, `content`, or `images`
 * columns added via ALTER TABLE.
 */
export function packLegacyBlogPayload(basePayload, { category, content, images }) {
  return {
    ...basePayload,
    avatar: JSON.stringify({
      __akj_meta: true,
      category: category || null,
      content: content || '',
      images: Array.isArray(images) ? images : [],
      originalAvatar: basePayload.avatar ?? null,
    }),
  };
}

/**
 * Normalizes a blog row fetched from Supabase, unpacking any metadata stored
 * in `avatar` if the table is still using the initial column schema.
 */
export function normalizeBlogRow(row) {
  if (!row || typeof row !== 'object') return row;

  if (typeof row.avatar === 'string' && row.avatar.startsWith('{"__akj_meta":true')) {
    try {
      const parsed = JSON.parse(row.avatar);
      return {
        ...row,
        category: row.category || parsed.category || null,
        content: row.content || parsed.content || '',
        images:
          Array.isArray(row.images) && row.images.length > 0
            ? row.images
            : Array.isArray(parsed.images)
              ? parsed.images
              : row.thumb
                ? [row.thumb]
                : [],
        avatar: parsed.originalAvatar ?? null,
      };
    } catch {
      return row;
    }
  }

  return row;
}
