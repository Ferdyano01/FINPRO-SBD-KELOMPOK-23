-- 1. Tabel Users (Untuk Autentikasi dan Profil Dasar)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT auth.uid(), -- Jika pakai Supabase Auth
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    level INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabel News (Untuk Event Harian & Multiplier)
CREATE TABLE news (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    affected_resource VARCHAR(20) NOT NULL, -- Contoh: 'GOLD', 'ENERGY', 'MATERIAL'
    effect_type VARCHAR(10) CHECK (effect_type IN ('BUFF', 'DEBUFF')),
    multiplier DECIMAL(4,2) NOT NULL, -- Contoh: 0.80 atau 1.50
    active_date DATE UNIQUE NOT NULL, -- Satu berita per hari
    source VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabel Resources (Logika Produksi & Saldo Pemain)
CREATE TABLE resources (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    resource_type VARCHAR(20) NOT NULL, -- 'GOLD', 'ENERGY', dll
    amount DECIMAL(20,2) DEFAULT 0.00,
    base_production_rate DECIMAL(10,2) DEFAULT 10.00, -- Produksi per jam
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id, resource_type) -- Satu pemain hanya punya satu baris per tipe resource
);

-- Indexing untuk mempercepat query Leaderboard jika Redis sedang down/maintenance
CREATE INDEX idx_resource_amount ON resources(amount DESC);