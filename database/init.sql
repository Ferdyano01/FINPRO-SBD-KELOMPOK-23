-- Mengaktifkan ekstensi untuk generate UUID secara otomatis (Standar keamanan modern)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. Tabel users
-- ==========================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    level INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 2. Tabel resources
-- ==========================================
CREATE TABLE resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    resource_type VARCHAR(50) NOT NULL, -- cth: ENERGY, MATERIAL, GOLD, TECH
    amount DECIMAL(15, 2) DEFAULT 0.00,
    base_production_rate DECIMAL(10, 2) DEFAULT 0.00,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT unique_user_resource UNIQUE (user_id, resource_type)
);

-- ==========================================
-- 3. Tabel news
-- ==========================================
CREATE TABLE news (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    affected_resource VARCHAR(50) NOT NULL,
    effect_type VARCHAR(20) CHECK (effect_type IN ('BUFF', 'DEBUFF')),
    multiplier DECIMAL(5, 2) NOT NULL, -- cth: 1.20 untuk +20%
    active_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 4. Tabel buildings
-- ==========================================
CREATE TABLE buildings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    building_type VARCHAR(50) NOT NULL, -- cth: POWER_PLANT, LABORATORY
    level INTEGER DEFAULT 1,
    status VARCHAR(20) CHECK (status IN ('ACTIVE', 'UPGRADING')) DEFAULT 'ACTIVE',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ==========================================
-- 5. Tabel transactions_log (Anti-Cheat Log)
-- ==========================================
CREATE TABLE transactions_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    action_type VARCHAR(50) NOT NULL, -- cth: UPGRADE_BUILDING, SELL_RESOURCE
    cost_amount DECIMAL(15, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);