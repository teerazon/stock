// ============================================================
// supabase-client.js - Database Connection & Initialization
// ============================================================

// ⚠️  REPLACE THESE WITH YOUR ACTUAL SUPABASE CREDENTIALS
// Found in: Supabase Dashboard → Settings → API

// Storage bucket name (create this in Supabase Storage)
export const STORAGE_BUCKET = 'product-images';

// Initialize Supabase client
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── Helper: Upload product image to Supabase Storage ────────
export async function uploadProductImage(file, productId) {
  const ext = file.name.split('.').pop();
  const path = `products/${productId}.${ext}`;

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, { upsert: true });

  if (error) throw error;

  const { data } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(path);

  return data.publicUrl;
}

// ── Helper: Delete product image from storage ───────────────
export async function deleteProductImage(imageUrl) {
  if (!imageUrl) return;
  const path = imageUrl.split(`${STORAGE_BUCKET}/`)[1];
  if (!path) return;
  await supabase.storage.from(STORAGE_BUCKET).remove([path]);
}

// ── Connection test ──────────────────────────────────────────
export async function testConnection() {
  const { error } = await supabase.from('inventory').select('id').limit(1);
  if (error) {
    console.error('Supabase connection failed:', error.message);
    return false;
  }
  console.log('✅ Supabase connected');
  return true;
}
