-- =============================================
-- Home Asset & Service Tracker - Database Schema
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. ASSETS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    brand VARCHAR(100),
    model VARCHAR(100),
    serial_number VARCHAR(100),
    location VARCHAR(255),
    purchase_date DATE,
    purchase_price NUMERIC(15, 2) DEFAULT 0,
    condition VARCHAR(50) DEFAULT 'good',
    status VARCHAR(50) DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add check constraint for status
ALTER TABLE assets ADD CONSTRAINT assets_status_check 
    CHECK (status IN ('active', 'sold', 'broken', 'disposed'));

-- Add check constraint for condition
ALTER TABLE assets ADD CONSTRAINT assets_condition_check 
    CHECK (condition IN ('excellent', 'good', 'fair', 'poor'));

-- Create index for common queries
CREATE INDEX idx_assets_category ON assets(category);
CREATE INDEX idx_assets_status ON assets(status);
CREATE INDEX idx_assets_created_at ON assets(created_at DESC);

-- =============================================
-- 2. WARRANTIES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS warranties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID NOT NULL UNIQUE,
    warranty_start DATE NOT NULL,
    warranty_end DATE NOT NULL,
    provider VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_warranties_asset 
        FOREIGN KEY (asset_id) 
        REFERENCES assets(id) 
        ON DELETE CASCADE
);

-- Create index for warranty lookups
CREATE INDEX idx_warranties_asset_id ON warranties(asset_id);
CREATE INDEX idx_warranties_end_date ON warranties(warranty_end);

-- =============================================
-- 3. SERVICES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID NOT NULL,
    service_date DATE NOT NULL,
    problem_description TEXT,
    repair_action TEXT,
    service_place VARCHAR(255),
    cost NUMERIC(15, 2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_services_asset 
        FOREIGN KEY (asset_id) 
        REFERENCES assets(id) 
        ON DELETE CASCADE
);

-- Add check constraint for service status
ALTER TABLE services ADD CONSTRAINT services_status_check 
    CHECK (status IN ('process', 'completed'));

-- Create indexes for service queries
CREATE INDEX idx_services_asset_id ON services(asset_id);
CREATE INDEX idx_services_date ON services(service_date DESC);
CREATE INDEX idx_services_status ON services(status);

-- =============================================
-- 4. ASSET_SALES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS asset_sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID NOT NULL UNIQUE,
    sold_date DATE NOT NULL,
    sold_price NUMERIC(15, 2) NOT NULL,
    buyer_name VARCHAR(255),
    profit_loss NUMERIC(15, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_asset_sales_asset 
        FOREIGN KEY (asset_id) 
        REFERENCES assets(id) 
        ON DELETE CASCADE
);

-- Create index for sales queries
CREATE INDEX idx_asset_sales_asset_id ON asset_sales(asset_id);
CREATE INDEX idx_asset_sales_date ON asset_sales(sold_date DESC);

-- =============================================
-- 5. ASSET_IMAGES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS asset_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID NOT NULL,
    image_url TEXT NOT NULL,
    image_type VARCHAR(50) DEFAULT 'asset',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_asset_images_asset 
        FOREIGN KEY (asset_id) 
        REFERENCES assets(id) 
        ON DELETE CASCADE
);

-- Add check constraint for image type
ALTER TABLE asset_images ADD CONSTRAINT asset_images_type_check 
    CHECK (image_type IN ('asset', 'service', 'receipt'));

-- Create index for image queries
CREATE INDEX idx_asset_images_asset_id ON asset_images(asset_id);
CREATE INDEX idx_asset_images_type ON asset_images(image_type);

-- =============================================
-- TRIGGER: Auto-update updated_at on assets
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_assets_updated_at
    BEFORE UPDATE ON assets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE warranties ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_images ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users (single user app)
-- Assets policies
CREATE POLICY "Allow all operations for authenticated users on assets" ON assets
    FOR ALL USING (auth.role() = 'authenticated');

-- Warranties policies
CREATE POLICY "Allow all operations for authenticated users on warranties" ON warranties
    FOR ALL USING (auth.role() = 'authenticated');

-- Services policies
CREATE POLICY "Allow all operations for authenticated users on services" ON services
    FOR ALL USING (auth.role() = 'authenticated');

-- Asset sales policies
CREATE POLICY "Allow all operations for authenticated users on asset_sales" ON asset_sales
    FOR ALL USING (auth.role() = 'authenticated');

-- Asset images policies
CREATE POLICY "Allow all operations for authenticated users on asset_images" ON asset_images
    FOR ALL USING (auth.role() = 'authenticated');

-- =============================================
-- STORAGE BUCKET SETUP (Run in Supabase Dashboard)
-- =============================================
-- Create a storage bucket named 'assets' for storing images
-- INSERT INTO storage.buckets (id, name, public) VALUES ('assets', 'assets', true);

-- Storage policies (run these in Supabase SQL editor)
-- CREATE POLICY "Allow authenticated uploads" ON storage.objects
--     FOR INSERT WITH CHECK (bucket_id = 'assets' AND auth.role() = 'authenticated');

-- CREATE POLICY "Allow authenticated updates" ON storage.objects
--     FOR UPDATE USING (bucket_id = 'assets' AND auth.role() = 'authenticated');

-- CREATE POLICY "Allow authenticated deletes" ON storage.objects
--     FOR DELETE USING (bucket_id = 'assets' AND auth.role() = 'authenticated');

-- CREATE POLICY "Allow public read" ON storage.objects
--     FOR SELECT USING (bucket_id = 'assets');

