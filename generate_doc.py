from pathlib import Path
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable, Image as RLImage, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
import re
import json

def generate_report():
    pdf_path = Path("docs/SELENE_MATCH_Project_Report.pdf")
    pdf_path.parent.mkdir(parents=True, exist_ok=True)
    
    doc = SimpleDocTemplate(
        str(pdf_path), pagesize=letter,
        leftMargin=50, rightMargin=50, topMargin=50, bottomMargin=50
    )
    styles = getSampleStyleSheet()
    elements = []
    
    navy_dark = colors.HexColor("#0B192C")
    navy_header = colors.HexColor("#1E3E62")
    cyan_accent = colors.HexColor("#00B4D8")
    text_dark = colors.HexColor("#1A202C")
    
    title_style = ParagraphStyle(
        "DocTitle", parent=styles["Heading1"],
        fontName="Helvetica-Bold", fontSize=20, leading=24,
        textColor=navy_dark, spaceAfter=8
    )
    h2_style = ParagraphStyle(
        "SectionH2", parent=styles["Heading2"],
        fontName="Helvetica-Bold", fontSize=14, leading=18,
        textColor=navy_header, spaceBefore=12, spaceAfter=8
    )
    h3_style = ParagraphStyle(
        "SectionH3", parent=styles["Heading3"],
        fontName="Helvetica-Bold", fontSize=12, leading=16,
        textColor=colors.HexColor("#2C5282"), spaceBefore=10, spaceAfter=6
    )
    body_style = ParagraphStyle(
        "Body", parent=styles["Normal"],
        fontName="Helvetica", fontSize=10, leading=15,
        textColor=text_dark, spaceAfter=10
    )
    list_style = ParagraphStyle(
        "List", parent=styles["Normal"],
        fontName="Helvetica", fontSize=10, leading=15,
        textColor=text_dark, spaceAfter=6, leftIndent=20
    )

    with open("docs/Project_Report.md", "r") as f:
        lines = f.readlines()
        
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        # Parse simple markdown bold
        line = re.sub(r'\*\*(.*?)\*\*', r'<b>\1</b>', line)
        
        # Check for image syntax ![alt](path)
        img_match = re.match(r'^!\[(.*?)\]\((.*?)\)$', line)
        if img_match:
            caption_text = img_match.group(1)
            img_path = img_match.group(2)
            if Path(img_path).exists():
                try:
                    # Enforce strict maximum bounds so viewers don't auto-rotate the page
                    img_el = RLImage(img_path, width=400, height=300, kind='proportional')
                    elements.append(Spacer(1, 10))
                    elements.append(img_el)
                    elements.append(Spacer(1, 5))
                    elements.append(Paragraph(f"<i>{caption_text}</i>", body_style))
                    elements.append(Spacer(1, 10))
                except Exception as e:
                    print(f"Error loading image {img_path}: {e}")
            else:
                print(f"Image not found: {img_path}")
            continue

        if line.startswith("# "):
            elements.append(Paragraph(line[2:], title_style))
            elements.append(HRFlowable(width="100%", thickness=2, color=cyan_accent, spaceBefore=5, spaceAfter=15))
        elif line.startswith("## 7. Diagnostic Outputs"):
            # Add a PageBreak before the final diagnostic section to prevent awkward text-wrapping
            elements.append(PageBreak())
            elements.append(Paragraph(line[3:], h2_style))
        elif line.startswith("## "):
            elements.append(Paragraph(line[3:], h2_style))
        elif line.startswith("### "):
            elements.append(Paragraph(line[4:], h3_style))
        elif line.startswith("- "):
            elements.append(Paragraph(u"\u2022 " + line[2:], list_style))
        elif line == "---":
            elements.append(HRFlowable(width="100%", thickness=1, color=colors.lightgrey, spaceBefore=15, spaceAfter=15))
        else:
            elements.append(Paragraph(line, body_style))
            
    # APPEND REAL METRICS FROM JSON
    try:
        with open("results/metrics.json", "r") as f:
            metrics = json.load(f)
            
        elements.append(Spacer(1, 15))
        elements.append(Paragraph("Project Diagnostic Metrics Matrix", h2_style))
        
        calc_data = [
            ["Metric Parameter", "Value", "Description"],
            ["Fit RMSE (Training GCPs)", f"{metrics.get('rmse_px', 0):.4f} px", "Root Mean Square Error (Sub-pixel accuracy)"],
            ["Fit RMSE (Metres)", f"{metrics.get('rmse_m', 0):.4f} m", "Physical error on lunar surface"],
            ["CE90 Circular Error", f"{metrics.get('ce90_px', 0):.4f} px", "90th percentile circular error radius"],
            ["Raw Match Candidates", str(metrics.get('n_raw', 0)), "Total initial correspondence candidates"],
            ["RANSAC / MAGSAC Inliers", str(metrics.get('n_inliers', 0)), "Robust geometric inlier GCP count"],
            ["Inlier Ratio", f"{metrics.get('inlier_ratio', 0) * 100:.1f}%", "Percentage of valid matches retained"],
            ["Nearest Neighbor Index (NNI)", f"{metrics.get('nni_index', 0):.4f}", "Spatial point dispersion (> 1.0 is Uniform)"],
            ["8x8 Grid Spatial Coverage", f"{metrics.get('grid_coverage_fraction', 0) * 100:.1f}%", "Overlap area covered by active GCP grid cells"],
        ]

        t_calc = Table(calc_data, colWidths=[150, 80, 250])
        t_calc.setStyle(
            TableStyle([
                ("BACKGROUND", (0, 0), (-1, 0), navy_header),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.whitesmoke),
                ("ALIGN", (0, 0), (-1, -1), "LEFT"),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTSIZE", (0, 0), (-1, -1), 9),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#F8FAFC")]),
            ])
        )
        elements.append(t_calc)
        
    except Exception as e:
        print(f"Metrics not appended: {e}")

    doc.build(elements)
    print(f"PDF successfully generated at: {pdf_path}")

if __name__ == "__main__":
    generate_report()
