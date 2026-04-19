# MAKE!T — Buat Dokumen Rapi dalam Sekejap

MAKE!T adalah platform Document Generator yang **100% GRATIS dan tanpa AI generative**. User mengisi konten di kolom yang disediakan, lalu sistem merangkai menjadi dokumen Word (.docx) yang rapi sesuai format akademik standar.

## 🚀 Fitur Utama
- ✅ **Wizard Multi-Step**: Alur 4 langkah untuk menentukan tipe, sistematika, identitas, dan format.
- ✅ **Editor Presisi**: Input teks per bab dengan sistem accordion yang bersih.
- ✅ **Preview Pixel-Perfect**: Peninjauan dokumen dengan tampilan A4 asli (Zoomable).
- ✅ **Rapikan File**: Upload .docx lama untuk diterapkan format akademik secara otomatis.
- ✅ **SPSS & Excel Integration**: Otomatisasi pembuatan tabel statistik deskriptif dari file .sav/.xlsx.
- ✅ **Progressive Web App (PWA)**: Dapat di-install di Android/iOS layaknya aplikasi asli.
- ✅ **Telegram Bot Integration**: Full flow melalui chat bot interaktif.
- ✅ **Format Global Kustomisasi**: Konfigurasi lengkap tipografi (H1/H2/H3/body), gaya heading (bold/uppercase/center), margin, nomor halaman (Roman + Arab), sistematika penomoran Indonesia (Bab I → A. → a. → 1). → a).), dan indentasi — dengan real-time preview.
- ✅ **Cover 100% Manual**: Anda bisa dengan fleksibel menambahkan cover dari wizard, mengatur Layout centered dan mengunggah *Logo Institusi* (resolusi tinggi didukung).

## 🛠️ Tech Stack
- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui.
- **Backend**: FastAPI (Python), python-docx, docxtpl, pandas, pyreadstat.
- **Bot**: aiogram 3.x.
- **Database**: Supabase (Postgres).

---

## 💻 Cara Menjalankan Lokal

### 1. Prasyarat
- Node.js >= 18
- Python >= 3.10
- Git

### 2. Setup Project
```bash
git clone https://github.com/yourusername/make-it.git
cd make-it
cp .env.example .env
# Edit .env dengan kredensial Supabase & Telegram Anda
```

### 3. Jalankan Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```
**⚠️ PENTING:** Karena limitasi jaringan pada beberapa sistem Linux, akses website melalui alamat IPv4 eksplisit:
👉 **http://127.0.0.1:3000** atau **http://localhost:3000**

### 4. Jalankan Backend (FastAPI)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 5. Jalankan Telegram Bot
```bash
cd telegram-bot
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python bot.py
```

---

## 📱 Cara Install PWA di HP
1. Buka Chrome (Android) atau Safari (iOS).
2. Akses URL deployment Anda (misal: `https://makeit.vercel.app`).
3. Tap ikon **"Tiga Titik"** atau **"Share"**.
4. Pilih **"Add to Home Screen"** atau **"Instal Aplikasi"**.
5. MAKE!T akan muncul di daftar aplikasi HP Anda dengan ikon resmi.

## 🤖 Cara Setup Telegram Bot
1. Chat dengan [@BotFather](https://t.me/botfather) di Telegram.
2. Kirim `/newbot` dan ikuti langkahnya untuk mendapatkan Token.
3. Masukkan token tersebut ke file `.env` pada variabel `TELEGRAM_BOT_TOKEN`.
4. Pastikan Backend (FastAPI) sudah berjalan sebelum menjalankan `bot.py`.

---

**Dibuat dengan ❤️ oleh Antigravity untuk Efisiensi Akademik.**
*(100% Human Content — 0% AI Generative inside documents)*
