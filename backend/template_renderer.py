"""
MAKE!T — Jinja2-based Word template renderer using docxtpl.
For advanced template-based document generation where users can upload
their own .docx templates with {{ placeholder }} syntax.
"""

import io
from docxtpl import DocxTemplate
from fastapi import UploadFile
from pydantic import BaseModel
from typing import Dict, Any


def render_template(template_path: str, context: Dict[str, Any]) -> io.BytesIO:
    """
    Render a .docx template (Jinja2 syntax) with the given context data.
    
    Template placeholders:
      {{ title }}       - Judul dokumen
      {{ name }}        - Nama penulis
      {{ nim }}         - NIM/NIP
      {{ institution }} - Institusi
      {{ faculty }}     - Fakultas/Prodi
      {{ supervisor }}  - Pembimbing
      {{ year }}        - Tahun
      
    Loop example:
      {% for chapter in chapters %}
        {{ chapter.title }}
        {{ chapter.content }}
      {% endfor %}
    """
    doc = DocxTemplate(template_path)
    doc.render(context)
    
    buffer = io.BytesIO()
    doc.save(buffer)
    buffer.seek(0)
    return buffer


async def render_uploaded_template(
    template_file: UploadFile,
    context: Dict[str, Any],
) -> io.BytesIO:
    """
    Render a user-uploaded .docx template with Jinja2 context.
    The user uploads their own template with {{ placeholders }}.
    """
    content = await template_file.read()
    tmp_buffer = io.BytesIO(content)
    
    doc = DocxTemplate(tmp_buffer)
    doc.render(context)
    
    output = io.BytesIO()
    doc.save(output)
    output.seek(0)
    return output
