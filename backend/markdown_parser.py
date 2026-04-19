import re

def parse_markdown_to_runs(paragraph, text: str, apply_typography_fn, config, size_pt: int, base_bold: bool = False, uppercase: bool = False):
    """
    Parses a string containing *italic*, _italic_, **bold**, and __bold__ tokens.
    Transforms them into discrete docx.Run sequences attached to the given paragraph.
    Avoids LLM usage or external heavy AST tree wrappers by explicitly building a linear state array.
    """
    if not text:
        return
        
    if uppercase:
        text = text.upper()
        
    # Split text by bold/italic combinations but preserve delimiters to manually calculate parity.
    # We prioritize ** / __ over * / _
    parts = re.split(r'(\*\*.*?\*\*|__.*?__|\*.*?\*|_.*?_)', text)
    
    for part in parts:
        if not part:
            continue
            
        is_bold = base_bold
        is_italic = False
        
        # Check for bold markers (length 2 markers)
        if (part.startswith('**') and part.endswith('**')) or (part.startswith('__') and part.endswith('__')):
            if len(part) >= 4:
                part = part[2:-2]
                is_bold = True
        # Check for italic markers (length 1 markers, only if not matched as bold)
        elif (part.startswith('*') and part.endswith('*')) or (part.startswith('_') and part.endswith('_')):
            if len(part) >= 2:
                part = part[1:-1]
                is_italic = True
                
        run = paragraph.add_run(part)
        # Assuming apply_typography_fn is backend.engine.apply_typography(run, config, size, bold, italic)
        apply_typography_fn(run, config, size_pt, bold=is_bold, italic=is_italic)
