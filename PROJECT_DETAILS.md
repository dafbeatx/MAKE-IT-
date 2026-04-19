# MAKE!T Document Generator — Technical Project Details

## 1. Ikhtisar Sistem (System Overview)
MAKE!T v2 adalah aplikasi full-stack generator dokumen bertaraf akademik yang memisahkan arsitektur *frontend* dan *backend* secara bersih (headless paradigm). 
Tujuan utamanya adalah: **100% Bebas API LLM**, sistem akan memproses data berbasis *template* (*deterministic*), serta mengutamakan presisi cetak berstandar Microsoft Word. Desain UI/UX bersifat konsisten, modern, responsif, dan siap-mobile (PWA).

Aplikasi ini melingkupi tiga gerbang utama antarmuka pengguna: Website (Desktop & Mobile), dan Bot Telegram.

---

## 2. Arsitektur Frontend
**Direktori Utama:** `/frontend`
**Teknologi:** Next.js 15 (App Router), TypeScript, Tailwind CSS v3/v4, shadcn/ui.

### Konsep Desain
1. **Mobile-First & PWA:** Semua komponen dirancang menggunakan utilitas responsif Tailwind (contoh: ukuran font 16px standar iOS, tombol minimal berukuran `h-10`/`h-12` `w-44px` per standar aksesibilitas).
2. **Theming:** Fitur transisi mulus menggunakan `next-themes` dari shadcn/ui yang memungkinkan transisi dari Mode Gelap (*Dark Mode*) ke Mode Terang (*Light Mode*).
3. **PWA Offline**: Diatur melalui `manifest.json` dan `sw.js` (Service Worker caching statis), memungkinkan instalasi aplikasi seketika tanpa peramban (browser).

### Struktur Komponen & *Routing* Utama:
- **`app/page.tsx` (Landing Page)**: 
  Gerbang utama (*Hero, Features, CTA*). Mengarahkan user menuju Wizard.
- **`app/wizard/...` (Modul Onboarding)**: 
  Mesin perakit status (FSM) untuk melacak input step-by-step:
  - Step 1: `Tipe Dokumen` (Skripsi/Makalah).
  - Step 2: Menata urutan *Bab* & *Subbab*.
  - Step 3: Mengunggah Identitas Diri (mendukung format Markdown miring `*teks*` otomatis).
  - Step 4: Menentukan format (Standar A/B/C).
  *Dilengkapi Sticky Mobile Navigation Tab*.
- **`app/editor/...` (Modul Penyunting Data)**: 
  Sistem *Accordion* vertikal. Mengurangi sesak layar. Tiap seksi terdapat form teks besar. 
- **`app/preview/...` (Mesin Peninjau Dokumen)**:
  Ruang presisi tingkat-piksel yang merepresentasikan ukuran asli `A4 (210mm x 297mm)`. Di sini kustomisasi dokumen (sampul, margin, format *Heading*, perataan vertikal) dievaluasi dengan kontrol pembesaran (zoom in/out). Fitur unggulan: **Markdown Auto-Italicizer** (merender `*kata*` asing secara langsung di web).
- **`app/rapikan/...` (Modul Perapian Word)**:
  Modul untuk mengunggah berkas `DOCX` eksisting agar di-reformat oleh backend murni menjadi tatanan yang rapi.

---

## 3. Arsitektur Backend & Pemrosesan Data
**Direktori Utama:** `/backend`
**Teknologi:** FastAPI (Python), python-docx (Manipulasi Word XML), docxtpl (Mesin Template Jinja2), pandas & pyreadstat (Pemrosesan Data Statistik).

### Endpoints (Microservices)
1. **`POST /api/generate`**:
   Sistem membaca relasi `GenerateRequest` (Identitas, Bab, dan Pengaturan Margin/Font). Mesin python-docx secara prosedural akan:
   - Membangun XML dengan margin dan tipografi yang akurat.
   - Mengelompokkan elemen *Cover* secara vertikal (*clustering*) presisi ala Microsoft Word.
   - Menyuntikkan **Detektor Markdown Cerdas** berbasis Python `re` (*Regular Expression*) untuk secara *native* melakukan cetak miring (*italic*) pada frasa asing di berkas akhir `.docx`.
2. **`POST /api/rapikan`**:
   Sistem membongkar berkas `.docx` unggahan pengguna dari memori (tanpa disimpan), memindai blok-blok paragraf dan melakukan penimpaan format berdasarkan konfigurasi `format_preset.json` sebelum dilempar kembali berwujud iterasi biner.
3. **`POST /api/spss-table` (Pemrosesan Lanjutan Analytics)**:
   Modul ini merancang penggabungan _library_ Pandas dan PyReadStat agar entitas fail .sav atau excel diurai menjadi "Describe/Summary Statistics" dan otomatis digambar ulang di file Microsoft Word tabel Grid.
4. **`POST /api/template/render`**:
   Infrastruktur tingkat lanjut jika mahasiswa universitas swasta membuat sendiri desain amplop *template* berekstensi *docx* berisikan kode Jinja `{{ placeholder }}` agar terisi mandiri dari struktur data yang ditransmisikan.

---

## 4. Telegram Bot
**Direktori Utama:** `/telegram-bot`
**Teknologi:** aiogram 3.x (Asynchronous Python framework) berbasis status FSM.

- Integrasi terpadu memanggil server FastAPI langsung dari percakapan bot.
- Terdapat struktur *State* seperti antrean Website: Mengumpan judul, bab, lalu mengetik konten, setelah usai akan ter-_render_ otomatis.

---

## 5. Konfigurasi Khusus
Semua terbungkus rapat pada utilitas di berkas akar:
1. Skema Database Supabase diekspor via **`supabase_schema.sql`** berisikan validasi PostgreSQL RLS.
2. Lingkungan sandi di file **`.env`** disinkronisasi untuk mengekspos Public API.
3. Kinerja UI disandarkan seratus persen pada `tailwind.config`, utilitas kelas tailwind (`cn()`), serta pustaka kelas `lucide-react` untuk merender tipografi visual ikon modern.
