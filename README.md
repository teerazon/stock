# 📦 StockMate – Stock Management & Shopping List App
## Setup Guide (คู่มือการติดตั้ง)

---

## Step 1: Create a Supabase Project

1. Go to **https://supabase.com** → Sign up / Log in
2. Click **"New Project"**
3. Fill in:
   - **Name**: `stockmate` (or anything you like)
   - **Database Password**: create a strong password
   - **Region**: Southeast Asia (Singapore) → `ap-southeast-1`
4. Click **"Create new project"** and wait ~2 minutes

---

## Step 2: Run the Database Schema

1. In your Supabase dashboard, click **"SQL Editor"** in the left sidebar
2. Click **"New query"**
3. Copy & paste the entire contents of **`schema.sql`**
4. Click **"Run"** (▶ button)
5. You should see: `Success. No rows returned`

This creates:
- `inventory` table – product catalog with barcode, image URL, stock levels
- `shopping_history` table – shopping list with status tracking
- Auto-update triggers for `updated_at`
- Performance indexes
- (Optional) 5 sample products in Thai

---

## Step 3: Create Storage Bucket

1. In Supabase dashboard, click **"Storage"** in the left sidebar
2. Click **"New bucket"**
3. Set:
   - **Name**: `product-images` *(must match exactly)*
   - **Public bucket**: ✅ Toggle ON
4. Click **"Create bucket"**

### Set Storage Policy (allow uploads)
1. Click on `product-images` bucket
2. Click **"Policies"** tab
3. Click **"New Policy"** → **"For full customization"**
4. **Policy name**: `Allow all`
5. **Allowed operation**: SELECT, INSERT, UPDATE, DELETE
6. **Target roles**: Leave blank (public)
7. **USING expression**: `true`
8. **WITH CHECK expression**: `true`
9. Click **"Review"** → **"Save policy"**

---

## Step 4: Get Your API Keys

1. In Supabase dashboard, click **"Settings"** (⚙️) → **"API"**
2. Copy:
   - **Project URL** → looks like `https://abcxyz.supabase.co`
   - **anon public** key → long JWT string starting with `eyJ...`

---

## Step 5: Configure the App

Open **`supabase-client.js`** and replace the placeholder values:

```javascript
// BEFORE (placeholders):
const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_PUBLIC_KEY';

// AFTER (your real values):
const SUPABASE_URL = 'https://abcxyz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

---

## Step 6: Serve the App

Since the app uses ES Modules (`import/export`), it **must** be served over HTTP (not opened directly as a file). Options:

### Option A: VS Code Live Server (easiest)
1. Install the **Live Server** extension in VS Code
2. Right-click `index.html` → **"Open with Live Server"**

### Option B: Python (if installed)
```bash
cd /path/to/your/app
python3 -m http.server 8080
# Open: http://localhost:8080
```

### Option C: Node.js
```bash
npx serve .
# Open the URL shown in terminal
```

### Option D: Deploy to Netlify / Vercel (for production)
1. Drag & drop the folder to **https://netlify.com/drop**
2. Your app is live instantly with HTTPS (required for camera access on mobile)

---

## 📁 File Structure

```
stockmate/
├── index.html          # Main UI + app logic
├── style.css           # All custom styles
├── supabase-client.js  # DB connection + storage helpers
├── inventory.js        # CRUD operations for products
├── scanner.js          # Barcode scanner logic
├── shopping-list.js    # Shopping list + history + PNG export
└── schema.sql          # Database schema (run in Supabase)
```

---

## 📱 Mobile Usage Tips

- **Camera/Scanner**: Requires HTTPS in production. Works on `localhost` for development.
- **Add to Home Screen**: Open in Chrome/Safari on phone → Share → "Add to Home Screen" for app-like experience
- **Thai fonts**: Kanit font is loaded from Google Fonts — requires internet connection

---

## 🚀 Features Summary

| Feature | How to use |
|---|---|
| **Add product** | Tap ＋ button (blue circle) |
| **Quick adjust stock** | Tap −/+ buttons on product card |
| **Scan barcode** | Go to 📷 Scanner tab → tap Start |
| **Add to shopping list** | Tap 🛒 icon on product card |
| **Export shopping list as PNG** | Shopping tab → tap "บันทึก PNG" |
| **View purchase history** | 📋 History tab |
| **Realtime sync** | Auto-updates when data changes |

---

## 🔧 Troubleshooting

| Problem | Solution |
|---|---|
| "ไม่สามารถเชื่อมต่อ" | Check URL & key in `supabase-client.js` |
| Images not uploading | Check bucket name is `product-images` & policy is set |
| Camera not working | Must use HTTPS or localhost; grant camera permission |
| Barcode not scanning | Ensure good lighting; try manual entry fallback |
| ES module errors | Must serve via HTTP server, not `file://` |
