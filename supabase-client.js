// supabase-client.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// ดึงค่าจากตัวแปรบน Vercel หรือใช้ค่า Default สำหรับพัฒนา (Local)
const SUPABASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
  ? 'https://YOUR_PROJECT_ID.supabase.co' 
  : 'https://' + window.location.hostname.split('.')[0] + '.supabase.co'; // หรือระบุตรงๆ หากทราบ URL แน่นอน

// แนะนำให้ใช้ Environment Variables ของ Vercel แล้วดึงผ่าน Script tag ใน index.html (ดูข้อ 3)
const supabaseUrl = window.ENV_SUPABASE_URL;
const supabaseAnonKey = window.ENV_SUPABASE_ANON_KEY;

export const STORAGE_BUCKET = 'product-images';
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function uploadProductImage(file, productId) {
  const ext = file.name.split('.').pop();
  const path = `products/${productId}.${ext}`;
  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file, { upsert: true });
  if (error) throw error;
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteProductImage(imageUrl) {
  if (!imageUrl) return;
  const path = imageUrl.split(`${STORAGE_BUCKET}/`)[1];
  if (!path) return;
  await supabase.storage.from(STORAGE_BUCKET).remove([path]);
}

export async function testConnection() {
  const { error } = await supabase.from('inventory').select('id').limit(1);
  return !error;
} 