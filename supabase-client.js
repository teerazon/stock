// supabase-client.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// รับค่าจาก Environment Variables ที่ Vercel ฉีดให้ผ่านหน้า index.html
const supabaseUrl = window.ENV_SUPABASE_URL;
const supabaseAnonKey = window.ENV_SUPABASE_ANON_KEY;

// ชื่อ Storage bucket (ต้องตรงกับที่สร้างใน Supabase Storage)
export const STORAGE_BUCKET = 'product-images';

// ป้องกันกรณีลืมตั้งค่า Env
if (!supabaseUrl || supabaseUrl.startsWith("%%")) {
  console.error("⚠️ ไม่พบข้อมูล SUPABASE_URL กรุณาตั้งค่าใน Vercel Environment Variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ── ฟังก์ชันอัปโหลดรูปภาพ ──
export async function uploadProductImage(file, productId) {
  const ext = file.name.split('.').pop();
  const path = `products/${productId}.${ext}`;
  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file, { upsert: true });
  if (error) throw error;
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

// ── ฟังก์ชันลบรูปภาพ ──
export async function deleteProductImage(imageUrl) {
  if (!imageUrl) return;
  const path = imageUrl.split(`${STORAGE_BUCKET}/`)[1];
  if (!path) return;
  await supabase.storage.from(STORAGE_BUCKET).remove([path]);
}

// ── ทดสอบการเชื่อมต่อ ──
export async function testConnection() {
  try {
    const { error } = await supabase.from('inventory').select('id').limit(1);
    return !error;
  } catch (e) {
    return false;
  }
}