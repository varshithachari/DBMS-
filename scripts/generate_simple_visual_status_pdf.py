import os
import sys
from PIL import Image as PILImage
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, Image
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_number(num_pages)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

    def draw_page_number(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        
        # Header (pages > 1)
        if self._pageNumber > 1:
            self.drawString(54, 750, "Chanakya Campus Connect · Load Test & Project Milestone Status")
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.5)
            self.line(54, 744, 558, 744)

        # Footer (all pages)
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(558, 36, page_text)
        self.drawString(54, 36, "ECS351 Project Status Report — Reviewed & Accepted by Evaluator")
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.5)
        self.line(54, 46, 558, 46)
        self.restoreState()

def get_scaled_image(path, target_width=470):
    im = PILImage.open(path)
    orig_w, orig_h = im.size
    aspect = orig_w / float(orig_h)
    target_height = target_width / aspect
    return Image(path, width=target_width, height=target_height)

def build_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    primary_color = colors.HexColor("#0F172A")    # Deep Slate
    accent_gold = colors.HexColor("#B45309")      # Amber
    accent_blue = colors.HexColor("#0284C7")      # Cyan Blue
    text_dark = colors.HexColor("#1E293B")
    bg_light = colors.HexColor("#F8FAFC")
    bg_green = colors.HexColor("#ECFDF5")
    bg_callout = colors.HexColor("#EFF6FF")

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=primary_color,
        spaceAfter=4
    )

    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=14,
        textColor=accent_gold,
        spaceAfter=8
    )

    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=11.5,
        leading=15,
        textColor=primary_color,
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['BodyText'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12.5,
        textColor=text_dark,
        spaceAfter=4
    )

    caption_style = ParagraphStyle(
        'Caption_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor("#475569"),
        alignment=1,
        spaceBefore=3,
        spaceAfter=6
    )

    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10.5,
        textColor=colors.white,
        alignment=1
    )

    table_cell_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=text_dark
    )

    story = []

    # Title & Header
    story.append(Paragraph("ECS351 · SOFTWARE ARCHITECTURE & DESIGN PATTERNS", subtitle_style))
    story.append(Paragraph("Project Milestone Status & Architectural Load Test Report", title_style))
    story.append(Paragraph("<b>Project:</b> Chanakya Campus Connect & UtsavHub Platform", ParagraphStyle('Sub', parent=body_style, fontName='Helvetica-Bold', fontSize=9.5, leading=13, textColor=colors.HexColor("#334155"))))
    
    # Milestone Status Highlight Box
    status_box_data = [
        [
            Paragraph("<b>Current Project Status:</b> <font color='#16A34A'><b>90% COMPLETED (ALMOST DONE)</b></font>", table_cell_style),
            Paragraph("<b>Evaluator Review Status:</b> <font color='#2563EB'><b>Presented Today & Accepted (Approved)</b></font>", table_cell_style)
        ],
        [
            Paragraph("<b>Architectural Comparison:</b> Verified & Demonstrated via Live Grafana Load Testing", table_cell_style),
            Paragraph("<b>Pending Minor Scope:</b> Minor Data Feed for Canteen/Food & Sports Facilities", table_cell_style)
        ]
    ]
    status_table = Table(status_box_data, colWidths=[250, 254])
    status_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), bg_light),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(status_table)
    story.append(Spacer(1, 8))

    # SECTION 1: PROJECT STATUS OVERVIEW
    story.append(Paragraph("1. PROJECT STATUS OVERVIEW", h1_style))
    story.append(Paragraph(
        "Our capstone project, <b>Chanakya Campus Connect</b>, is now <b>almost done (~90% complete)</b>. "
        "Today, we successfully delivered our formal review presentation to the course evaluator. "
        "The evaluator reviewed our implementation, our load testing results comparing <b>Modular Monolith</b> vs "
        "<b>Event-Driven Architecture</b>, and the live Grafana telemetry. He was satisfied with the demonstration and accepted our findings.<br/>"
        "All critical features — including multi-role production authentication, interactive campus navigation, UtsavHub fest registrations, "
        "and digital certificates — are fully operational. Only minor data entry for canteen menus and sports court schedules remains.",
        body_style
    ))
    story.append(Spacer(1, 6))

    # SECTION 2: SCREENSHOT EVIDENCE FROM TODAY'S PRESENTATION
    story.append(Paragraph("2. VERIFIED LOAD TEST SCREENSHOTS (FROM TODAY'S PRESENTATION)", h1_style))
    story.append(Paragraph(
        "Below are the actual screenshots captured directly from our live demonstration during the evaluation meeting:",
        body_style
    ))

    img_dir = os.path.join(os.path.dirname(__file__), '..', 'reports', 'images')
    if not os.path.exists(img_dir):
        img_dir = r"C:\Users\varsh\.gemini\antigravity\brain\c17c0aad-7935-417a-a196-552940ca816c\.user_uploaded"

    # Screenshot 1
    img1_path = os.path.join(img_dir, 'media_1794840915198_b0cf3076.jpg')
    if os.path.exists(img1_path):
        story.append(KeepTogether([
            get_scaled_image(img1_path, target_width=470),
            Paragraph("<b>Figure 1: Live Grafana Observability — HTTP Latency (p95), Throughput (RPS), and CPU Utilization</b>", caption_style),
            Paragraph(
                "<b>Simple Key Takeaway:</b><br/>"
                "• <b>Low Load (&lt;100 Users):</b> Modular Monolith is faster (<b>4.5 ms</b> vs <b>18.5 ms</b>) because it has zero queue serialization delay.<br/>"
                "• <b>High Load (400 Users):</b> Event-Driven Architecture dominates, scaling smoothly to <b>1,480 RPS</b>, while Monolith saturates at 380 RPS and collapses to 90 RPS due to thread contention.<br/>"
                "• <b>Crossover Zone:</b> The two lines intersect at <b>~90 to 110 virtual users</b>.",
                body_style
            )
        ]))
        story.append(Spacer(1, 8))

    # Screenshot 2
    img2_path = os.path.join(img_dir, 'media_1794840927893_30eb3b72.jpg')
    if os.path.exists(img2_path):
        story.append(KeepTogether([
            get_scaled_image(img2_path, target_width=470),
            Paragraph("<b>Figure 2: Memory Footprint (RAM MB), RabbitMQ Queue Depth, and HTTP Error Rate</b>", caption_style),
            Paragraph(
                "<b>Simple Key Takeaway:</b><br/>"
                "• <b>0.00% Packet Loss in EDA:</b> RabbitMQ message queues buffer sudden bursts so not a single student registration is dropped.<br/>"
                "• <b>Memory Trade-Off:</b> The Monolith uses less RAM (<b>180 MB</b>) while Event-Driven uses more (<b>274 MB</b>) to maintain message brokers and workers.",
                body_style
            )
        ]))
        story.append(Spacer(1, 8))

    story.append(PageBreak())

    # Screenshot 3
    img3_path = os.path.join(img_dir, 'media_1794840942572_7565da2c.jpg')
    if os.path.exists(img3_path):
        story.append(KeepTogether([
            get_scaled_image(img3_path, target_width=470),
            Paragraph("<b>Figure 3: 4-Quadrant Visualizer — Actual Performance Comparison & Theoretical Scaling Model</b>", caption_style),
            Paragraph(
                "<b>Simple Key Takeaway:</b><br/>"
                "• <b>Actual Performance (Left):</b> Clearly shows the crossover point marked at <b>~110 Virtual Users</b>. Beyond 110 users, Monolith latency climbs steeply (orange line), while Event-Driven stays flat (cyan line).<br/>"
                "• <b>Theoretical Model (Right):</b> Confirms the mathematical growth bounds ($O(N^{1.35})$ vs $O(N^{0.65})$).",
                body_style
            )
        ]))
        story.append(Spacer(1, 8))

    # Screenshot 4
    img4_path = os.path.join(img_dir, 'media_1794840959227_3a52108d.jpg')
    if os.path.exists(img4_path):
        story.append(KeepTogether([
            get_scaled_image(img4_path, target_width=470),
            Paragraph("<b>Figure 4: Performance Ratio (Monolith / Event-Driven) & Latency Difference Spread</b>", caption_style),
            Paragraph(
                "<b>Simple Key Takeaway:</b><br/>"
                "• <b>Ratio Graph (Left):</b> Starts below 1.0x (Monolith faster at 10 users), crosses the 1.0x line at 100 users, and shoots up to <b>4.8x at 400 users</b> in favor of Event-Driven.<br/>"
                "• <b>Difference Graph (Right):</b> Shows the absolute latency spread growing from -14ms up to <b>+146ms</b> under stress.",
                body_style
            )
        ]))
        story.append(Spacer(1, 8))

    # Screenshot 5
    img5_path = os.path.join(img_dir, 'media_1794840971554_3ede7ffe.jpg')
    if os.path.exists(img5_path):
        story.append(KeepTogether([
            get_scaled_image(img5_path, target_width=470),
            Paragraph("<b>Figure 5: Execution-Time Histograms (100 Users) & System Telemetry Scaling Grid</b>", caption_style),
            Paragraph(
                "<b>Simple Key Takeaway:</b><br/>"
                "• <b>Histograms:</b> Event-Driven Architecture produces a much tighter, more predictable bell-curve distribution with almost zero long-tail outlier delay.<br/>"
                "• <b>Latency Degradation:</b> Monolith crosses the red 20% SLA degradation limit at ~70 users, whereas Event-Driven stays safely below the limit.",
                body_style
            )
        ]))
        story.append(Spacer(1, 8))

    story.append(PageBreak())

    # SECTION 3: WHAT IS DONE VS WHAT IS PENDING
    story.append(Paragraph("3. STATUS OF PROJECT MODULES (WHAT IS COMPLETE VS PENDING)", h1_style))
    
    summary_data = [
        [
            Paragraph("<b>Feature / Module</b>", table_header_style),
            Paragraph("<b>Status</b>", table_header_style),
            Paragraph("<b>Summary Description</b>", table_header_style)
        ],
        [
            Paragraph("<b>Production Authentication</b>", table_cell_style),
            Paragraph("<font color='#16A34A'><b>COMPLETE</b></font>", table_cell_style),
            Paragraph("Bcrypt password hashing, secure session cookies, multi-role access (Student, Faculty, Admin), password reset.", table_cell_style)
        ],
        [
            Paragraph("<b>Architectural Comparison Lab</b>", table_cell_style),
            Paragraph("<font color='#16A34A'><b>COMPLETE & APPROVED</b></font>", table_cell_style),
            Paragraph("Dual implementation (Modular Monolith on :8001 vs Event-Driven on :8002), Grafana console, load testing verified by evaluator.", table_cell_style)
        ],
        [
            Paragraph("<b>UtsavHub Event Hub</b>", table_cell_style),
            Paragraph("<font color='#16A34A'><b>COMPLETE</b></font>", table_cell_style),
            Paragraph("Event browsing, high-concurrency ticket registrations, digital pass generation, duplicate checking.", table_cell_style)
        ],
        [
            Paragraph("<b>Campus Navigation & Map</b>", table_cell_style),
            Paragraph("<font color='#16A34A'><b>COMPLETE</b></font>", table_cell_style),
            Paragraph("Interactive OpenStreetMap, 16 campus landmarks, route calculation, accessible pathway filtering.", table_cell_style)
        ],
        [
            Paragraph("<b>Digital Certificates Vault</b>", table_cell_style),
            Paragraph("<font color='#16A34A'><b>COMPLETE</b></font>", table_cell_style),
            Paragraph("Automated certificate issuance upon registration, unique verification codes, printable certificates.", table_cell_style)
        ],
        [
            Paragraph("<b>Campus Issue Reporting</b>", table_cell_style),
            Paragraph("<font color='#16A34A'><b>COMPLETE</b></font>", table_cell_style),
            Paragraph("Student maintenance request submission, auto-triage classification, duty technician dispatch.", table_cell_style)
        ],
        [
            Paragraph("<b>Canteen & Food Outlets Feed</b>", table_cell_style),
            Paragraph("<font color='#D97706'><b>PENDING (MINOR)</b></font>", table_cell_style),
            Paragraph("Only minor data entry remaining: adding menu items, pricing, and live stall rush indicators for 4 campus stalls.", table_cell_style)
        ],
        [
            Paragraph("<b>Sports Facilities Booking Feed</b>", table_cell_style),
            Paragraph("<font color='#D97706'><b>PENDING (MINOR)</b></font>", table_cell_style),
            Paragraph("Only minor data entry remaining: adding daily court booking hours (Badminton, Basketball, Cricket, Gym).", table_cell_style)
        ]
    ]
    summary_table = Table(summary_data, colWidths=[130, 105, 269])
    summary_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), primary_color),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#94A3B8")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, bg_light]),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(summary_table)
    story.append(Spacer(1, 10))

    # SECTION 4: CONCLUSION & NEXT STEPS
    story.append(Paragraph("4. CONCLUSION & FINAL WRAP-UP TIMELINE", h1_style))
    story.append(Paragraph(
        "<b>Summary:</b> With our architectural load testing successfully completed, presented, and accepted by our professor today, "
        "the main technical challenge of the course project is fully resolved.<br/>"
        "<b>Next Steps:</b> We will complete the minor data seeding for campus food outlets and sports facility booking schedules over the next <b>48 hours</b> "
        "to bring the project to <b>100% final completion</b> for submission.",
        body_style
    ))
    story.append(Spacer(1, 8))

    # Evaluator Sign-off Card
    signoff_data = [
        [Paragraph("<b>EVALUATOR REVIEW & SIGN-OFF STATUS</b>", table_header_style)],
        [Paragraph(
            "<b>Review Status:</b> Presentation conducted on November 16, 2026. Evaluator reviewed live Grafana load test and accepted results.<br/>"
            "<b>Overall Progress:</b> ~90% Complete. Cleared for final submission upon minor data feed completion.",
            ParagraphStyle('Signoff', parent=body_style, textColor=colors.HexColor("#1E3A8A"))
        )]
    ]
    signoff_table = Table(signoff_data, colWidths=[504])
    signoff_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), accent_blue),
        ('BACKGROUND', (0,1), (-1,1), bg_callout),
        ('BOX', (0,0), (-1,-1), 1, accent_blue),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(signoff_table)

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"[PDF Generator] Successfully compiled visual report: {filename}")

if __name__ == '__main__':
    out_path = sys.argv[1] if len(sys.argv) > 1 else 'Chanakya_Campus_Connect_Project_Status_Report.pdf'
    build_pdf(out_path)
