-- Mengosongkan tabel terlebih dahulu agar script ini aman jika dijalankan berulang kali (mencegah error duplikasi)
TRUNCATE TABLE transactions_log, buildings, resources, news, users CASCADE;

-- ==========================================
-- 1. Insert Dummy Users
-- (Kita gunakan UUID statis di sini agar mudah direlasikan ke tabel lain saat testing)
-- ==========================================
INSERT INTO users (id, username, email, password_hash, level) VALUES
('11111111-1111-1111-1111-111111111111', 'player_one', 'player1@mail.com', 'hashed_pw_123', 5),
('22222222-2222-2222-2222-222222222222', 'player_two', 'player2@mail.com', 'hashed_pw_456', 2);

-- ==========================================
-- 2. Insert Dummy Resources untuk Pemain
-- ==========================================
INSERT INTO resources (user_id, resource_type, amount, base_production_rate) VALUES
('11111111-1111-1111-1111-111111111111', 'ENERGY', 1500.00, 100.00),
('11111111-1111-1111-1111-111111111111', 'GOLD', 500.00, 25.00),
('11111111-1111-1111-1111-111111111111', 'TECH', 10.00, 2.00),
('22222222-2222-2222-2222-222222222222', 'ENERGY', 300.00, 20.00),
('22222222-2222-2222-2222-222222222222', 'MATERIAL', 150.00, 15.00);

-- ==========================================
-- 3. Insert Dummy News (Fitur Gamifikasi TODAY)
-- ==========================================
INSERT INTO news (title, content, affected_resource, effect_type, multiplier, active_date) VALUES
('Krisis Energi Global', 'Cuaca ekstrem menyebabkan pasokan gas dunia menurun drastis.', 'ENERGY', 'DEBUFF', 0.80, CURRENT_DATE),
('Inovasi AI Terbaru', 'Penemuan chip kuantum mempercepat produksi teknologi.', 'TECH', 'BUFF', 1.50, CURRENT_DATE),
('Tambang Emas Baru', 'Ekskavasi di wilayah selatan membuka cadangan emas masif.', 'GOLD', 'BUFF', 1.20, CURRENT_DATE + INTERVAL '1 day');

-- ==========================================
-- 4. Insert Dummy Buildings
-- ==========================================
INSERT INTO buildings (user_id, building_type, level, status) VALUES
('11111111-1111-1111-1111-111111111111', 'POWER_PLANT', 3, 'ACTIVE'),
('11111111-1111-1111-1111-111111111111', 'LABORATORY', 1, 'UPGRADING'),
('22222222-2222-2222-2222-222222222222', 'MINE', 1, 'ACTIVE');

-- ==========================================
-- 5. Insert Dummy Transactions Log (Anti-Cheat Log)
-- ==========================================
INSERT INTO transactions_log (user_id, action_type, cost_amount) VALUES
('11111111-1111-1111-1111-111111111111', 'UPGRADE_BUILDING', 250.00),
('22222222-2222-2222-2222-222222222222', 'SELL_RESOURCE', 50.00);