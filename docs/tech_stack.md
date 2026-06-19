# Technology Stack: Jakang JTK 25

Dokumen ini merangkum arsitektur teknologi (*Tech Stack*) yang digunakan untuk membangun situs web perayaan dan platform utilitas pembagian Jaket Angkatan JTK 25.

Arsitektur ini dipilih secara spesifik untuk memenuhi kriteria: **Kecepatan Pengembangan Tinggi (Rilis dalam 1 Hari)**, **Kinerja Kilat**, dan **Desain Frontend Interaktif**.

---

## 1. Frontend (Client-Side)

### A. Core Framework & Bahasa
*   **HTML5:** Kerangka semantik utama.
*   **Vanilla TypeScript (`script.ts`):** Penulisan logika *frontend* interaktif secara murni tanpa *overhead framework* (seperti React/Vue), namun tetap diikat dengan keamanan *type-checking* TypeScript.
*   **Vite:** *Build tool* dan *dev server* super cepat yang memproses TypeScript dan me-*reload* modul secara instan (HMR).

### B. Styling & UI Design
*   **Tailwind CSS:** *Utility-first CSS framework* yang digunakan untuk membangun desain kompleks (termasuk *Glassmorphism*, tata letak asimetris, dan tipografi raksasa bergaya *Awwwards*) secara kilat tanpa menulis banyak file CSS eksternal.
*   **Vanilla CSS (`style.css`):** Digunakan secara minimal hanya untuk membuat efek-efek khusus yang sulit dilakukan oleh Tailwind standar, seperti *noise grain background*, *blinking cursor* terminal, dan manipulasi *text-stroke* khusus.
*   **FontAwesome (CDN):** Penyedia *icon-set* untuk tombol interaktif (seperti ikon hati, WhatsApp, dan *upload*).

### C. Moderation & State Management
*   **LocalStorage Ownership Tokens:** Mekanisme CRUD *frictionless* (tanpa login). Browser secara otomatis mencatat ID (UUID) dari setiap data yang dikirim pengguna. Dengan ID ini, pengguna diberikan akses eksklusif untuk menghapus postingan milik mereka sendiri selama mereka masih berada di perangkat dan *browser* yang sama.
*   **Console Admin Mode:** *Master backdoor* khusus untuk pemilik *website*. Dengan mengeksekusi perintah `enableAdmin()` langsung dari *Browser Developer Tools Console* dan memasukkan *password* rahasia, *admin* dapat memunculkan tombol hapus pada semua entri data untuk membersihkan *spam* atau konten yang tidak pantas.

---

## 2. Backend & Database (Server-Side)

Untuk mengejar *Minimum Viable Product* (MVP) dalam hitungan jam, kami tidak membangun *server backend* (Node.js/Express) dari nol. Kami memanfaatkan layanan **Backend-as-a-Service (BaaS)** modern:

*   **Supabase:** Alternatif *open-source* dari Firebase yang menjadi tulang punggung seluruh fitur dinamis web ini.
*   **Supabase PostgreSQL:** *Relational database* tingkat produksi yang digunakan untuk menampung dua fitur utama:
    *   `ootd_posts`: Tabel untuk menyimpan data partisipasi unggahan foto jaket beserta interaksi *Likes*.
    *   `size_exchanges`: Tabel untuk mengelola daftar tukar menukar ukuran jaket antar mahasiswa secara *real-time*.
*   **Supabase Storage:** S3-compatible *bucket* (`ootd_images`) yang difungsikan sebagai CDN untuk menampung *file* foto OOTD yang diunggah oleh mahasiswa.
*   **Supabase JS SDK (`@supabase/supabase-js`):** Pustaka antarmuka yang menghubungkan logika TypeScript di *frontend* langsung dengan *database* Supabase.

---

## 3. Deployment & Version Control

*   **Git:** Digunakan untuk *version control system* (VCS).
*   **GitHub:** *Repository hosting* (Target).
*   **.env Configuration:** Penggunaan variabel *environment* yang diinjeksi melalui fitur bawaan Vite (`import.meta.env`) untuk melindungi rahasia API Key Supabase agar tidak terekspos di publik GitHub.

---

## Ringkasan Alur Sistem
1. Pengguna memuat halaman statis yang dirender secara cepat oleh **Vite**.
2. Animasi UI (Terminal Booting, Matrix Easter Egg, Scroll Animations) ditangani seluruhnya oleh **Vanilla TypeScript**.
3. Saat pengguna mengisi *form upload* OOTD, **Supabase SDK** mengunggah foto ke **Storage**, mendapatkan URL publik, lalu menyisipkan datanya ke tabel **PostgreSQL**.
4. Komponen *Live Board* (Daftar Tukar Ukuran) memanggil API Supabase secara asinkron untuk memperbarui daftar data di layar tanpa memuat ulang halaman (*No-reload Fetching*).
