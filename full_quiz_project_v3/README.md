# Web Quiz App — v3 (OCR + Adda247 downloader + Admin add tools)

This repo includes:
- AdminAddQuestion (single question) and BulkCsvUploader (bulk CSV) components added to Admin page.
- Adda247 downloader (tools/download_papers_adda247.js) to fetch PDFs if available.
- OCR PDF extractor (tools/extract_pdf.py) to create data/pdf_extracted.json from PDFs in tools/pdfs/.
- Normalizer and CSV conversion tools.

Quick start:
1. Install Node deps: `npm ci`
2. Install Python OCR deps and Tesseract if you plan to process PDFs:
   `pip install pymupdf pillow pytesseract`
   Install Tesseract: `sudo apt-get install tesseract-ocr` (Linux) or use homebrew on Mac.
3. (Optional) Download papers from Adda247:
   `npm run download-adda` - saves PDFs to tools/pdfs/
4. Extract text from PDFs:
   `npm run pdf-extract` - writes data/pdf_extracted.json
5. Run HTML scraper:
   `npm run scrape` - writes data/scraped_drafts.json
6. Normalize:
   `npm run normalize` - writes generated/scraped_export.csv
7. Convert approved CSV to app data:
   `node tools/csv_to_questions.js generated/approved_questions.csv`
8. Start dev server: `npm run dev` and open http://localhost:5173/admin to add/approve questions.

Admin UI:
- Use Admin -> Add Question to add single Q (downloads CSV row you should append).
- Use Admin -> Bulk CSV Uploader to approve and download bulk rows.

Remember to respect site terms. This project assumes personal use as you indicated.
