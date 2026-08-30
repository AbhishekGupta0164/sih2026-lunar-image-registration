from reportlab.platypus import SimpleDocTemplate, Paragraph, Image, Table
from reportlab.lib.styles import getSampleStyleSheet
doc = SimpleDocTemplate("test.pdf")
styles = getSampleStyleSheet()
elements = []
elements.append(Paragraph("Before Image", styles["Normal"]))
elements.append(Image("results/plot_coverage.png", width=400, height=300))
elements.append(Paragraph("After Image", styles["Normal"]))
doc.build(elements)
