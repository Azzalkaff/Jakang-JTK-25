# Product Concept: Jakang JTK 25 Digital Hub

## 1. The Core Vision
Sebagai Principal Product Designer, saran pertama saya: **Berhentilah memikirkan ini sebagai "halaman web untuk menampilkan gambar jaket"**. Pikirkan ini sebagai **"Monumen Digital"** dan **"Buku Tahunan Interaktif"** untuk angkatanmu. 

Mengingat jaket baru dibagikan hari ini, euforianya sedang berada di puncaknya. Web ini harus menjadi tempat perayaan identitas, simbol kebanggaan (Informatics Engineering JTK), dan kenang-kenangan yang bisa mereka simpan (dan pamerkan) selamanya.

---

## 2. Fitur Unik & Bermanfaat (The "Wow" Factor)

Untuk memberikan kontribusi yang *stand-out* dan bermanfaat, kita harus bergerak lebih dari sekadar *landing page* statis. Berikut adalah ide fitur yang bisa kamu bangun:

### A. "Claim Your Identity" (Digital Roster)
- **Masalah:** Semua orang punya jaket yang sama. Bagaimana membuat pengalaman ini personal?
- **Solusi:** Buat fitur "Klaim Jaket". Mahasiswa bisa memasukkan NIM mereka untuk "meng-klaim" jaket secara digital.
- **Experience:** Setelah memasukkan NIM, muncul animasi kartu 3D (*Digital ID Card*) dengan nama mereka, foto mereka memakai jaket (bisa di-upload), dan kolom untuk menuliskan 1 kalimat *quote* angkatan. Data ini masuk ke *Wall of Fame* yang bisa dilihat semua orang.

### B. Interactive Care Guide (Panduan Perawatan Ala Anak IT)
- **Masalah:** Mahasiswa sering sembarangan mencuci jaket (lupa dibalik, disetrika di atas sablon/bordir), sehingga cepat rusak.
- **Solusi:** Buat panduan perawatan yang interaktif dan *engaging*.
- **Experience:** Gunakan analogi pemrograman. 
  Contoh: 
  ```javascript
  if (washingMachine.temperature > 30) { 
      throw new Error("Suhu terlalu panas, bahan canvas bisa susut!"); 
  }
  ```

### C. The Story of The Threads (Scroll-telling Filosofi)
- **Solusi:** Ceritakan setiap elemen jaket melalui interaksi *scroll-telling*.
- **Experience:** Saat pengguna men-scroll ke bawah, gambar jaket (Tampak Depan/Belakang) tetap *sticky* di tengah layar, sementara garis-garis petunjuk (*tooltips*) perlahan muncul mengarah ke logo lengan, bordir punggung, dan patch dada untuk menjelaskan filosofi dan makna di baliknya secara sinematik.

### D. Easter Eggs Khusus Angkatan
- **Solusi:** Sembunyikan lelucon internal (*inside jokes*) atau rahasia yang hanya dimengerti oleh angkatan kalian.
- **Experience:** Jika pengguna mengetikkan kata kunci rahasia di *keyboard* (misal: mengetik `JTK25`), layar tiba-tiba berubah menjadi terminal retro hijau bergaya *Matrix* yang berisi pesan tersembunyi dari ketua angkatan.

---

## 3. UI/UX & Design Language

Karena basis pengguna adalah **Teknik Informatika**, *vibe* desain harus memadukan kesan elegan, teknis, dan *modern*.

- **Aestetik:** Gunakan *Deep/Midnight Blue* sebagai warna latar belakang (mengambil aksen dari jaket) dipadukan dengan efek *Glassmorphism* (kartu-kartu transparan yang *blur*) untuk memberikan kesan premium.
- **Tipografi:** Gunakan font *monospace* (seperti JetBrains Mono) untuk elemen dekoratif angka/detail teknis, dan font Sans Serif modern (seperti Plus Jakarta Sans atau Inter) untuk kemudahan membaca.
- **Micro-interactions:** Tambahkan efek *hover* magnetik pada tombol.
- **Animasi Loading:** Animasi terminal *booting up* (misal: `Loading JTK_25_Identity.exe [||||||||||] 100%`) sebelum web utama terbuka. Ini akan sangat *relatable* bagi anak IT.

---

## 4. Rencana Eksekusi (MVP Strategy)

Karena momentum pembagian jaket adalah **HARI INI**, kecepatan eksekusi sangat penting. Bagikan peluncuran web ini dalam dua fase:

### Fase 1: The Hype (Malam Ini / Besok Pagi)
Fokus peluncuran MVP (*Minimum Viable Product*).
- Gunakan *template* web (Vite+Tailwind) yang sudah kita buat hari ini.
- Pastikan animasi masuk (hero section), galeri foto yang sudah diubah ke aset nyata, dan cerita filosofi sudah sempurna.
- Berikan efek *Loading* sederhana ala terminal, lalu sebarkan link-nya di grup angkatan malam ini dengan *copywriting* yang menggugah.

### Fase 2: The Legacy (Minggu Depan)
- Mulai kembangkan fitur basis data (seperti "Claim Your Identity") menggunakan Supabase atau Firebase agar mahasiswa bisa mulai berinteraksi dan mengunggah foto mereka.

> **Advice dari Principal Designer:** 
> *"Sesuatu yang fungsional membuat pengguna bertahan, tetapi sesuatu yang personal dan emosional membuat mereka mengingat. Jaket ini bukan sekadar kain, ia adalah kebanggaan angkatan. Tugas desainmu hari ini adalah menerjemahkan rasa bangga itu menjadi piksel interaktif di layar mereka."*
