import asyncio
import os
import io
import logging
import aiohttp  # type: ignore
from aiogram import Bot, Dispatcher, types, F  # type: ignore
from aiogram.filters.command import Command  # type: ignore
from aiogram.fsm.context import FSMContext  # type: ignore
from aiogram.fsm.state import State, StatesGroup  # type: ignore
from aiogram.types import BufferedInputFile  # type: ignore
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO)

TELEGRAM_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "")
API_BASE = os.getenv("API_BASE_URL", "http://127.0.0.1:8000")

bot = Bot(token=TELEGRAM_TOKEN) if TELEGRAM_TOKEN else None
dp = Dispatcher()


# ─── FSM States ─────────────────────────────────────────

class DocWizard(StatesGroup):
    doc_type = State()
    title = State()
    name = State()
    nim = State()
    institution = State()
    writing_bab = State()  # user sends content per chapter


# ─── /start ─────────────────────────────────────────────

@dp.message(Command("start"))
async def cmd_start(message: types.Message, state: FSMContext):
    await state.clear()
    await message.answer(
        "👋 Selamat datang di *MAKE!T Bot*\\!\n\n"
        "Saya membantu Anda menyusun dokumen akademik \\(Skripsi, Makalah, Laporan\\) "
        "dengan format rapi\\. Anda yang menulis, saya yang merapikan\\.\n\n"
        "Pilih tipe dokumen:\n"
        "1\\. Skripsi\n"
        "2\\. Tesis\n"
        "3\\. Makalah\n"
        "4\\. Laporan KP/PKL\n"
        "5\\. Laporan Praktikum\n"
        "6\\. Surat Resmi\n\n"
        "Ketik angka pilihannya \\(misal: `1`\\)",
        parse_mode="MarkdownV2",
    )
    await state.set_state(DocWizard.doc_type)


@dp.message(DocWizard.doc_type)
async def process_doc_type(message: types.Message, state: FSMContext):
    type_map = {
        "1": "Skripsi", "2": "Tesis", "3": "Makalah",
        "4": "Laporan KP/PKL", "5": "Laporan Praktikum", "6": "Surat Resmi",
    }
    doc_type = type_map.get(message.text or "", message.text or "Skripsi")
    await state.update_data(doc_type=doc_type)
    await message.answer(
        f"✅ Tipe: *{doc_type}*\n\n"
        "Sekarang kirimkan *judul dokumen* Anda:",
        parse_mode="Markdown",
    )
    await state.set_state(DocWizard.title)


@dp.message(DocWizard.title)
async def process_title(message: types.Message, state: FSMContext):
    await state.update_data(title=message.text or "")
    await message.answer("👤 Siapa *nama lengkap* Anda?", parse_mode="Markdown")
    await state.set_state(DocWizard.name)


@dp.message(DocWizard.name)
async def process_name(message: types.Message, state: FSMContext):
    await state.update_data(name=message.text or "")
    await message.answer("🆔 Berapa *NIM / NIP* Anda?", parse_mode="Markdown")
    await state.set_state(DocWizard.nim)


@dp.message(DocWizard.nim)
async def process_nim(message: types.Message, state: FSMContext):
    await state.update_data(nim=message.text or "")
    await message.answer(
        "🏫 Tulis *nama institusi dan fakultas* Anda\n(contoh: Universitas Indonesia — Teknik Informatika)",
        parse_mode="Markdown",
    )
    await state.set_state(DocWizard.institution)


@dp.message(DocWizard.institution)
async def process_institution(message: types.Message, state: FSMContext):
    await state.update_data(institution=message.text or "")
    data = await state.get_data()
    await message.answer(
        f"📋 *Ringkasan Dokumen:*\n"
        f"• Tipe: {data.get('doc_type')}\n"
        f"• Judul: {data.get('title')}\n"
        f"• Nama: {data.get('name')}\n"
        f"• NIM: {data.get('nim')}\n"
        f"• Institusi: {message.text}\n\n"
        f"Sekarang kirimkan isi per bab.\n"
        f"Gunakan format:\n"
        f"`/bab 1 Pendahuluan`\n"
        f"Lalu ketik isi Bab 1 di pesan berikutnya.\n\n"
        f"Setelah selesai, ketik /generate untuk membuat file .docx",
        parse_mode="Markdown",
    )
    await state.update_data(chapters=[])
    await state.set_state(DocWizard.writing_bab)


@dp.message(DocWizard.writing_bab, Command("bab"))
async def add_bab(message: types.Message, state: FSMContext):
    parts = (message.text or "").replace("/bab", "").strip().split(maxsplit=1)
    bab_num = parts[0] if parts else "1"
    bab_title = parts[1] if len(parts) > 1 else f"Bab {bab_num}"
    data = await state.get_data()
    chapters = data.get("chapters", [])
    chapters.append({"id": bab_num, "title": f"Bab {bab_num}: {bab_title}", "content": ""})
    await state.update_data(chapters=chapters, current_bab=bab_num)
    await message.answer(
        f"📝 *Bab {bab_num}: {bab_title}*\n"
        f"Kirimkan isi bab ini sekarang (bisa beberapa pesan). Ketik /done_bab jika selesai.",
        parse_mode="Markdown",
    )


