from pypdf import PdfMerger

pdfs = [
    "docs/SELENE_MATCH_Project_Report.pdf",
    "docs/SELENE-MATCH_PS26166_Final_Blueprint.pdf"
]

merger = PdfMerger()

for pdf in pdfs:
    merger.append(pdf)

merger.write("docs/SELENE_MATCH_Final_Combined.pdf")
merger.close()

print("Successfully created docs/SELENE_MATCH_Final_Combined.pdf")
