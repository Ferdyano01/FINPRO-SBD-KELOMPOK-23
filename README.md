# FINPRO SBD KELOMPOK 23: "TODAY" - NEWS WEB & RESOURCE GAME

## 1. Deskripsi Sistem
Aplikasi "Today" adalah sebuah platform interaktif yang menggabungkan portal berita harian (*News Web*) dengan elemen simulasi manajemen sumber daya (*Resource Game*). Dalam game ini, pemain memiliki "kota" atau "perusahaan" virtual dan harus mengelola produksi berbagai sumber daya (seperti *Gold*, *Energy*, *Material*, atau *Tech Parts*). 

Nilai jual utama dari sistem ini adalah **Dynamic News with Gamification**. Setiap harinya, platform akan merilis berita dunia nyata untuk tujuan edukasi dan informasi yang dikemas ke dalam mekanik *gameplay*. Berita ini secara langsung mempengaruhi *rate* produksi sumber daya pemain. Misalnya: berita "Krisis Energi Global" akan menurunkan produksi *Energy* sebesar 20%, sementara berita "Inovasi Teknologi Baru" akan mem-*boost* produksi *Tech Parts*. Dengan gamifikasi ini, pemain tidak hanya sekadar membaca berita, tetapi didorong untuk memahami situasi terkini guna merancang strategi alokasi sumber daya dan pembangunan infrastruktur yang optimal di dalam game.

---

## 2. Implementasi Teknologi & Arsitektur
Sistem ini memisahkan antara klien *game* visual dan arsitektur *backend* server:

* **Frontend / Client-Side (Godot Engine):**
    * Menggunakan **Godot Engine** (dengan GDScript) untuk membangun klien *game*. Godot memberikan keleluasaan dalam menciptakan elemen gamifikasi seperti UI interaktif, *dashboard* manajemen kota, animasi, dan *feedback* visual.
    * Integrasi data dilakukan menggunakan node `HTTPRequest` pada Godot untuk melakukan pemanggilan REST API ke *backend* secara asinkron (mengambil data pemain, berita harian, dan sinkronisasi sumber daya).
* **API & Backend (Node.js & Express.js):**
    * **Express.js** digunakan sebagai *backend framework* untuk memproses logika bisnis pusat, seperti registrasi pemain, kalkulasi *multiplier* produksi berdasarkan berita yang aktif, dan validasi transaksi *in-game*.
* **Database Relasional (PostgreSQL):**
    * Sebagai *Single Source of Truth* untuk menyimpan data pemain, inventaris sumber daya, infrastruktur bangunan, dan riwayat berita. Memenuhi standar wajib praktikum SBD untuk implementasi RDBMS.
* **Database In-Memory (Redis):**
    * Digunakan untuk mengelola *caching* berita harian yang sedang aktif beserta efek *multiplier*-nya, serta untuk *Global Leaderboard*. Ini meminimalisir beban *query* berat ke PostgreSQL karena *backend* harus melayani permintaan status sumber daya dari klien Godot secara terus-menerus.
* **Deployment:**
    * Klien **Godot** dapat di-*export* ke format HTML5/WebAssembly dan di-*host* di Vercel atau GitHub Pages agar dapat dimainkan langsung di *browser*.
    * *Backend* (Node.js) dan *Database* di-*host* melalui layanan *cloud* seperti Railway, Render, atau Supabase bahkan *Cloudinary* jika perlu.

---

## 3. Skenario Database Utama (PostgreSQL)
### A. Tabel `users`
Menyimpan identitas pemain dan progres permainan mereka.
* `id` (UUID, Primary Key)
* `username` (VARCHAR, Unique)
* `email` (VARCHAR, Unique)
* `password_hash` (VARCHAR)
* `level` (INTEGER) -> Level atau reputasi pemain.
* `created_at` (TIMESTAMP)

### B. Tabel `resources`
Menyimpan inventaris sumber daya yang dimiliki oleh setiap pemain.
* `id` (UUID, Primary Key)
* `user_id` (UUID, Foreign Key ke `users`)
* `resource_type` (VARCHAR) -> Contoh: `ENERGY`, `MATERIAL`, `GOLD`, `TECH`.
* `amount` (DECIMAL) -> Jumlah yang dimiliki saat ini (disinkronisasi dengan server).
* `base_production_rate` (DECIMAL) -> Rate produksi dasar per jam.
* **Unique Constraint:** (`user_id`, `resource_type`)

### C. Tabel `news`
Menyimpan daftar berita yang menjadi inti mekanik gamifikasi.
* `id` (UUID, Primary Key)
* `title` (VARCHAR)
* `content` (TEXT) -> Isi berita edukasi/informasi aktual.
* `affected_resource` (VARCHAR) -> Sumber daya apa yang terkena dampak.
* `effect_type` (VARCHAR) -> `BUFF` (Positif) atau `DEBUFF` (Negatif).
* `multiplier` (DECIMAL) -> Faktor pengali (contoh: 1.2 untuk +20%, 0.8 untuk -20%).
* `active_date` (DATE) -> Tanggal berita tersebut berlaku di dalam ekosistem game.
* `created_at` (TIMESTAMP)