@dp.message(DocWizard.writing_bab, Command("done_bab"))
async def done_bab(message: types.Message, state: FSMContext):
    await message.answer(
        "✅ Bab disimpan.\n"
        "Kirim `/bab <nomor> <judul>` untuk bab berikutnya, "
        "atau `/generate` untuk membuat file .docx.",
        parse_mode="Markdown",
    )


@dp.message(DocWizard.writing_bab, Command("generate"))
async def generate_doc(message: types.Message, state: FSMContext):
    data = await state.get_data()
    chapters_raw = data.get("chapters", [])

    if not chapters_raw:
        await message.answer("⚠️ Belum ada bab yang ditambahkan. Gunakan /bab terlebih dahulu.")
        return

    await message.answer("⏳ Sedang membuat dokumen .docx...")

    # Build request payload for FastAPI
    payload = {
        "identity": {
            "title": data.get("title", "Dokumen"),
            "name": data.get("name", ""),
            "nim": data.get("nim", ""),
            "institution": data.get("institution", ""),
            "faculty": "",
            "supervisor": "",
            "year": "2024",
        },
        "chapters": [
            {
                "id": ch["id"],
                "title": ch["title"],
                "sections": [
                    {"id": f"{ch['id']}.1", "title": ch["title"], "content": ch.get("content", "")}
                ],
            }
            for ch in chapters_raw
        ],
    }

    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(f"{API_BASE}/api/generate", json=payload) as resp:
                if resp.status == 200:
                    file_bytes = await resp.read()
                    filename = f"MAKEIT_{data.get('name', 'doc').replace(' ', '_')}.docx"
                    doc_file = BufferedInputFile(file_bytes, filename=filename)
                    await message.answer_document(doc_file, caption="📄 Dokumen Anda siap!")
                else:
                    error_text = await resp.text()
                    await message.answer(f"❌ Gagal membuat dokumen: {error_text}")
    except Exception as e:
        await message.answer(f"❌ Error: {str(e)}")

    await state.clear()


@dp.message(DocWizard.writing_bab)
async def collect_content(message: types.Message, state: FSMContext):
    """Collect text content for the current chapter."""
    data = await state.get_data()
    chapters = data.get("chapters", [])
    current_bab = data.get("current_bab")

    if current_bab and chapters:
        for ch in chapters:
            if ch["id"] == current_bab:
                ch["content"] = (ch.get("content", "") + "\n" + (message.text or "")).strip()
                break
        await state.update_data(chapters=chapters)
        await message.answer("✍️ Teks ditambahkan. Kirim lagi atau ketik /done_bab jika selesai bab ini.")
    else:
        await message.answer("Gunakan /bab <nomor> <judul> untuk mulai menulis sebuah bab.")


# ─── /rapikan — Upload Word to be formatted ─────────────

@dp.message(Command("rapikan"))
async def cmd_rapikan(message: types.Message):
    await message.answer(
        "📎 Kirimkan file *.docx* Anda sekarang.\n"
        "Saya akan merapikan formatnya (margin, font, spasi) tanpa mengubah isi teks.",
        parse_mode="Markdown",
    )


@dp.message(F.document)
async def handle_document_upload(message: types.Message):
    """Handle uploaded .docx files for formatting."""
    doc = message.document
    if not doc or not doc.file_name or not doc.file_name.endswith(".docx"):
        await message.answer("⚠️ Tolong kirim file berformat .docx saja.")
        return

    await message.answer("⏳ Sedang merapikan dokumen...")

    try:
        file_info = await bot.get_file(doc.file_id)  # type: ignore
        file_bytes = await bot.download_file(file_info.file_path)  # type: ignore

        # Call API
        form_data = aiohttp.FormData()
        form_data.add_field("file", file_bytes, filename=doc.file_name, content_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document")
        form_data.add_field("format_preset", "standar-a")

        async with aiohttp.ClientSession() as session:
            async with session.post(f"{API_BASE}/api/rapikan", data=form_data) as resp:
                if resp.status == 200:
                    result_bytes = await resp.read()
                    result_file = BufferedInputFile(result_bytes, filename=f"RAPIKAN_{doc.file_name}")
                    await message.answer_document(result_file, caption="✅ Dokumen berhasil dirapikan!")
                else:
                    await message.answer(f"❌ Gagal: {await resp.text()}")
    except Exception as e:
        await message.answer(f"❌ Error: {str(e)}")


# ─── Main ───────────────────────────────────────────────

async def main():
    if TELEGRAM_TOKEN:
        logging.info("Starting MAKE!T Telegram Bot...")
        await dp.start_polling(bot)
    else:
        logging.warning("TELEGRAM_BOT_TOKEN not set. Bot will not start.")

if __name__ == "__main__":
    asyncio.run(main())
