import pypdf
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
pdf_path = os.path.join(BASE_DIR, "P333.최신v11.0", "PU333_04_보고서_신지오_v11.0.pdf")

# Handle NFD/NFC if needed
if not os.path.exists(pdf_path):
    import unicodedata
    target_dir_name = 'P333.최신v11.0'
    for item in os.listdir(BASE_DIR):
        if unicodedata.normalize('NFC', item) == 'P333.최신v11.0':
            target_dir_name = item
            break
    P333_DIR = os.path.join(BASE_DIR, target_dir_name)
    pdf_file_name = 'PU333_04_보고서_신지오_v11.0.pdf'
    for item in os.listdir(P333_DIR):
        if unicodedata.normalize('NFC', item) == 'PU333_04_보고서_신지오_v11.0.pdf':
            pdf_file_name = item
            break
    pdf_path = os.path.join(P333_DIR, pdf_file_name)

print("Opening PDF:", pdf_path)
reader = pypdf.PdfReader(pdf_path)
print("Total pages:", len(reader.pages))

output_path = os.path.join(BASE_DIR, "pdf_text.txt")
with open(output_path, "w", encoding="utf-8") as f:
    for idx, page in enumerate(reader.pages):
        f.write(f"\n--- PAGE {idx + 1} ---\n")
        f.write(page.extract_text() or "")

print("Successfully written to:", output_path)
