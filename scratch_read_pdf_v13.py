import pypdf
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
pdf_path = os.path.join(BASE_DIR, "app", "data", "reports", "PU333_Report_신지오(v13)_download_temp.pdf")

print("Opening PDF:", pdf_path)
reader = pypdf.PdfReader(pdf_path)
print("Total pages:", len(reader.pages))

output_path = os.path.join(BASE_DIR, "pdf_text_v13.txt")
with open(output_path, "w", encoding="utf-8") as f:
    for idx, page in enumerate(reader.pages):
        f.write(f"\n--- PAGE {idx + 1} ---\n")
        f.write(page.extract_text() or "")

print("Successfully written to:", output_path)