### D. Tabel `buildings`
Menyimpan infrastruktur yang dibangun pemain untuk meningkatkan kapasitas/produksi.
* `id` (UUID, Primary Key)
* `user_id` (UUID, Foreign Key ke `users`)
* `building_type` (VARCHAR) -> Contoh: `POWER_PLANT`, `LABORATORY`.
* `level` (INTEGER)
* `status` (VARCHAR) -> `ACTIVE`, `UPGRADING`.

### E. Tabel `transactions_log`
Log aktivitas ekonomi pemain untuk mencegah kecurangan (*anti-cheat log*).
* `id` (UUID, Primary Key)
* `user_id` (UUID, Foreign Key ke `users`)
* `action_type` (VARCHAR) -> `UPGRADE_BUILDING`, `SELL_RESOURCE`, `CLAIM_REWARD`.
* `cost_amount` (DECIMAL)
* `created_at` (TIMESTAMP)

ERD
<img width="893" height="650" alt="Screenshot 2026-05-17 183843" src="https://github.com/user-attachments/assets/1cf6c4bf-ef9a-4aad-afd6-36247e0b08c8" />

Flowchart
<img width="561" height="958" alt="Screenshot 2026-05-17 184658" src="https://github.com/user-attachments/assets/1a5fb162-46b2-446b-bf65-a6ba1ab8eecc" />

UML
<img width="973" height="961" alt="Screenshot 2026-05-17 184738" src="https://github.com/user-attachments/assets/666ffc15-aa7b-494d-89f7-c7cc7b4df8d7" />
---

## 4. Implementasi Database In-Memory (Redis)
1. **Daily News & Multiplier Cache:** Berita harian dan nilai *multiplier* efeknya di-*cache* di Redis. Saat *backend* merespons *request* dari Godot untuk menghitung pembaruan sumber daya, sistem membaca nilai pengali secara instan dari Redis, menghindari *bottleneck* kueri di PostgreSQL.
2. **Global Leaderboard:** Redis tipe *Sorted Sets* digunakan untuk menyimpan *ranking* pemain berdasarkan total *Net Worth* secara *real-time*, yang akan ditarik oleh klien Godot untuk ditampilkan di UI papan peringkat.
3. **Session & Rate Limiting:** Mengamankan *endpoint* API Express.js agar pemain tidak memanipulasi *request* HTTP (contoh: melakukan *spam click* klaim sumber daya dari klien modifikasi).

---


## 5. Pembagian Tugas Kelompok (SOP Compliant)
### Anggota 1: (Ketua & Lead Backend/Database)
* **Tugas Teknis:** Merancang struktur tabel PostgreSQL (DDL/DML) dan mengembangkan REST API dengan Express.js untuk logika *Resource Production*, sistem autentikasi, serta pendistribusian *News Effect*.
* **Tugas Administratif:** 
    * Membuat repositori GitHub kelompok, merapikan struktur, dan mengundang asisten/mentor.
    * Bertanggung jawab mengekspor database PostgreSQL menjadi `export.sql` beserta *dummy data*.
    * Melakukan manajemen versi (*Git flow*) antara sistem API dan klien game.

### Anggota 2: (Lead Game & UI Developer)
* **Tugas Teknis:** Mengembangkan antarmuka game dan elemen visual menggunakan **Godot Engine**. Membangun halaman visualisasi kota, *dashboard* gamifikasi berita, animasi UI, dan *scripting* GDScript untuk komunikasi HTTP ke *backend*.
* **Tugas Administratif:** 
    * Memastikan *project* Godot tertata rapi (*scene management*, *script organization*) yang memenuhi 10% nilai kualitas kode.
    * Melakukan integrasi antara *client* Godot dengan REST API Node.js.

### Anggota 3: (System Analyst & Technical Documentation)
* **Tugas Teknis:** Menulis narasi konten berita (*news copy*), merancang mekanisme *balance* permainan gamifikasi (nilai *base rate* dan *multiplier*), serta menyusun spesifikasi API untuk konsumsi Godot.
* **Tugas Administratif:**
    * Membuat Skenario Database dan Aplikasi: **UML**, **Flowchart**, dan **ERD**.
    * Menyusun file `ReadMe.md` lengkap di GitHub (instruksi *setup* Node.js, cara impor *project* ke editor Godot, dsb).

### Anggota 4: (Project Manager & DevOps/QA)
* **Tugas Teknis:** Melakukan *setup* Redis, melakukan *Export & Deployment* aplikasi (ekspor Godot ke Web/HTML5 di Vercel, *deploy backend* ke *cloud*), dan pengujian (QA) fungsionalitas komunikasi *Client-Server*.
* **Tugas Administratif:**
    * Membuat presentasi (**PPT Laporan**) untuk demo akhir.
    * Menjadwalkan **Progress Report** dengan mentor (minimal 2 kali) dan mengumpulkan dokumentasi/notulensinya.
