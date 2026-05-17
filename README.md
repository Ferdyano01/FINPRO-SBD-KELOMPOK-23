# 📰 TODAY — News Web & Resource Game
### FINPRO SBD Kelompok 23

> Platform interaktif yang menggabungkan portal berita harian dengan simulasi manajemen sumber daya berbasis gamifikasi.

---

## 📖 Deskripsi Singkat

**TODAY** adalah aplikasi web game di mana pemain mengelola produksi sumber daya virtual (Gold, Energy, Material, Tech) milik "kota" atau "perusahaan" mereka. Setiap hari, berita dunia nyata dirilis dan secara langsung memengaruhi *rate* produksi sumber daya pemain — mendorong pemain untuk memahami situasi terkini dan merancang strategi yang optimal.

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|---|---|
| Game Client | Godot Engine (GDScript) |
| Backend | Node.js + Express.js v5 |
| Database Utama | PostgreSQL via Supabase |
| Database Cache | Redis |
| Auth | JWT + bcrypt |
| Security | Helmet + express-rate-limit |
| Deployment Client | Vercel / GitHub Pages (HTML5 Export) |
| Deployment Backend | Railway / Render |

---

## 📁 Struktur Folder

```
FINPRO-SBD-KELOMPOK-23/
├── Backend/
│   ├── database/
│   │   ├── init.sql          # DDL: membuat semua tabel
│   │   └── seed.sql          # DML: data dummy awal
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js   # Koneksi PostgreSQL
│   │   │   └── redis.js      # Koneksi Redis
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── craftingController.js
│   │   │   ├── leaderboardController.js
│   │   │   ├── newsController.js
│   │   │   ├── resourceController.js
│   │   │   └── workerController.js
│   │   ├── middlewares/
│   │   │   └── authMiddleware.js
│   │   ├── models/
│   │   │   ├── newsModel.js
│   │   │   ├── resourceModel.js
│   │   │   └── userModel.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── craftingRoutes.js
│   │   │   ├── leaderboardRoutes.js
│   │   │   ├── newsRoutes.js
│   │   │   ├── resourceRoutes.js
│   │   │   └── workerRoutes.js
│   │   ├── services/
│   │   │   ├── leaderboardService.js
│   │   │   ├── newsAutomationService.js
│   │   │   ├── newsService.js
│   │   │   └── resourceService.js
│   │   ├── utils/
│   │   │   └── newsFetcher.js
│   │   ├── app.js
│   │   └── server.js
│   ├── .env                  # (tidak di-commit, lihat bagian Konfigurasi)
│   ├── .gitignore
│   ├── package.json
│   └── vercel-cron.txt
├── Frontend/                 # Hasil export Godot → HTML5 (siap deploy)
│   ├── Finpro-SBD.html       # Entry point game
│   ├── Finpro-SBD.js         # Engine runtime
│   ├── Finpro-SBD.wasm       # WebAssembly binary
│   ├── Finpro-SBD.pck        # Asset pack game
│   ├── Finpro-SBD.png        # Splash screen
│   ├── Finpro-SBD.icon.png
│   ├── Finpro-SBD.apple-touch-icon.png
│   └── Finpro-SBD.audio.worklet.js
└── README.md
```

---

## ⚙️ Konfigurasi Environment Variables

Buat file `.env` di dalam folder `Backend/` dan isi dengan nilai berikut:

```env
# Supabase
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key

# PostgreSQL (Direct Connection)
DATABASE_URL=postgresql://user:password@host:port/database
PG_USER=postgres
PG_HOST=db.xxxxxxxxxxxx.supabase.co
PG_DATABASE=postgres
PG_PASSWORD=your_pg_password
PG_PORT=5432

# Redis
REDIS_URL=redis://default:password@host:port

# Auth
JWT_SECRET=your_jwt_secret_key_min_32_chars

# News API
NEWS_API_KEY=your_newsapi_key

# App
NODE_ENV=development
```

> ⚠️ Jangan pernah commit file `.env` ke GitHub. Pastikan `.env` sudah ada di `.gitignore`.

---

## 🚀 Setup & Menjalankan Backend

