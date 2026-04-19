import os
import io
import base64
import tempfile
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional, List
from dotenv import load_dotenv
from docx import Document
from docx.shared import Pt, Cm, Inches
from docx.enum.text import WD_ALIGN_PARAGRAPH

load_dotenv()

app = FastAPI(
    title="MAKE!T Document Generator API",
    version="2.0.0",
    description="Template-based document generator. No AI — users write content, system formats it.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Models ─────────────────────────────────────────────

class Section(BaseModel):
    id: str
    title: str
    content: str
    quran: Optional[str] = None
    footnote: Optional[str] = None

class Chapter(BaseModel):
    id: str
    title: str
    sections: List[Section]

class Identity(BaseModel):
    title: str
    docSubtype: Optional[str] = None
    name: str
    nim: str
    institution: str
    faculty: str
    prodi: Optional[str] = None
    supervisor: str
    year: str
    year_hijri: Optional[str] = None
    degree_purpose: Optional[str] = None
    logo: Optional[str] = None
    address: Optional[str] = None

class FormatConfig(BaseModel):
    font_name: str = "Times New Roman"
    font_size_body: int = 12
    font_size_heading: int = 14       # legacy alias for h1
    font_size_h1: Optional[int] = None
    font_size_h2: Optional[int] = None
    font_size_h3: Optional[int] = None
    font_size_subtitle: Optional[int] = None
    line_spacing: float = 1.5
    h1_bold: bool = True
    h1_uppercase: bool = True
    h1_center: bool = True
    h2_bold: bool = True
    h3_bold: bool = True
    margin_top: float = 4.0
    margin_bottom: float = 3.0
    margin_left: float = 4.0
    margin_right: float = 3.0
    page_number_prelim: str = "roman"     # "roman" | "arabic" | "none"
    page_number_body: str = "arabic"      # "arabic" | "roman"
    numbering_system: str = "standard-indo"  # "standard-indo" | "numeric" | "custom"
    first_line_indent: float = 1.27
    has_quran: bool = False
    has_footnote: bool = False
    has_abstract: bool = False

    @property
    def h1_size(self) -> int:
        return self.font_size_h1 or self.font_size_heading

    @property
    def h2_size(self) -> int:
        return self.font_size_h2 or self.font_size_body

    @property
    def h3_size(self) -> int:
        return self.font_size_h3 or self.font_size_body

class GenerateRequest(BaseModel):
    docType: Optional[str] = None
    has_cover: Optional[bool] = False
    identity: Identity
    chapters: List[Chapter]
    format_config: FormatConfig = FormatConfig()
    abstract_paragraphs: Optional[List[str]] = None

# ─── Format Presets ─────────────────────────────────────

FORMAT_PRESETS = {
    "standar-a": FormatConfig(
        font_name="Times New Roman", font_size_body=12, font_size_heading=14,
        line_spacing=1.5, margin_top=4.0, margin_bottom=3.0, margin_left=4.0, margin_right=3.0,
    ),
    "standar-b": FormatConfig(
        font_name="Arial", font_size_body=11, font_size_heading=12,
        line_spacing=1.15, margin_top=2.54, margin_bottom=2.54, margin_left=2.54, margin_right=2.54,
    ),
    "standar-c": FormatConfig(
        font_name="Calibri", font_size_body=11, font_size_heading=13,
        line_spacing=1.5, margin_top=2.5, margin_bottom=2.5, margin_left=3.0, margin_right=2.5,
    ),
}

# ─── Document Generation Logic ─────────────────────────

def build_document(req: GenerateRequest) -> Document:
    doc = Document()
    fmt = req.format_config

    # Set margins
    for section in doc.sections:
        section.top_margin = Cm(fmt.margin_top)
        section.bottom_margin = Cm(fmt.margin_bottom)
        section.left_margin = Cm(fmt.margin_left)
        section.right_margin = Cm(fmt.margin_right)

    # ── Cover Page ──
    # Only generated when user explicitly enables "Sampul Depan" in Step 2.
    # No placeholder text — only renders data the user has actually filled in.
    if req.has_cover:

        def _add_centered_line(text: str, font_size: int, bold: bool = False, italic: bool = False, spacing_after: int = 0):
            """Helper to add a single centered line with consistent formatting."""
            p = doc.add_paragraph()
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            if spacing_after:
                p.paragraph_format.space_after = Pt(spacing_after)
            r = p.add_run(text)
            r.bold = bold
            r.italic = italic
            r.font.name = fmt.font_name
            r.font.size = Pt(font_size)

        def _add_logo(width_inches: float):
            """Helper to safely decode and insert a base64 logo."""
            if not req.identity.logo:
                return
            try:
                _header, encoded = req.identity.logo.split(",", 1)
                image_data = base64.b64decode(encoded)
                logo_io = io.BytesIO(image_data)
                logo_para = doc.add_paragraph()
                logo_para.alignment = WD_ALIGN_PARAGRAPH.CENTER
                logo_run = logo_para.add_run()
                logo_run.add_picture(logo_io, width=Inches(width_inches))
            except Exception as e:
                print("Failed to decode logo:", e)

        # 1. Judul Skripsi (from user data)
        if req.identity.title:
            title_text = req.identity.title
            if fmt.h1_uppercase:
                title_text = title_text.upper()
                
            _add_centered_line(
                title_text,
                fmt.h1_size,
                bold=fmt.h1_bold,
                spacing_after=12,
            )

        # 2. Doc Subtype (SKRIPSI / SEMINAR HASIL / etc.)
        if req.identity.docSubtype:
            _add_centered_line(
                req.identity.docSubtype.upper(),
                fmt.h2_size,
                bold=fmt.h2_bold,
                spacing_after=12,
            )

        doc.add_paragraph("")

        # 3. Degree Purpose Text
        if req.identity.degree_purpose:
            _add_centered_line(
                req.identity.degree_purpose,
                fmt.font_size_body,
                italic=True,
            )

        for _ in range(3):
            doc.add_paragraph("")

        # 4. Middle Logo (single, large, centered)
        _add_logo(1.8)

        for _ in range(3):
            doc.add_paragraph("")

        # 5. "Disusun Oleh:"
        _add_centered_line("Disusun Oleh:", fmt.font_size_body)

        # 6. Name & NIM
        if req.identity.name:
            _add_centered_line(req.identity.name.upper(), fmt.font_size_body, bold=True)

        if req.identity.nim:
            _add_centered_line(f"NIM: {req.identity.nim}", fmt.font_size_body, bold=True)

        for _ in range(2):
            doc.add_paragraph("")

        # 7. Institution block (Prodi → Fakultas → Institusi)
        institution_lines: list[str] = []
        if req.identity.prodi:
            institution_lines.append(f"PROGRAM STUDI {req.identity.prodi.upper()}")
        if req.identity.faculty:
            institution_lines.append(f"FAKULTAS {req.identity.faculty.upper()}")
        if req.identity.institution:
            institution_lines.append(req.identity.institution.upper())

        for text in institution_lines:
            _add_centered_line(text, fmt.font_size_body, bold=True)

        # 8. Address
        if req.identity.address:
            _add_centered_line(req.identity.address.upper(), fmt.font_size_body, bold=True)

        # 9. Years (Masehi / Hijriah)
        year_parts = [p for p in [req.identity.year, req.identity.year_hijri] if p]
        if year_parts:
            _add_centered_line(" / ".join(year_parts), fmt.font_size_body, bold=True)

        doc.add_page_break()

    # ── Abstract ──
    if fmt.has_abstract and req.abstract_paragraphs:
        doc.add_page_break()
        abs_h = doc.add_paragraph()
        abs_h.alignment = WD_ALIGN_PARAGRAPH.CENTER
        abs_run = abs_h.add_run("ABSTRAK")
        abs_run.bold = True
        abs_run.font.name = fmt.font_name
        abs_run.font.size = Pt(fmt.font_size_heading)
        doc.add_paragraph("")
        
        for para_text in req.abstract_paragraphs:
            if para_text.strip():
                p = doc.add_paragraph()
                p.paragraph_format.first_line_indent = Cm(fmt.first_line_indent)
                p.paragraph_format.line_spacing = fmt.line_spacing
                p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
                run = p.add_run(para_text.strip())
                run.font.name = fmt.font_name
                run.font.size = Pt(fmt.font_size_body)

        doc.add_page_break()

    # ── Chapters ──
    for chapter in req.chapters:
        # Chapter heading — respects h1_bold, h1_uppercase, h1_center
        chapter_title_parts = chapter.title.split(":", 1)
        bab_number = chapter_title_parts[0].strip()
        bab_name = chapter_title_parts[1].strip() if len(chapter_title_parts) > 1 else ""

        if fmt.h1_uppercase:
            bab_number = bab_number.upper()
            bab_name = bab_name.upper()

        h_para = doc.add_paragraph()
        h_para.alignment = WD_ALIGN_PARAGRAPH.CENTER if fmt.h1_center else WD_ALIGN_PARAGRAPH.LEFT
        run = h_para.add_run(bab_number)
        run.bold = fmt.h1_bold
        run.font.name = fmt.font_name
        run.font.size = Pt(fmt.h1_size)

        if bab_name:
            h_para2 = doc.add_paragraph()
            h_para2.alignment = WD_ALIGN_PARAGRAPH.CENTER if fmt.h1_center else WD_ALIGN_PARAGRAPH.LEFT
            run2 = h_para2.add_run(bab_name)
            run2.bold = fmt.h1_bold
            run2.font.name = fmt.font_name
            run2.font.size = Pt(fmt.h1_size)

        doc.add_paragraph("")

        for section in chapter.sections:
            # Section heading — uses h2_size, h2_bold
            s_para = doc.add_paragraph()
            s_run = s_para.add_run(section.title)
            s_run.bold = fmt.h2_bold
            s_run.font.name = fmt.font_name
            s_run.font.size = Pt(fmt.h2_size)

            # Content paragraphs
            if section.content.strip():
                for para_text in section.content.strip().split("\n"):
                    if para_text.strip():
                        p = doc.add_paragraph()
                        p.paragraph_format.first_line_indent = Cm(fmt.first_line_indent)
                        p.paragraph_format.line_spacing = fmt.line_spacing
                        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
                        run = p.add_run(para_text.strip())
                        run.font.name = fmt.font_name
                        run.font.size = Pt(fmt.font_size_body)

            # Insert Quran text if configured and present
            if fmt.has_quran and section.quran and section.quran.strip():
                q_para = doc.add_paragraph()
                q_para.alignment = WD_ALIGN_PARAGRAPH.RIGHT
                q_para.paragraph_format.line_spacing = 2.0
                q_run = q_para.add_run(section.quran.strip())
                # Quran is typically rendered larger
                q_run.font.size = Pt(fmt.font_size_body + 6)
                
            # Insert Endnotes/Footnotes workaround if configured and present
            if fmt.has_footnote and section.footnote and section.footnote.strip():
                fn_para = doc.add_paragraph()
                fn_para.paragraph_format.space_before = Pt(6)
                fn_para.alignment = WD_ALIGN_PARAGRAPH.LEFT
                fn_run = fn_para.add_run("______________________________" + "\n" + section.footnote.strip())
                fn_run.font.name = fmt.font_name
                fn_run.font.size = Pt(10)

            doc.add_paragraph("")

        doc.add_page_break()

    return doc


# ─── Endpoints ──────────────────────────────────────────

@app.get("/")
def read_root():
    return {"app": "MAKE!T", "version": "2.0.0", "ai": False}


@app.post("/api/generate")
async def generate_document(req: GenerateRequest):
    """Generate a .docx from user-provided content. No AI involved."""
    try:
        doc = build_document(req)
        buffer = io.BytesIO()
        doc.save(buffer)
        buffer.seek(0)

        filename = f"MAKEIT_{req.identity.name.replace(' ', '_')}.docx"
        return StreamingResponse(
            buffer,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            headers={"Content-Disposition": f'attachment; filename="{filename}"'},
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/rapikan")
async def rapikan_document(
    file: UploadFile = File(...),
    format_preset: str = Form("standar-a"),
):
    """Upload a .docx and apply academic formatting without changing text content."""
    if not file.filename or not file.filename.endswith(".docx"):
        raise HTTPException(status_code=400, detail="File harus berformat .docx")

    fmt = FORMAT_PRESETS.get(format_preset, FORMAT_PRESETS["standar-a"])

    try:
        content = await file.read()
        doc = Document(io.BytesIO(content))

        # Apply margins
        for section in doc.sections:
            section.top_margin = Cm(fmt.margin_top)
            section.bottom_margin = Cm(fmt.margin_bottom)
            section.left_margin = Cm(fmt.margin_left)
            section.right_margin = Cm(fmt.margin_right)

        # Apply font and spacing to all paragraphs
        for para in doc.paragraphs:
            para.paragraph_format.line_spacing = fmt.line_spacing
            for run in para.runs:
                run.font.name = fmt.font_name
                run.font.size = Pt(fmt.font_size_body)

        buffer = io.BytesIO()
        doc.save(buffer)
        buffer.seek(0)

        return StreamingResponse(
            buffer,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            headers={"Content-Disposition": f'attachment; filename="RAPIKAN_{file.filename}"'},
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/spss-table")
async def process_spss(file: UploadFile = File(...)):
    """Upload .sav or .xlsx → generate descriptive statistics table in Word."""
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")

    ext = file.filename.rsplit(".", 1)[-1].lower()
    if ext not in ("sav", "xlsx", "xls"):
        raise HTTPException(status_code=400, detail="Format harus .sav, .xlsx, atau .xls")

    try:
        content = await file.read()
        tmp_path = tempfile.mktemp(suffix=f".{ext}")
        with open(tmp_path, "wb") as f:
            f.write(content)

        if ext == "sav":
            import pyreadstat
            df, meta = pyreadstat.read_sav(tmp_path)
        else:
            import pandas as pd
            df = pd.read_excel(tmp_path)

        # Build Word doc with descriptive stats table
        doc = Document()
        doc.add_heading("Tabel Statistik Deskriptif", level=2)

        stats = df.describe().round(3)
        table = doc.add_table(rows=1, cols=len(stats.columns) + 1)
        table.style = "Light Grid Accent 1"

        # Header row
        hdr = table.rows[0].cells
        hdr[0].text = "Statistik"
        for i, col in enumerate(stats.columns):
            hdr[i + 1].text = str(col)

        # Data rows
        for idx, row in stats.iterrows():
            cells = table.add_row().cells
            cells[0].text = str(idx)
            for i, val in enumerate(row):
                cells[i + 1].text = str(val)

        # Apply font
        for row in table.rows:
            for cell in row.cells:
                for para in cell.paragraphs:
                    for run in para.runs:
                        run.font.name = "Times New Roman"
                        run.font.size = Pt(10)

        buffer = io.BytesIO()
        doc.save(buffer)
        buffer.seek(0)

        os.unlink(tmp_path)

        return StreamingResponse(
            buffer,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            headers={"Content-Disposition": f'attachment; filename="Tabel_{file.filename}.docx"'},
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/template/render")
async def render_custom_template(
    template: UploadFile = File(...),
    data: str = Form("{}"),
):
    """
    Upload a custom .docx template with Jinja2 {{ placeholders }}.
    Pass context data as JSON string to fill in the placeholders.
    """
    import json
    from template_renderer import render_uploaded_template  # type: ignore

    if not template.filename or not template.filename.endswith(".docx"):
        raise HTTPException(status_code=400, detail="Template harus .docx")

    try:
        context = json.loads(data)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Data harus berformat JSON valid")

    try:
        buffer = await render_uploaded_template(template, context)
        return StreamingResponse(
            buffer,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            headers={
                "Content-Disposition": f'attachment; filename="rendered_{template.filename}"'
            },
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
