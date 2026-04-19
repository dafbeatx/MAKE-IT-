from docx.shared import Cm, Pt
from docx.enum.text import WD_ALIGN_PARAGRAPH
from typing import Optional

def apply_margin(section, config):
    """Applies margin settings from the format config to a docx section."""
    section.top_margin = Cm(config.margin_top)
    section.bottom_margin = Cm(config.margin_bottom)
    section.left_margin = Cm(config.margin_left)
    section.right_margin = Cm(config.margin_right)

def apply_typography(run, config, size_pt: Optional[int] = None, bold: bool = False, italic: bool = False):
    """Applies font styles to a docx run based on format config."""
    run.font.name = config.font_name
    run.font.size = Pt(size_pt if size_pt else config.font_size_body)
    
    if bold:
        run.bold = True
    if italic:
        run.italic = True

def apply_heading(paragraph, level: int, config):
    """Applies paragraph-level heading formatting based on format config rules."""
    
    # Defaults
    alignment = WD_ALIGN_PARAGRAPH.LEFT
    
    if level == 1:
        if config.h1_center:
            alignment = WD_ALIGN_PARAGRAPH.CENTER
    elif level == 2:
        # Default left alignment for H2
        pass
    else:
        # Default left alignment for H3+
        pass
        
    paragraph.alignment = alignment

def format_heading_text(text: str, level: int, config) -> str:
    """Transforms heading text depending on the uppercase rule for the level."""
    if level == 1 and config.h1_uppercase:
        return text.upper()
    return text