### Prasyarat
- Node.js v18 atau lebih baru
- npm v9 atau lebih baru
- Akun [Supabase](https://supabase.com) (sudah dibuat oleh Ketua)
- Akun [Redis Cloud](https://redis.io/cloud) atau Upstash (sudah di-setup oleh Anggota 4)

### Langkah Instalasi

**1. Clone repositori**
```bash
git clone https://github.com/Ferdyano01/FINPRO-SBD-KELOMPOK-23.git
cd FINPRO-SBD-KELOMPOK-23/Backend
```

**2. Install dependencies**
```bash
npm install
```

**3. Konfigurasi `.env`**

Salin template di atas ke file `.env` dan isi nilainya.

**4. Setup database**

Jalankan script SQL berikut di Supabase SQL Editor (atau psql):
```bash
# Buat tabel (DDL)
psql $DATABASE_URL -f database/init.sql

# Isi data dummy (opsional)
psql $DATABASE_URL -f database/seed.sql
```

**5. Jalankan server**
```bash
# Mode development (auto-restart)
npm run dev

# Mode production
npm start
```

Server berjalan di: `http://localhost:3000`

---

## 📡 API Endpoints

Base URL production: `https://your-backend.railway.app`  
Base URL local: `http://localhost:3000`

> 🔒 Endpoint bertanda **[Auth]** memerlukan header: `Authorization: Bearer <token>`

### 🔑 Authentication

| Method | Endpoint | Deskripsi |
|---|---|---|
| POST | `/api/auth/register` | Daftar akun baru |
| POST | `/api/auth/login` | Login dan dapatkan JWT token |

**POST `/api/auth/register`**
```json
// Request Body
{
  "username": "player123",
  "email": "player@example.com",
  "password": "password123"
}

// Response 201
{
  "message": "Registrasi berhasil",
  "user": { "id": "uuid", "username": "player123" }
}
```

**POST `/api/auth/login`**
```json
// Request Body
{
  "email": "player@example.com",
  "password": "password123"
}

// Response 200
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": "uuid", "username": "player123" }
}
```

---

### 💰 Resource

| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/api/resources/:userId` | **[Auth]** Ambil snapshot resource pemain |
| POST | `/api/resources/sync` | **[Auth]** Sinkronisasi & kalkulasi produksi |
| POST | `/api/resources/sell` | **[Auth]** Jual resource |

**GET `/api/resources/:userId`**
```json
// Response 200
{
  "resources": [
    { "resource_type": "GOLD", "amount": 1250.5, "base_production_rate": 50 },
    { "resource_type": "ENERGY", "amount": 840.0, "base_production_rate": 80 }
  ]
}
```

**POST `/api/resources/sync`**
```json
// Request Body
{ "userId": "uuid" }

// Response 200
{
  "message": "Resource berhasil disinkronisasi",
  "updated": [
    { "resource_type": "GOLD", "amount": 1300.5 }
  ]
}
```

---

### 📰 News

| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/api/news/today` | Ambil berita aktif hari ini beserta multiplier |
| GET | `/api/news` | Ambil semua riwayat berita |
| POST | `/api/news` | **[Auth/Admin]** Tambah berita baru |

---

### 🏆 Leaderboard

| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/api/leaderboard` | Ambil ranking pemain (dari Redis) |

---

### ⚒️ Crafting & Worker

| Method | Endpoint | Deskripsi |
|---|---|---|
| POST | `/api/crafting` | **[Auth]** Craft item dari resource |
| GET | `/api/worker` | **[Auth]** Lihat status worker |
| POST | `/api/worker` | **[Auth]** Assign worker |

---

## 🗄️ Skema Database (PostgreSQL)

### Tabel `users`
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | UUID | Primary Key |
| username | VARCHAR | Unique |
| email | VARCHAR | Unique |
| password_hash | VARCHAR | — |
| level | INTEGER | Reputasi pemain |
| created_at | TIMESTAMP | — |

### Tabel `resources`
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | UUID | Primary Key |
| user_id | UUID | FK → users |
| resource_type | VARCHAR | GOLD / ENERGY / MATERIAL / TECH |
| amount | DECIMAL | Jumlah saat ini |
| base_production_rate | DECIMAL | Unit per jam |

> Unique constraint: (`user_id`, `resource_type`)

### Tabel `news`
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | UUID | Primary Key |
| title | VARCHAR | Judul berita |
| content | TEXT | Isi berita |
| affected_resource | VARCHAR | Resource yang terdampak |
| effect_type | VARCHAR | BUFF atau DEBUFF |
| multiplier | DECIMAL | Contoh: 1.2 = +20%, 0.8 = -20% |
| active_date | DATE | Tanggal berlaku |
| created_at | TIMESTAMP | — |

### Tabel `news_effects_log`
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | UUID | Primary Key |
| user_id | UUID | FK → users |
| news_id | UUID | FK → news |
| applied_at | TIMESTAMP | Waktu efek diterapkan |

### Tabel `transactions_log`
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | UUID | Primary Key |
| user_id | UUID | FK → users |
| action_type | VARCHAR | SELL_RESOURCE / CLAIM_REWARD |
| resource_type | VARCHAR | — |
| cost_amount | DECIMAL | — |
| gain_amount | DECIMAL | — |
| created_at | TIMESTAMP | — |

---

## 🎮 Menjalankan Game Client

Game sudah di-export ke format **HTML5/WebAssembly** dan tersedia di folder `Frontend/`. Tidak perlu menginstall Godot Engine untuk memainkannya.

### Cara 1 — Akses Online (Direkomendasikan)
Buka URL deployment yang sudah disediakan oleh Anggota 4:
> 🔗 **(https://frontend-finpro-sbd-kelompok-23.vercel.app/)**

### Cara 2 — Jalankan Lokal
Karena file `.wasm` memerlukan server HTTP (tidak bisa dibuka langsung sebagai file), gunakan salah satu cara berikut:

**Menggunakan Node.js (`serve`):**
```bash
npx serve Frontend/
# Buka http://localhost:3000
```

**Menggunakan Python:**
```bash
cd Frontend
python -m http.server 8080
# Buka http://localhost:8080
```

**Menggunakan ekstensi VS Code:**
- Install ekstensi **Live Server**
- Klik kanan `Frontend/Finpro-SBD.html` → **Open with Live Server**

> ⚠️ Pastikan backend sudah berjalan (lokal atau production) agar game dapat terhubung ke API.

---

## 🔴 Implementasi Redis

| Kegunaan | Tipe Data | Key Pattern |
|---|---|---|
| Cache berita harian | String (JSON) | `news:today` |
| Multiplier aktif | String | `multiplier:{resource_type}` |
| Global Leaderboard | Sorted Set | `leaderboard:global` |
| Session / Rate Limit | String | `session:{userId}` |

---

## 📊 Diagram Sistem

### ERD
![Screenshot 2026-05-17 185131](https://hackmd.io/_uploads/B15u4Pwkfl.png)


### UML Use Case
![Screenshot 2026-05-17 184738](https://hackmd.io/_uploads/r1g0ONvvyGl.png)


### Flowchart Kalkulasi Produksi
![Screenshot 2026-05-17 184658](https://hackmd.io/_uploads/Bk-tEvv1Mg.png)


---

## 👥 Tim Pengembang — Kelompok 23

| Anggota | Peran | Tanggung Jawab |
|---|---|---|
| Anggota 1 | Ketua & Lead Backend | PostgreSQL DDL/DML, REST API, autentikasi, Git flow |
| Anggota 2 | Lead Game & UI | Godot Engine, GDScript, integrasi client-server |
| Anggota 3 | System Analyst & Docs | UML, ERD, Flowchart, konten berita, balance game, README |
| Anggota 4 | Project Manager & DevOps | Setup Redis, deployment, QA, laporan PPT |

---

## 📝 Catatan Pengembangan

- Pastikan backend sudah berjalan sebelum membuka Godot client
- File `init.sql` harus dijalankan **sekali** saat pertama setup — jangan dijalankan ulang jika data sudah ada
- JWT token berlaku selama **1 jam** — client Godot perlu handle refresh token atau re-login
- Rate limiter aktif di semua endpoint — jangan lakukan request berulang dalam waktu singkat saat testing
