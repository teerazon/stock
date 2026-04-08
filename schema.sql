-- ============================================================
-- STOCK MANAGEMENT APP - SUPABASE SCHEMA
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. INVENTORY TABLE
CREATE TABLE IF NOT EXISTS inventory (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  barcode TEXT UNIQUE,
  image_url TEXT,
  unit TEXT DEFAULT 'pcs',
  min_stock INTEGER DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-update updated_at on row change
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_inventory_updated_at
  BEFORE UPDATE ON inventory
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 2. SHOPPING HISTORY TABLE
CREATE TABLE IF NOT EXISTS shopping_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES inventory(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_image_url TEXT,
  quantity_needed INTEGER NOT NULL DEFAULT 1,
  unit TEXT DEFAULT 'pcs',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'purchased', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_shopping_history_updated_at
  BEFORE UPDATE ON shopping_history
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 3. ROW LEVEL SECURITY (RLS) - optional, enable if auth needed
-- ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE shopping_history ENABLE ROW LEVEL SECURITY;

-- 4. INDEXES for performance
CREATE INDEX idx_inventory_barcode ON inventory(barcode);
CREATE INDEX idx_shopping_history_status ON shopping_history(status);
CREATE INDEX idx_shopping_history_created_at ON shopping_history(created_at DESC);

-- 5. SEED DATA (optional sample products)
INSERT INTO inventory (name, quantity, barcode, unit, min_stock) VALUES
  ('น้ำดื่ม 600ml', 24, '8850006100012', 'ขวด', 12),
  ('ข้าวสาร 5kg', 3, '8851234567890', 'ถุง', 2),
  ('น้ำมันพืช 1L', 8, '8852345678901', 'ขวด', 5),
  ('นมสด 1L', 6, '8853456789012', 'กล่อง', 4),
  ('กระดาษชำระ (แพ็ค 12)', 2, '8854567890123', 'แพ็ค', 3);
