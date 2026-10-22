"""
CareerCompass AI - PDF Guide Generator Script
Generates a comprehensive, professional, beginner-friendly technical guide PDF
using ReportLab.
"""

import os
import sys
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    PageBreak,
    KeepTogether,
    HRFlowable
)
from reportlab.pdfgen import canvas

# ==========================================
# NUMBERED CANVAS FOR TWO-PASS "PAGE X OF Y"
# ==========================================
class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_page_decorations(self, page_count):
        if self._pageNumber == 1:
            # Skip header and footer on cover page
            return

        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))

        # Running Header
        self.drawString(45, 805, "CareerCompass AI: Complete Project Understanding Guide")
        self.drawRightString(550, 805, "Technical Reference & Viva Preparation")
        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.6)
        self.line(45, 798, 550, 798)

        # Running Footer
        self.line(45, 42, 550, 42)
        self.drawString(45, 30, "Educational Architecture & Implementation Guide  |  Engineering Career Discovery")
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(550, 30, page_str)

        self.restoreState()

print("NumberedCanvas initialized.")
