import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
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
            self.drawString(54, 750, "Chanakya Campus Connect · Project Status & Architectural Verification Report")
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.5)
            self.line(54, 744, 558, 744)

        # Footer (all pages)
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(558, 36, page_text)
        self.drawString(54, 36, "ECS351: Software Architecture & Design Patterns — Milestone Progress & Pending Scope")
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.5)
        self.line(54, 46, 558, 46)
        self.restoreState()

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

    primary_color = colors.HexColor("#0F172A")    # Deep Navy
    accent_gold = colors.HexColor("#B45309")      # Amber
    accent_blue = colors.HexColor("#0284C7")      # Cyan Blue
    text_dark = colors.HexColor("#1E293B")
    bg_light = colors.HexColor("#F8FAFC")
    bg_callout = colors.HexColor("#EFF6FF")
    bg_green = colors.HexColor("#ECFDF5")
    border_green = colors.HexColor("#10B981")

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
        fontSize=10.5,
        leading=14,
        textColor=accent_gold,
        spaceAfter=10
    )

    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=primary_color,
        spaceBefore=11,
        spaceAfter=5,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['BodyText'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12.5,
        textColor=text_dark,
        spaceAfter=5
    )

    callout_style = ParagraphStyle(
        'Callout_Text',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11.5,
        textColor=colors.HexColor("#1E3A8A")
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
        fontSize=7.5,
        leading=10.5,
        textColor=text_dark
    )

    table_cell_center = ParagraphStyle(
        'TableCellCenter',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.5,
        leading=10.5,
        textColor=text_dark,
        alignment=1
    )

    story = []

    # Title & Metadata Block
    story.append(Paragraph("ECS351 · SOFTWARE ARCHITECTURE & DESIGN PATTERNS", subtitle_style))
    story.append(Paragraph("Formal Project Milestone & Progress Status Report", title_style))
    story.append(Paragraph("<b>Project Title:</b> Chanakya Campus Connect & UtsavHub Smart Platform", ParagraphStyle('SubSub', parent=body_style, fontName='Helvetica-Bold', fontSize=9.5, leading=13.5, textColor=colors.HexColor("#334155"))))
    
    status_box = [
        [
            Paragraph("<b>Overall Project Status:</b> <font color='#16A34A'><b>90% COMPLETED (ALMOST DONE)</b></font>", table_cell_style),
            Paragraph("<b>Review Status:</b> <font color='#2563EB'><b>Presentation Accepted by Evaluator</b></font>", table_cell_style)
        ],
        [
            Paragraph("<b>Architectural Load Test:</b> Fully Defended & Verified via Grafana Telemetry", table_cell_style),
            Paragraph("<b>Remaining Pending Scope:</b> Minor Data Feed for Canteen & Sports Outlets", table_cell_style)
        ]
    ]
    status_table = Table(status_box, colWidths=[250, 254])
    status_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), bg_light),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(status_table)
    story.append(Spacer(1, 8))

    # SECTION 1: EXECUTIVE PROGRESS SUMMARY
    story.append(Paragraph("1. EXECUTIVE PROGRESS SUMMARY", h1_style))
    story.append(Paragraph(
        "We are pleased to submit this progress status report confirming that our capstone project, <b>Chanakya Campus Connect</b>, "
        "is <b>substantially complete (~90%)</b>. The primary core deliverables — encompassing production authentication, interactive campus navigation, "
        "UtsavHub event management, digital certificate generation, maintenance dispatch, and the ECS351 architectural load test comparison — "
        "have been fully developed, tested, and demonstrated.",
        body_style
    ))
    story.append(Paragraph(
        "During our formal review meeting today, we successfully presented our live load testing demonstration, the 6-panel Grafana telemetry console, "
        "and our comparative analysis contrasting the <b>Modular Monolithic Architecture</b> against the <b>Event-Driven Architecture (EDA)</b>. "
        "The project evaluator reviewed the demonstrated telemetry, crossover equilibrium dynamics, and empirical evidence, expressing satisfaction with the results. "
        "The only remaining items prior to final submission are minor operational data feeds for campus food outlets and sports facility booking slots.",
        body_style
    ))

    # SECTION 2: DEFENDED ARCHITECTURAL LOAD TEST EVIDENCE
    story.append(Paragraph("2. DEFENDED ARCHITECTURAL LOAD TEST EVIDENCE & FINDINGS", h1_style))
    story.append(Paragraph(
        "Following the mandatory ECS351 argument framework (<i>Characteristic → Metric → Hypothesis → Experiment → Verdict</i>), "
        "we benchmarked our high-concurrency event registration engine across step-load tiers (10, 50, 100, 200, 400 Virtual Users). "
        "Below is the exact empirical telemetry captured and verified during our review demonstration:",
        body_style
    ))

    telemetry_data = [
        [
            Paragraph("<b>Metric / Panel</b>", table_header_style),
            Paragraph("<b>Modular Monolith</b>", table_header_style),
            Paragraph("<b>Event-Driven (EDA)</b>", table_header_style),
            Paragraph("<b>Observed Empirical Finding & Analysis</b>", table_header_style)
        ],
        [
            Paragraph("<b>HTTP p95 Latency<br/>(Low Load: 10 VUs)</b>", table_cell_style),
            Paragraph("<b>4.5 ms</b>", table_cell_center),
            Paragraph("18.5 ms", table_cell_center),
            Paragraph("<b>Monolith 4x faster</b>; in-process direct memory execution eliminates AMQP message queue serialization overhead (~14ms).", table_cell_style)
        ],
        [
            Paragraph("<b>Equilibrium Crossover<br/>(Medium Load: 100 VUs)</b>", table_cell_style),
            Paragraph("24.3 – 24.8 ms", table_cell_center),
            Paragraph("27.0 – 27.3 ms", table_cell_center),
            Paragraph("<b>Crossover Zone (~90 to 110 VUs)</b>; latency curves intersect as queuing benefits begin counteracting serialization cost.", table_cell_style)
        ],
        [
            Paragraph("<b>HTTP p95 Latency<br/>(Stress Peak: 400 VUs)</b>", table_cell_style),
            Paragraph("<b>184.6 ms</b> (Spike)", table_cell_center),
            Paragraph("<b>38.4 ms</b> (Flat)", table_cell_center),
            Paragraph("<b>EDA dominates</b>; Monolith thread pool saturates, while EDA worker queues absorb the surge without latency explosion.", table_cell_style)
        ],
        [
            Paragraph("<b>System Throughput<br/>(Sustained Capacity)</b>", table_cell_style),
            Paragraph("357 rps (Caps ~380 rps,<br/>drops to 90 rps at 400 VU)", table_cell_style),
            Paragraph("364.7 rps (Scales<br/>linearly to <b>1,480 rps</b>)", table_cell_style),
            Paragraph("<b>EDA delivers up to 16.4x throughput headroom</b> under sustained peak surges via decoupled worker consumers.", table_cell_style)
        ],
        [
            Paragraph("<b>Packet Drops & Errors<br/>(HTTP 5xx Rate)</b>", table_cell_style),
            Paragraph("0.0% (<100 VU) →<br/><b>3.6% Drops (504s)</b> at 400 VU", table_cell_style),
            Paragraph("<b>0.00% Drops</b><br/>(Zero Loss at all tiers)", table_cell_style),
            Paragraph("<b>EDA guarantees 100% reliability</b>; RabbitMQ durable message queue buffers bursts; zero student registrations dropped.", table_cell_style)
        ],
        [
            Paragraph("<b>Memory Footprint<br/>(cAdvisor Working Set)</b>", table_cell_style),
            Paragraph("<b>180 – 184 MB</b> (Lean)", table_cell_center),
            Paragraph("<b>274 – 365 MB</b> (High Cost)", table_cell_center),
            Paragraph("<b>Monolith wins cost</b>; EDA incurs a 98% memory overhead to maintain broker daemons, DLQs, and worker processes.", table_cell_style)
        ]
    ]
    telemetry_table = Table(telemetry_data, colWidths=[110, 105, 105, 184])
    telemetry_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), primary_color),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#94A3B8")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, bg_light]),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(telemetry_table)
    story.append(Spacer(1, 8))

    # SECTION 3: 4-QUADRANT & HISTOGRAM VERIFICATION
    story.append(Paragraph("3. 4-QUADRANT ANALYSIS & DISTRIBUTION HISTOGRAMS VERIFIED", h1_style))
    story.append(Paragraph(
        "Our live demonstration featured four analytical plots matching the ECS351 curriculum standards:",
        body_style
    ))
    story.append(Paragraph(
        "• <b>Quad 1 (Actual Performance Comparison):</b> Confirmed empirical crossover at <b>~110 VUs</b>. Below 110 VUs, the Monolith line is lower; above 110 VUs, Monolith curves upward exponentially while EDA stays nearly horizontal.<br/>"
        "• <b>Quad 2 (Theoretical Scaling Model):</b> Compared normalized scaling bounds ($O(N^{1.35})$ for Monolith thread contention vs $O(N^{0.65})$ for EDA asynchronous worker pools).<br/>"
        "• <b>Quad 3 (Performance Ratio Monolith / EDA):</b> Curve starts below 1.0x (0.24x at 10 VUs), crosses the 1.0x baseline at 100 VUs, and rises to <b>4.8x at 400 VUs</b>, demonstrating EDA's increasing speed advantage under load.<br/>"
        "• <b>Quad 4 (Performance Difference Spread):</b> Plotted latency delta ($Latency_{Mono} - Latency_{EDA}$), moving from -14ms at low load to <b>+146ms</b> at 400 users.<br/>"
        "• <b>Distribution Histograms (100 Users):</b> Monolith exhibited Mean: 14.85ms, Median: 13.63ms, Std: 6.89ms. EDA exhibited Mean: 19.7ms, Median: 19.23ms, Std: 4.37ms. EDA showed a tighter distribution with virtually no long-tail outlier clustering.",
        body_style
    ))
    story.append(Spacer(1, 6))

    # SECTION 4: COMPLETE VS PENDING SCOPE BREAKDOWN
    story.append(Paragraph("4. COMPLETED MODULES VS PENDING SCOPE", h1_style))
    
    scope_data = [
        [
            Paragraph("<b>Module / Subsystem</b>", table_header_style),
            Paragraph("<b>Status</b>", table_header_style),
            Paragraph("<b>Implementation Details & Verification</b>", table_header_style)
        ],
        [
            Paragraph("<b>Production Authentication & RBAC</b>", table_cell_style),
            Paragraph("<font color='#16A34A'><b>100% COMPLETE</b></font>", table_cell_center),
            Paragraph("Bcrypt hashing (10 rounds), HTTP-only cookies, 15/15 automated security tests passing, brute-force rate limiting (5 attempts), role-based middleware for Student, Faculty, Admin.", table_cell_style)
        ],
        [
            Paragraph("<b>ECS351 Architecture Comparison Lab</b>", table_cell_style),
            Paragraph("<font color='#16A34A'><b>100% COMPLETE</b></font>", table_cell_center),
            Paragraph("Dual backend implementation (Port 8001 Monolith vs Port 8002 EDA), Grafana v10.4 console, 4-Quadrant visualizer, 14-characteristic star rating matrix, k6 load generator.", table_cell_style)
        ],
        [
            Paragraph("<b>UtsavHub Mega-Fest Engine</b>", table_cell_style),
            Paragraph("<font color='#16A34A'><b>100% COMPLETE</b></font>", table_cell_center),
            Paragraph("Event hierarchy discovery, pass allocation, QR code generation, duplicate prevention, high-concurrency ticket booking, seat allocation.", table_cell_style)
        ],
        [
            Paragraph("<b>Campus Navigation & Interactive Map</b>", table_cell_style),
            Paragraph("<font color='#16A34A'><b>100% COMPLETE</b></font>", table_cell_center),
            Paragraph("Leaflet OpenStreetMap integration, 16 campus landmarks, route calculation, accessible pathway filtering, obstacle bypass simulation.", table_cell_style)
        ],
        [
            Paragraph("<b>Digital Certificates Vault</b>", table_cell_style),
            Paragraph("<font color='#16A34A'><b>100% COMPLETE</b></font>", table_cell_center),
            Paragraph("Automated certificate issuance upon registration, unique verification URLs, digital authenticity validation, printable certificate template.", table_cell_style)
        ],
        [
            Paragraph("<b>Campus Maintenance Ticket System</b>", table_cell_style),
            Paragraph("<font color='#16A34A'><b>100% COMPLETE</b></font>", table_cell_center),
            Paragraph("Issue logging, automated triage categorization, dispatch status tracker, photo attachment simulation, admin resolution workflow.", table_cell_style)
        ],
        [
            Paragraph("<b>Canteen & Food Outlets Data Feed</b>", table_cell_style),
            Paragraph("<font color='#D97706'><b>PENDING (MINOR)</b></font>", table_cell_center),
            Paragraph("Adding realistic menu items, pricing catalogs, and stall hours for 4 campus food stalls (Central Canteen, Food Court, Cafe Coffee Day, Nescafe Kiosk).", table_cell_style)
        ],
        [
            Paragraph("<b>Sports Facilities Booking Data Feed</b>", table_cell_style),
            Paragraph("<font color='#D97706'><b>PENDING (MINOR)</b></font>", table_cell_center),
            Paragraph("Adding slot schedules and equipment inventory lists for Badminton Courts, Basketball Court, Cricket Nets, and Gymnasium.", table_cell_style)
        ]
    ]
    scope_table = Table(scope_data, colWidths=[130, 95, 279])
    scope_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#0F172A")),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#94A3B8")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, bg_light]),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(scope_table)
    story.append(Spacer(1, 8))

    # SECTION 5: FINAL ROADMAP TO SUBMISSION
    story.append(Paragraph("5. ROADMAP TO 100% FINAL SUBMISSION", h1_style))
    story.append(Paragraph(
        "Because all complex architectural engineering, database modeling, and load test benchmarking are finished and approved, "
        "the final steps represent lightweight data seeding tasks that will be completed within <b>48 hours</b>:",
        body_style
    ))
    story.append(Paragraph(
        "1. <b>Day 1 (Food & Canteen Feed):</b> Populate `foodOutlets` dataset with verified campus food vendor menus, live rush status indicators, and order token generation.<br/>"
        "2. <b>Day 2 (Sports Facility Feed):</b> Populate `sportsCourts` dataset with daily time slots (06:00 to 20:00), equipment checkout rules, and court availability states.<br/>"
        "3. <b>Day 3 (Packaging & Final Wrap-Up):</b> Execute final regression verification test suite, generate final code documentation, and prepare release zip for evaluation archiving.",
        body_style
    ))
    story.append(Spacer(1, 8))

    # Evaluation Sign-Off Callout Box
    eval_data = [
        [Paragraph("<b>EVALUATION REVIEW SUMMARY & SIGN-OFF RECORD</b>", table_header_style)],
        [Paragraph(
            "<b>Milestone Outcome:</b> Formal Review Presentation successfully conducted and accepted by evaluator.<br/>"
            "<b>Architectural Argument Verdict:</b> Empirically proved that Event-Driven micro-worker architecture delivers superior scalability and zero error rates at high concurrency (>100 users), while Modular Monolith maintains superior cost and low-load latency.<br/>"
            "<b>Remaining Tasks:</b> Minor operational data feeds (Food/Sports) to achieve 100% project completion.",
            callout_style
        )]
    ]
    eval_table = Table(eval_data, colWidths=[504])
    eval_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), accent_blue),
        ('BACKGROUND', (0,1), (-1,1), bg_callout),
        ('BOX', (0,0), (-1,-1), 1, accent_blue),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(eval_table)

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"[PDF Generator] Successfully compiled: {filename}")

if __name__ == '__main__':
    out_path = sys.argv[1] if len(sys.argv) > 1 else 'Chanakya_Campus_Connect_Project_Status_Report.pdf'
    build_pdf(out_path)
