#!/usr/bin/env python3
"""Extract text from all PDFs in a folder (uses PyMuPDF + pytesseract for OCR when needed)
Usage: python3 tools/extract_pdf.py tools/pdfs
Outputs: data/pdf_extracted.json
"""
import sys, os, json, re
try:
    import fitz
    from PIL import Image
    import io
    import pytesseract
except Exception as e:
    print('Missing Python deps. Install: pip install pymupdf pillow pytesseract')
    raise

def extract_pdf(path):
    doc = fitz.open(path)
    text = ''
    for page in doc:
        t = page.get_text('text')
        if t.strip():
            text += t + '\n'
        else:
            pix = page.get_pixmap(dpi=200)
            img = Image.open(io.BytesIO(pix.tobytes()))
            ocr = pytesseract.image_to_string(img)
            text += ocr + '\n'
    return text

def split_to_questions(text):
    parts = re.split(r'\n+(?=\s*(?:Q\d+|\d+\.|\d+\)))', text)
    out = []
    for p in parts:
        lines = [l.strip() for l in p.split('\n') if l.strip()]
        if len(lines) < 2: continue
        q = lines[0]
        opts = [l for l in lines[1:6] if re.match(r'^[A-D\(\)1-4]', l) or len(l.split())<12]
        if len(opts) >= 2:
            opts_clean = [re.sub(r'^[A-D\(\)\d\.\)\s]*','',o) for o in opts]
            out.append({'question': q, 'options': opts_clean, 'source': path})
    return out

if __name__ == '__main__':
    folder = sys.argv[1] if len(sys.argv)>1 else 'tools/pdfs'
    results = []
    for fn in os.listdir(folder):
        if not fn.lower().endswith('.pdf'): continue
        p = os.path.join(folder, fn)
        print('Extracting', p)
        txt = extract_pdf(p)
        qs = split_to_questions(txt)
        for q in qs:
            q['filename'] = fn
            results.append(q)
    os.makedirs('data', exist_ok=True)
    with open('data/pdf_extracted.json','w',encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    print('Wrote data/pdf_extracted.json', len(results), 'items')
