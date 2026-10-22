import os
import sys
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
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
        self.drawRightString(550, 805, "Architecture, Machine Learning & Viva Preparation")
        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.6)
        self.line(45, 798, 550, 798)

        # Running Footer
        self.line(45, 42, 550, 42)
        self.drawString(45, 30, "CareerCompass AI | Engineering Career Recommendation Platform")
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(550, 30, page_str)

        self.restoreState()


def build_pdf(filename="CareerCompass_AI_Complete_Project_Guide.pdf"):
    print(f"[*] Generating PDF: {filename}...")

    # Page setup: A4 with 45pt margins
    doc = SimpleDocTemplate(
        filename,
        pagesize=A4,
        leftMargin=45,
        rightMargin=45,
        topMargin=50,
        bottomMargin=50
    )

    # Base palette
    c_navy = colors.HexColor("#0F172A")
    c_blue = colors.HexColor("#2563EB")
    c_slate = colors.HexColor("#334155")
    c_muted = colors.HexColor("#64748B")
    c_light = colors.HexColor("#F8FAFC")
    c_border = colors.HexColor("#E2E8F0")
    c_teal = colors.HexColor("#0D9488")
    c_card_bg = colors.HexColor("#F1F5F9")
    c_code_bg = colors.HexColor("#1E293B")

    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=30,
        textColor=c_navy,
        alignment=0,
        spaceAfter=10
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=c_blue,
        alignment=0,
        spaceAfter=20
    )

    h1_style = ParagraphStyle(
        'DocH1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=15,
        leading=19,
        textColor=c_navy,
        spaceBefore=18,
        spaceAfter=8,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'DocH2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=c_blue,
        spaceBefore=12,
        spaceAfter=6,
        keepWithNext=True
    )

    h3_style = ParagraphStyle(
        'DocH3',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=13,
        textColor=c_navy,
        spaceBefore=8,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'DocBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12.5,
        textColor=c_slate,
        spaceAfter=6
    )

    bullet_style = ParagraphStyle(
        'DocBullet',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=c_slate,
        leftIndent=14,
        firstLineIndent=-10,
        spaceAfter=4
    )

    code_style = ParagraphStyle(
        'DocCode',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=7.2,
        leading=9.5,
        textColor=colors.HexColor("#0F172A"),
        spaceBefore=4,
        spaceAfter=6
    )

    table_header_style = ParagraphStyle(
        'DocTableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.white,
        alignment=0
    )

    table_cell_style = ParagraphStyle(
        'DocTableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.5,
        leading=10,
        textColor=c_slate
    )

    table_cell_bold = ParagraphStyle(
        'DocTableCellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=10,
        textColor=c_navy
    )

    callout_style = ParagraphStyle(
        'DocCallout',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor("#1E3A8A"),
        spaceBefore=4,
        spaceAfter=6
    )

    story = []

    # =========================================================================
    # COVER / TITLE PAGE
    # =========================================================================
    story.append(Spacer(1, 40))
    story.append(Paragraph("PROJECT COMPREHENSIVE TECHNICAL GUIDE", ParagraphStyle('Badge', fontName='Helvetica-Bold', fontSize=9, textColor=c_teal, spaceAfter=8)))
    story.append(Paragraph("CareerCompass AI", title_style))
    story.append(Paragraph("AI-Powered Career Recommendation Platform for Engineering Students", ParagraphStyle('SubSub', fontName='Helvetica-Bold', fontSize=14, leading=18, textColor=c_navy, spaceAfter=10)))
    story.append(Paragraph("Complete Technical Architecture, Machine Learning Implementation, System Integration, and Viva Preparation Manual", subtitle_style))

    story.append(HRFlowable(width="100%", thickness=2, color=c_blue, spaceBefore=10, spaceAfter=20))

    meta_text = """
    <b>Document Purpose:</b> This guide provides an end-to-end, beginner-friendly yet technically thorough breakdown of the CareerCompass AI platform. It explains the exact technologies used, how the Scikit-Learn Random Forest Classifier was trained and deployed via FastAPI, how the React frontend interfaces with the Express backend, how personalized learning roadmaps are constructed, and answers critical examination and viva questions.
    <br/><br/>
    <b>Author / Development Team:</b> Full-Stack & Machine Learning Engineering Team<br/>
    <b>Project Domain:</b> Educational Technology (EdTech) / Artificial Intelligence / Career Trajectory Guidance<br/>
    <b>Software Version:</b> 2.0.0 (Production Architecture with Bcrypt Authentication & REST API Isolation)<br/>
    <b>Primary Web URL:</b> <code>http://localhost:5000</code> &nbsp;|&nbsp; <b>ML API Service:</b> <code>http://127.0.0.1:8000</code><br/>
    <b>Date of Documentation:</b> October 2026
    """
    story.append(Paragraph(meta_text, body_style))
    story.append(Spacer(1, 30))

    # Highlights box
    highlights = [
        [Paragraph("<b>Core Machine Learning:</b>", table_cell_bold), Paragraph("Scikit-Learn <code>RandomForestClassifier</code> (200 estimators) trained on 550 multi-disciplinary engineering profiles across 11 career classes.", table_cell_style)],
        [Paragraph("<b>Web Stack Architecture:</b>", table_cell_bold), Paragraph("React 19 + TypeScript + Vite + Tailwind CSS frontend coupled to an Express.js API gateway and a Python FastAPI ML microservice.", table_cell_style)],
        [Paragraph("<b>Security & User Storage:</b>", table_cell_bold), Paragraph("JSON Web Tokens (JWT) + Bcrypt password hashing (10 salt rounds) with isolated, per-student profile and progress persistence.", table_cell_style)],
        [Paragraph("<b>Adaptive Roadmaps:</b>", table_cell_bold), Paragraph("Dynamic 4-phase milestone engine computing verified skill overlap vs. high-priority gaps, generating customized project deliverables.", table_cell_style)]
    ]
    t_high = Table(highlights, colWidths=[130, 375])
    t_high.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_card_bg),
        ('BOX', (0,0), (-1,-1), 1, c_border),
        ('INNERGRID', (0,0), (-1,-1), 0.5, c_border),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(t_high)

    story.append(PageBreak())

    # =========================================================================
    # TABLE OF CONTENTS
    # =========================================================================
    story.append(Paragraph("Table of Contents", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=c_border, spaceBefore=4, spaceAfter=14))

    toc_items = [
        ("Section 1", "Project Overview & Problem Statement", "Page 3"),
        ("Section 2", "Complete Technology Stack Breakdown", "Page 4"),
        ("Section 3", "System Architecture & Inter-Component Flow", "Page 5"),
        ("Section 4", "Step-by-Step User Journey", "Page 6"),
        ("Section 5", "Dataset Analysis & Feature Engineering", "Page 7"),
        ("Section 6", "Random Forest Classifier: Principles & Hyperparameters", "Page 8"),
        ("Section 7", "Where Exactly Machine Learning Happens in Code", "Page 10"),
        ("Section 8", "Where AI, ML & Rule-Based Engines Are Applied", "Page 11"),
        ("Section 9", "Backend Architecture & REST API Endpoints", "Page 12"),
        ("Section 10", "Model Evaluation Results & Synthetic Data Caveats", "Page 13"),
        ("Section 11", "Skill-Gap Analysis & Adaptive Roadmap Generation", "Page 14"),
        ("Section 12", "Authentication System & Data Isolation", "Page 15"),
        ("Section 13", "Project File Structure & Key Code Map", "Page 16"),
        ("Section 14", "How to Run the Application Locally", "Page 17"),
        ("Section 15", "Common Errors, Diagnosis & Troubleshooting", "Page 18"),
        ("Section 16", "Project Limitations & Future Scope", "Page 19"),
        ("Section 17", "Comprehensive Viva & Presentation Preparation (25 Questions)", "Page 20"),
        ("Section 18", "Glossary of Key Technical Terms", "Page 23"),
        ("Section 19", "Final Quick-Revision Sheet & Architecture Summary", "Page 24"),
    ]

    toc_table = [[Paragraph(f"<b>{num}</b>", table_cell_bold), Paragraph(title, table_cell_style), Paragraph(pg, table_cell_style)] for num, title, pg in toc_items]
    t_toc = Table(toc_table, colWidths=[65, 380, 60])
    t_toc.setStyle(TableStyle([
        ('LINEBELOW', (0,0), (-1,-1), 0.5, colors.HexColor("#F1F5F9")),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_toc)
    story.append(PageBreak())

    # =========================================================================
    # SECTION 1: PROJECT OVERVIEW
    # =========================================================================
    story.append(Paragraph("1. Project Overview & Problem Statement", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=c_border, spaceBefore=4, spaceAfter=10))

    story.append(Paragraph("<b>1.1 What is CareerCompass AI?</b>", h2_style))
    story.append(Paragraph(
        "CareerCompass AI is an intelligent, explainable career discovery and guidance platform built specifically for engineering college students. It solves one of the most common dilemmas in higher education: students learn multiple programming languages, libraries, and mathematical concepts during their curriculum, but struggle to know which modern technical industry domain best suits their existing capabilities and what exact steps they must take to become career-ready.",
        body_style
    ))

    story.append(Paragraph("<b>1.2 The Problem It Solves (With Concrete Example)</b>", h2_style))
    story.append(Paragraph(
        "Consider a 2nd or 3rd-year Computer Science Engineering student named <i>Aarav</i>. Aarav has learned Python in college, knows basic SQL queries, and has built a couple of basic web pages using HTML and CSS. Aarav asks himself: <i>'Should I pursue Full-Stack Software Development, Data Analytics, or Artificial Intelligence? Which one fits my current strengths? What skills am I still missing? What project should I build for my portfolio?'</i>",
        body_style
    ))
    story.append(Paragraph(
        "Without guidance, students often pick random online courses, become overwhelmed by prerequisite jargon, or graduate without coherent domain projects. CareerCompass AI solves this by taking the student's exact branch, current year, skill proficiencies, interests, and working styles, feeding them into a trained Machine Learning model combined with a multi-factor compatibility engine, and returning:",
        body_style
    ))
    story.append(Paragraph("• <b>Top 3 Ranked Career Domains:</b> For example: #1 Software Development (84% match), #2 Data Analytics & BI (76% match), #3 AI & Machine Learning (71% match).", bullet_style))
    story.append(Paragraph("• <b>Clear Explainability:</b> Explicit rationale showing which existing skills matched the domain and why their branch synergy supports this trajectory.", bullet_style))
    story.append(Paragraph("• <b>Skill-Gap Identification:</b> Exact missing libraries or tools needed (e.g. Git, React, Docker for Software; Power BI and Statistics for Data Analytics).", bullet_style))
    story.append(Paragraph("• <b>Adaptive Phased Roadmap:</b> A customized 4-phase learning schedule with concrete portfolio project deliverables and weekly hour estimates.", bullet_style))

    story.append(Paragraph("<b>1.3 Supported Engineering Disciplines</b>", h2_style))
    story.append(Paragraph(
        "Unlike generic software job portals, CareerCompass AI was architected from day one to embrace core and interdisciplinary engineering branches, including: Computer Engineering / CSE, Information Technology (IT), Electronics and Communication (ECE / VLSI), Electrical & Renewable Energy, Mechanical Design & CAD, Civil & Infrastructure (BIM), and Chemical & Process Engineering. Cross-branch skill pivots (e.g. an Electrical student pivoting to Data Analytics) are natively modeled.",
        body_style
    ))

    story.append(Paragraph("<b>1.4 Scope & Boundary Definitions</b>", h2_style))
    story.append(Paragraph(
        "To maintain professional clarity and focus, CareerCompass AI does not operate as an open social network, general-purpose course marketplace, or job board. The current verified release focuses exclusively on <b>Career Discovery + Explainable Recommendations + Adaptive Learning Roadmaps + Domain Bookmarking</b>.",
        body_style
    ))

    story.append(PageBreak())

    # =========================================================================
    # SECTION 2: COMPLETE TECHNOLOGY STACK
    # =========================================================================
    story.append(Paragraph("2. Complete Technology Stack Breakdown", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=c_border, spaceBefore=4, spaceAfter=10))

    story.append(Paragraph(
        "The following table documents every technology, library, and framework verified in the active codebase:",
        body_style
    ))

    tech_data = [
        [Paragraph("<b>Layer</b>", table_header_style), Paragraph("<b>Technology</b>", table_header_style), Paragraph("<b>Where Used</b>", table_header_style), Paragraph("<b>Why & How It Contributes</b>", table_header_style)],
        [
            Paragraph("Frontend", table_cell_bold),
            Paragraph("<b>React 19</b>", table_cell_style),
            Paragraph("<code>client/src/App.tsx</code>, components", table_cell_style),
            Paragraph("Powers the interactive single-page application (SPA), managing view transitions, assessment wizard steps, and responsive reactive dashboards.", table_cell_style)
        ],
        [
            Paragraph("Frontend", table_cell_bold),
            Paragraph("<b>TypeScript</b>", table_cell_style),
            Paragraph("<code>client/src/types/</code>", table_cell_style),
            Paragraph("Enforces strict compile-time types for candidate profiles, recommendation payloads, roadmap milestones, and authentication states.", table_cell_style)
        ],
        [
            Paragraph("Frontend", table_cell_bold),
            Paragraph("<b>Tailwind CSS v4</b>", table_cell_style),
            Paragraph("All UI component classes", table_cell_style),
            Paragraph("Provides a utility-first, modern SaaS visual design system with deep navy typography, restrained blue accents, and subtle borders.", table_cell_style)
        ],
        [
            Paragraph("Frontend", table_cell_bold),
            Paragraph("<b>Vite v8</b>", table_cell_style),
            Paragraph("<code>client/vite.config.ts</code>", table_cell_style),
            Paragraph("Fast build tool and development server, bundling production code into minified JavaScript/CSS assets in <code>client/dist</code>.", table_cell_style)
        ],
        [
            Paragraph("Backend", table_cell_bold),
            Paragraph("<b>Node.js & Express 5</b>", table_cell_style),
            Paragraph("<code>server/server.js</code> (Port 5000)", table_cell_style),
            Paragraph("Serves as the primary application gateway, handling HTTP requests, client bundle hosting, catalog lookups, and orchestrating ML calls.", table_cell_style)
        ],
        [
            Paragraph("Backend", table_cell_bold),
            Paragraph("<b>Bcryptjs & JWT</b>", table_cell_style),
            Paragraph("<code>server/auth.js</code>", table_cell_style),
            Paragraph("Secures user registration with salted password hashing (10 rounds) and validates requests via signed JSON Web Tokens (7-day validity).", table_cell_style)
        ],
        [
            Paragraph("ML Service", table_cell_bold),
            Paragraph("<b>FastAPI & Uvicorn</b>", table_cell_style),
            Paragraph("<code>ml/app.py</code> (Port 8000)", table_cell_style),
            Paragraph("Asynchronous high-performance Python microservice that exposes the trained Random Forest model over REST endpoints (<code>/predict</code>).", table_cell_style)
        ],
        [
            Paragraph("Machine Learning", table_cell_bold),
            Paragraph("<b>Scikit-Learn</b>", table_cell_style),
            Paragraph("<code>ml/train_model.py</code>", table_cell_style),
            Paragraph("Implements the <code>RandomForestClassifier</code> pipeline, <code>ColumnTransformer</code>, <code>OneHotEncoder</code>, and cross-validation.", table_cell_style)
        ],
        [
            Paragraph("Data Processing", table_cell_bold),
            Paragraph("<b>Pandas & NumPy</b>", table_cell_style),
            Paragraph("<code>ml/preprocessing.py</code>", table_cell_style),
            Paragraph("Handles tabular dataset loading, vector multi-hot skill encoding, missing value imputation, and matrix array transformations.", table_cell_style)
        ],
        [
            Paragraph("Serialization", table_cell_bold),
            Paragraph("<b>Joblib</b>", table_cell_style),
            Paragraph("<code>ml/artifacts/*.joblib</code>", table_cell_style),
            Paragraph("Serializes the entire scikit-learn pipeline (preprocessor + model weights) to disk and reloads it instantly in memory during startup.", table_cell_style)
        ],
        [
            Paragraph("Database Layer", table_cell_bold),
            Paragraph("<b>Persistent JSON Store</b>", table_cell_style),
            Paragraph("<code>server/data/</code>", table_cell_style),
            Paragraph("File-backed database system storing user accounts (<code>users.json</code>), isolated profiles (<code>saved_profiles.json</code>), and domains.", table_cell_style)
        ]
    ]

    t_tech = Table(tech_data, colWidths=[65, 80, 115, 245])
    t_tech.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_navy),
        ('GRID', (0,0), (-1,-1), 0.5, c_border),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_tech)

    story.append(PageBreak())

    # =========================================================================
    # SECTION 3: SYSTEM ARCHITECTURE
    # =========================================================================
    story.append(Paragraph("3. System Architecture & Inter-Component Flow", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=c_border, spaceBefore=4, spaceAfter=10))

    story.append(Paragraph(
        "CareerCompass AI utilizes a modern, decoupled microservice architecture consisting of three primary layers: the React single-page frontend, the Express API gateway, and the FastAPI ML inference engine.",
        body_style
    ))

    # Architecture ASCII Box
    arch_diagram = """
+-----------------------------------------------------------------------------------------+
|                                    STUDENT USER                                         |
+-----------------------------------------------------------------------------------------+
                                           |  (HTTPS / Browser)
                                           v
+-----------------------------------------------------------------------------------------+
|                  FRONTEND APPLICATION: React 19 + TypeScript (Port 5000)                |
|  - AuthPage: Registration, Login & JWT Handling                                         |
|  - AssessmentWizard: Academic Year, Branch, Multi-Select Skills, Interests              |
|  - Dashboard: Recommendation Cards, Match Scores, Radar Chart, Roadmap Checklists       |
+-----------------------------------------------------------------------------------------+
                                           |  (HTTP JSON with Bearer Token)
                                           v
+-----------------------------------------------------------------------------------------+
|                  EXPRESS.JS BACKEND & API GATEWAY (Port 5000)                           |
|  - Auth Controller: Bcrypt Password Hashing & JWT Verification (server/auth.js)         |
|  - Recommendation Engine: Multi-Factor Compatibility Calculator                         |
|  - Adaptive Roadmap Engine: Dynamic Phase & Task Generator                              |
|  - User Data Storage: Isolated persistence in server/data/saved_profiles.json           |
+-----------------------------------------------------------------------------------------+
                                           |  (Internal REST Call: POST /predict)
                                           v
+-----------------------------------------------------------------------------------------+
|                  FASTAPI PYTHON ML MICROSERVICE (Port 8000)                             |
|  - Pydantic Request Validation: StudentProfileRequest (ml/app.py)                       |
|  - Custom SkillMultiHotEncoder: Multi-hot binary vector conversion                      |
|  - OneHotEncoder: Categorical branch, year, interest transform                         |
|  - RandomForestClassifier Pipeline: Predicts class probabilities (predict_proba)       |
|  - Explainability Generator: Extracts top matching skills & high-priority gaps         |
+-----------------------------------------------------------------------------------------+
    """
    story.append(Paragraph(f"<pre>{arch_diagram}</pre>", code_style))

    story.append(Paragraph("<b>3.1 Component Communication Mechanics</b>", h2_style))
    story.append(Paragraph(
        "<b>1. Frontend to Express:</b> When a student submits their profile, the React client bundles their skills, proficiencies, branch, and preferences into a JSON payload and dispatches a <code>POST /api/recommend</code> request containing the authenticated JWT in the <code>Authorization: Bearer &lt;token&gt;</code> header.",
        body_style
    ))
    story.append(Paragraph(
        "<b>2. Express to FastAPI:</b> The Express server validates the token, extracts the authenticated <code>userId</code>, and forward-proxies the candidate profile to the FastAPI service at <code>http://127.0.0.1:8000/api/career-recommendations</code> via <code>server/mlClient.js</code> with a 4-second timeout and fallback handling.",
        body_style
    ))
    story.append(Paragraph(
        "<b>3. ML Inference & Explainability:</b> FastAPI executes the Scikit-Learn pipeline. The <code>SkillMultiHotEncoder</code> converts student skills into a sparse binary vector. The classifier computes probabilities across all 11 domains. The top domains and feature explanations are returned as JSON.",
        body_style
    ))
    story.append(Paragraph(
        "<b>4. Fusion & Roadmap Generation:</b> Express merges the ML prediction confidence with multi-factor heuristic checks (branch synergy, academic year, work style), executes the adaptive roadmap generator, and persists the combined result under <code>saved_profiles[userId]</code> before returning it to the React dashboard.",
        body_style
    ))

    story.append(PageBreak())

    # =========================================================================
    # SECTION 4: COMPLETE USER JOURNEY
    # =========================================================================
    story.append(Paragraph("4. Step-by-Step User Journey", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=c_border, spaceBefore=4, spaceAfter=10))

    story.append(Paragraph(
        "The following 15-stage sequence details what happens at every step of the student's interaction:",
        body_style
    ))

    journey_steps = [
        ("Step 1: Visitor Arrival", "Student navigates to http://localhost:5000 in their browser. The client checks local storage for an active session token. If no session exists, the professional authentication screen is displayed."),
        ("Step 2: Sign Up or Login", "The student enters their name, email, and password. The frontend validates password strength (>=6 chars, alphanumeric) and calls POST /api/auth/register. The backend hashes the password with bcrypt, stores the account in users.json, and returns a signed JWT."),
        ("Step 3: Branch & Year Selection", "New students enter the Assessment Wizard. In Step 1, they pick their discipline (e.g. Computer Science, ECE, Mechanical) and academic year (1st to 4th Year)."),
        ("Step 4: Technical Skills Input", "In Step 2, students select technical tools and concepts from dynamic branch-aware chip suggestions (e.g. Python, SQL, C++, AutoCAD, Verilog) or type custom skills."),
        ("Step 5: Skill Proficiency Rating", "Students assign realistic mastery tiers to each chosen skill: Beginner, Intermediate, or Proficient."),
        ("Step 6: Interests & Working Style", "In Step 3, students identify primary areas of curiosity (e.g. 'building applications', 'working with data', 'sensors and connected devices') and work style preferences ('hands-on building', 'analytical problem-solving')."),
        ("Step 7: Career Aspirations & Commitment", "Students specify career horizon goals ('internship first', 'industry job after graduation', 'research') and estimated weekly study hours (e.g. 10-15 hrs/week)."),
        ("Step 8: Assessment Submission", "Clicking 'Discover My Career Domain' triggers validation and sends the student profile payload to POST /api/recommend with the Bearer token."),
        ("Step 9: Express Validation & Dispatch", "The backend authenticates the token, enforces req.user.name, and makes an asynchronous REST request to the FastAPI ML service."),
        ("Step 10: Machine Learning Classification", "FastAPI's Random Forest classifier pipeline evaluates the profile and outputs predicted career domain probabilities (predict_proba)."),
        ("Step 11: Multi-Factor Compatibility Scoring", "The recommendation engine blends the ML probability score with branch synergy, work style fit, and goal timelines into a normalized composite match percentage (38% to 98%)."),
        ("Step 12: Skill-Gap Computation", "The engine runs a set-difference algorithm comparing candidate skills against the domain's core skill catalog, classifying skills into 'Matched Skills', 'Skills to Improve', and 'High-Priority Gaps'."),
        ("Step 13: Dynamic Roadmap Assembly", "The adaptive roadmap generator drafts 4 sequential phases with custom milestone tasks, week durations calculated from the student's study hours, and capstone project deliverables."),
        ("Step 14: Isolated Profile Persistence", "The complete profile, recommendations, and initial roadmap progress are saved under server/data/saved_profiles.json keyed strictly by the student's userId."),
        ("Step 15: Interactive Dashboard Rendering", "The student explores their personalized dashboard: top 3 domain cards, skill radar comparison chart, clickable roadmap checklists, and domain bookmarking.")
    ]

    j_table_data = [[Paragraph(f"<b>{title}</b>", table_cell_bold), Paragraph(desc, table_cell_style)] for title, desc in journey_steps]
    t_journey = Table(j_table_data, colWidths=[140, 365])
    t_journey.setStyle(TableStyle([
        ('LINEBELOW', (0,0), (-1,-1), 0.5, c_border),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('BACKGROUND', (0,0), (0,-1), c_light),
    ]))
    story.append(t_journey)

    story.append(PageBreak())

    # =========================================================================
    # SECTION 5: DATASET EXPLANATION
    # =========================================================================
    story.append(Paragraph("5. Dataset Analysis & Feature Engineering", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=c_border, spaceBefore=4, spaceAfter=10))

    story.append(Paragraph("<b>5.1 Dataset Overview</b>", h2_style))
    story.append(Paragraph(
        "The machine learning model was trained using the verified Excel workbook: <code>Engineering_Career_Recommendation_Dataset_550.xlsx</code> (Sheet name: <code>Student_Profile_Dataset</code>). The dataset consists of exactly <b>550 synthetic engineering student profiles</b> across 21 columns.",
        body_style
    ))

    story.append(Paragraph("<b>5.2 Input Features vs. Target Variable</b>", h2_style))
    story.append(Paragraph(
        "To ensure robust machine learning without data leakage, the columns are cleanly split into inputs, targets, and excluded post-recommendation attributes:",
        body_style
    ))

    ds_cols = [
        [Paragraph("<b>Category</b>", table_header_style), Paragraph("<b>Column Names</b>", table_header_style), Paragraph("<b>Data Type & Handling</b>", table_header_style)],
        [
            Paragraph("<b>Target Variable</b>", table_cell_bold),
            Paragraph("<code>Recommended_Domain</code>", table_cell_style),
            Paragraph("Categorical label representing the ground-truth career classification. 11 distinct classes.", table_cell_style)
        ],
        [
            Paragraph("<b>Skill Input</b>", table_cell_bold),
            Paragraph("<code>Current_Skills</code>", table_cell_style),
            Paragraph("Comma-separated string of technical skills (e.g. <i>'Python, SQL, HTML/CSS'</i>). Transformed via custom Multi-Hot binary vector encoding.", table_cell_style)
        ],
        [
            Paragraph("<b>Categorical Inputs (8 Features)</b>", table_cell_bold),
            Paragraph("<code>Student_Branch</code>, <code>Study_Year</code>, <code>Primary_Interest</code>, <code>Work_Style_Preference</code>, <code>Personality_Traits</code>, <code>Academic_Performance</code>, <code>Certifications</code>, <code>Career_Aspiration</code>", table_cell_style),
            Paragraph("Nominal and ordinal student attributes. Encoded using <code>OneHotEncoder(handle_unknown='ignore')</code> into orthogonal binary columns.", table_cell_style)
        ],
        [
            Paragraph("<b>Excluded Columns (Leakage Prevention)</b>", table_cell_bold),
            Paragraph("<code>Profile_ID</code>, <code>Suggested_Career_Path</code>, <code>Roadmap_Step_1..5</code>, <code>Portfolio_Project_Ideas</code>, <code>Potential_Job_Opportunities</code>, <code>Dataset_Note</code>", table_cell_style),
            Paragraph("Explicitly removed prior to training. These columns contain downstream outcomes derived from the target domain, which would cause artificial 100% data leakage.", table_cell_style)
        ]
    ]
    t_ds = Table(ds_cols, colWidths=[100, 195, 210])
    t_ds.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_navy),
        ('GRID', (0,0), (-1,-1), 0.5, c_border),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_ds)

    story.append(Spacer(1, 10))
    story.append(Paragraph("<b>5.3 Clarification: 11 Dataset Classes vs. 13 Platform Catalog Domains</b>", h2_style))
    story.append(Paragraph(
        "A critical observation in the codebase is that while the platform catalog (<code>server/data/career_domains.json</code>) supports <b>13 engineering domains</b>, the Excel dataset contains exactly <b>11 distinct target classes</b> in <code>Recommended_Domain</code>. Two newer disciplines—<i>Chemical & Process Engineering</i> and <i>AR/VR & Game Development</i>—were defined in the platform catalog with domain metadata and roadmaps, but have no synthetic training examples in the 550-row workbook. For these 2 domains, the platform seamlessly utilizes multi-factor heuristic scoring as a verified fallback, while the Random Forest classifier actively predicts probabilities across the core 11 classes.",
        body_style
    ))

    story.append(Paragraph("<b>5.4 Synthetic Data Nature & Educational Utility</b>", h2_style))
    story.append(Paragraph(
        "<b>Important Caveat:</b> The 550 student profiles are synthetic—generated using structured rules to simulate realistic student profiles. While ideal for developing, verifying, and testing the end-to-end machine learning pipeline, high accuracy on synthetic data does not constitute clinical or empirical validation of human career outcomes. It serves as an experimental prototype.",
        callout_style
    ))

    story.append(PageBreak())

    # =========================================================================
    # SECTION 6: RANDOM FOREST CLASSIFIER — DETAILED EXPLANATION
    # =========================================================================
    story.append(Paragraph("6. Random Forest Classifier: Detailed Explanation", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=c_border, spaceBefore=4, spaceAfter=10))

    story.append(Paragraph("<b>6.1 Machine Learning Fundamentals</b>", h2_style))
    story.append(Paragraph(
        "<b>Machine Learning (ML)</b> is a branch of Artificial Intelligence where computer systems learn patterns from historical examples rather than following manually hardcoded decision rules. In <b>Supervised Classification</b>, the algorithm is provided with input feature vectors <i>X</i> (a student's skills, branch, interests) and corresponding ground-truth target labels <i>y</i> (the recommended domain). The model's objective is to learn a mathematical mapping function <i>f(X) &rarr; y</i> that accurately predicts labels for unseen student profiles.",
        body_style
    ))

    story.append(Paragraph("<b>6.2 From Decision Tree to Random Forest Ensemble</b>", h2_style))
    story.append(Paragraph(
        "A <b>Decision Tree</b> is an intuitive classifier that splits data by asking a series of binary questions (e.g. <i>'Does the student know Python? Yes/No'</i> &rarr; <i>'Is primary interest data analytics? Yes/No'</i>). While simple, individual decision trees suffer from high variance and easily <i>overfit</i> (memorize training noise).",
        body_style
    ))
    story.append(Paragraph(
        "A <b>Random Forest</b> overcomes this limitation through <b>Ensemble Learning</b> using <i>Bootstrap Aggregating (Bagging)</i>. Instead of building one tree, it constructs an ensemble of hundreds of diverse decision trees (here, 200 trees). Each tree is trained on a random sample of student profiles and considers a random subset of features at each split. When predicting, all 200 trees cast independent votes. The class with the majority vote wins, and the fraction of trees voting for each domain represents its <b>class probability</b>.",
        body_style
    ))

    story.append(Paragraph("<b>6.3 Model Configuration & Hyperparameters in Code</b>", h2_style))
    story.append(Paragraph(
        "The model is instantiated in <code>ml/train_model.py</code> with the following production hyperparameters:",
        body_style
    ))

    rf_code = """
classifier = RandomForestClassifier(
    n_estimators=200,         # Builds 200 independent decision trees
    max_depth=None,           # Allows trees to expand until nodes are pure
    min_samples_split=2,      # Minimum samples required to split an internal node
    min_samples_leaf=1,       # Minimum samples required at each leaf node
    class_weight='balanced',  # Adjusts weights inversely proportional to class frequencies
    random_state=42,          # Guarantees deterministic, reproducible results
    n_jobs=-1                 # Utilizes all CPU cores for parallel training
)
"""
    story.append(Paragraph(f"<pre>{rf_code}</pre>", code_style))

    story.append(Paragraph("<b>6.4 predict() vs. predict_proba()</b>", h2_style))
    story.append(Paragraph(
        "• <code>model.predict(X)</code>: Returns only the single domain with the highest majority vote (e.g. <code>'Software Development'</code>).",
        bullet_style
    ))
    story.append(Paragraph(
        "• <code>model.predict_proba(X)</code>: Returns an array of continuous probability estimates across all 11 domains (e.g. <code>Software Development: 0.705</code>, <code>AI & ML: 0.155</code>, <code>Data Analytics: 0.055</code>). <b>CareerCompass AI explicitly uses <code>predict_proba</code></b> so that the top-3 ranked alternatives can be presented to the student with transparent match percentages.",
        bullet_style
    ))

    story.append(Paragraph("<b>6.5 Serialization with Joblib</b>", h2_style))
    story.append(Paragraph(
        "Training a 200-tree forest takes computational time. By saving the fitted pipeline as a <code>.joblib</code> binary artifact (<code>ml/artifacts/career_rf_pipeline.joblib</code>), the FastAPI server can load the pre-trained weights in <b>less than 80 milliseconds</b> during startup, providing sub-second inference times without retraining on every HTTP request.",
        body_style
    ))

    story.append(PageBreak())

    # =========================================================================
    # SECTION 7: WHERE ML HAPPENS IN CODE
    # =========================================================================
    story.append(Paragraph("7. Where Machine Learning Happens in the Codebase", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=c_border, spaceBefore=4, spaceAfter=10))

    story.append(Paragraph(
        "To demystify the system, the following table maps the entire Machine Learning lifecycle to exact files and functions:",
        body_style
    ))

    ml_locations = [
        [Paragraph("<b>Pipeline Stage</b>", table_header_style), Paragraph("<b>File & Function</b>", table_header_style), Paragraph("<b>Input & Output</b>", table_header_style), Paragraph("<b>Exact Implementation Details</b>", table_header_style)],
        [
            Paragraph("1. Multi-Hot Skill Vectorization", table_cell_bold),
            Paragraph("<code>ml/preprocessing.py</code><br/><code>SkillMultiHotEncoder</code>", table_cell_style),
            Paragraph("<b>In:</b> Raw skill strings<br/><b>Out:</b> Sparse binary matrix", table_cell_style),
            Paragraph("Extracts, normalizes, and alphabetizes all unique skills across the dataset. Implements <code>transform()</code> to assign 1.0 for candidate skills and 0.0 for absent skills.", table_cell_style)
        ],
        [
            Paragraph("2. Categorical Preprocessing", table_cell_bold),
            Paragraph("<code>ml/preprocessing.py</code><br/><code>create_preprocessing_pipeline()</code>", table_cell_style),
            Paragraph("<b>In:</b> 8 nominal features<br/><b>Out:</b> One-hot vectors", table_cell_style),
            Paragraph("Combines <code>SkillMultiHotEncoder</code> and <code>OneHotEncoder(handle_unknown='ignore')</code> inside a unified Scikit-Learn <code>ColumnTransformer</code>.", table_cell_style)
        ],
        [
            Paragraph("3. Model Training & Validation", table_cell_bold),
            Paragraph("<code>ml/train_model.py</code><br/><code>train_pipeline()</code>", table_cell_style),
            Paragraph("<b>In:</b> Excel dataset<br/><b>Out:</b> Fitted Pipeline", table_cell_style),
            Paragraph("Executes 80/20 stratified split, runs 5-fold cross validation, fits the 200-tree Random Forest, and writes metadata to <code>model_metadata.json</code>.", table_cell_style)
        ],
        [
            Paragraph("4. Artifact Serialization", table_cell_bold),
            Paragraph("<code>ml/train_model.py</code><br/><code>joblib.dump()</code>", table_cell_style),
            Paragraph("<b>In:</b> Pipeline object<br/><b>Out:</b> <code>career_rf_pipeline.joblib</code>", table_cell_style),
            Paragraph("Persists the full pipeline containing both the preprocessing transformer and tree ensemble to disk.", table_cell_style)
        ],
        [
            Paragraph("5. Model Deserialization", table_cell_bold),
            Paragraph("<code>ml/predict.py</code><br/><code>load_model_artifacts()</code>", table_cell_style),
            Paragraph("<b>In:</b> .joblib on disk<br/><b>Out:</b> In-memory pipeline", table_cell_style),
            Paragraph("Loads the model into RAM during FastAPI startup event, caching the instance globally to eliminate I/O overhead on prediction requests.", table_cell_style)
        ],
        [
            Paragraph("6. Real-Time Inference", table_cell_bold),
            Paragraph("<code>ml/predict.py</code><br/><code>predict_career_domains()</code>", table_cell_style),
            Paragraph("<b>In:</b> Candidate profile<br/><b>Out:</b> Ranked recommendations", table_cell_style),
            Paragraph("Converts student dictionary into single-row DataFrame, calls <code>pipeline.predict_proba()</code>, ranks top probabilities, and extracts matching skills.", table_cell_style)
        ],
        [
            Paragraph("7. REST API Exposure", table_cell_bold),
            Paragraph("<code>ml/app.py</code><br/><code>POST /predict</code>", table_cell_style),
            Paragraph("<b>In:</b> JSON HTTP body<br/><b>Out:</b> JSON response", table_cell_style),
            Paragraph("Validates request using Pydantic <code>StudentProfileRequest</code> and returns top-3 domain probabilities with skill overlap and disclaimer.", table_cell_style)
        ]
    ]

    t_ml_loc = Table(ml_locations, colWidths=[95, 120, 110, 180])
    t_ml_loc.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_navy),
        ('GRID', (0,0), (-1,-1), 0.5, c_border),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_ml_loc)

    story.append(PageBreak())

    # =========================================================================
    # SECTION 8: WHERE IS AI USED IN THE PLATFORM?
    # =========================================================================
    story.append(Paragraph("8. Where AI, ML & Rule-Based Logic Are Applied", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=c_border, spaceBefore=4, spaceAfter=10))

    story.append(Paragraph(
        "In technical discussions and project defenses, examiners frequently ask: <i>'Where is the AI in your system? Is the roadmap generated by an LLM? How is the skill gap calculated?'</i> It is critical to provide a scientifically precise answer:",
        body_style
    ))

    ai_comparison = [
        [Paragraph("<b>Subsystem</b>", table_header_style), Paragraph("<b>Underlying Mechanism</b>", table_header_style), Paragraph("<b>Classification</b>", table_header_style), Paragraph("<b>Technical Justification</b>", table_header_style)],
        [
            Paragraph("Career Domain Prediction", table_cell_bold),
            Paragraph("Scikit-Learn Random Forest Classifier (200 trees)", table_cell_style),
            Paragraph("<b>Machine Learning (AI)</b>", table_cell_style),
            Paragraph("Learns non-linear boundary mappings from historical training profiles to predict multi-class domain probabilities without manual if-else rules.", table_cell_style)
        ],
        [
            Paragraph("Multi-Factor Compatibility", table_cell_bold),
            Paragraph("Weighted composite formula (Skills, Interest, Branch, Goals)", table_cell_style),
            Paragraph("<b>Heuristic Algorithm</b>", table_cell_style),
            Paragraph("Blends ML confidence with structured constraints (e.g. penalizing branch mismatch while rewarding transferable skills) into a normalized score.", table_cell_style)
        ],
        [
            Paragraph("Skill-Gap Identification", table_cell_bold),
            Paragraph("Mathematical Set Difference (Core Skills \\ Candidate Skills)", table_cell_style),
            Paragraph("<b>Deterministic Logic</b>", table_cell_style),
            Paragraph("Directly compares candidate skills against validated industry benchmarks, classifying missing tools into high, medium, and low priority gaps.", table_cell_style)
        ],
        [
            Paragraph("Adaptive Phased Roadmap", table_cell_bold),
            Paragraph("Parametric Template Engine (4 phases, duration scaled by hours)", table_cell_style),
            Paragraph("<b>Rules-Based Automation</b>", table_cell_style),
            Paragraph("Tailors learning phases, milestone objectives, and capstone project deliverables based on identified gaps and study commitments.", table_cell_style)
        ],
        [
            Paragraph("Generative AI / LLM", table_cell_bold),
            Paragraph("<i>None in current verified implementation</i>", table_cell_style),
            Paragraph("<b>N/A</b>", table_cell_style),
            Paragraph("<b>Important:</b> The current system does NOT call OpenAI, Gemini, or third-party LLMs. Roadmaps are deterministically verified rather than halluncinated.", table_cell_style)
        ]
    ]

    t_ai_comp = Table(ai_comparison, colWidths=[105, 120, 105, 175])
    t_ai_comp.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_navy),
        ('GRID', (0,0), (-1,-1), 0.5, c_border),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_ai_comp)

    story.append(Spacer(1, 10))
    story.append(Paragraph("<b>8.1 The Hierarchy of Artificial Intelligence</b>", h2_style))
    story.append(Paragraph(
        "• <b>Artificial Intelligence (AI):</b> The broad umbrella concept of machines performing tasks that typically require human cognition.<br/>"
        "• <b>Machine Learning (ML):</b> A specific subset of AI where systems improve performance on a task using data (e.g. our Random Forest Classifier).<br/>"
        "• <b>Deep Learning / Generative AI:</b> A further subset of ML utilizing multi-layer neural networks or transformers. CareerCompass AI intentionally utilizes tabular Random Forest rather than deep learning because tabular engineering profiles are structured, low-latency, and require deterministic auditability.",
        body_style
    ))

    story.append(PageBreak())

    # =========================================================================
    # SECTION 9: BACKEND AND API EXPLANATION
    # =========================================================================
    story.append(Paragraph("9. Backend Architecture & REST API Endpoints", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=c_border, spaceBefore=4, spaceAfter=10))

    story.append(Paragraph(
        "CareerCompass AI runs two distinct local server runtimes: <b>Express on Port 5000</b> (Application & User Gateway) and <b>FastAPI on Port 8000</b> (Machine Learning Inference Microservice).",
        body_style
    ))

    api_endpoints = [
        [Paragraph("<b>Method & URL</b>", table_header_style), Paragraph("<b>Server</b>", table_header_style), Paragraph("<b>Auth Required?</b>", table_header_style), Paragraph("<b>Functionality & Returned Data</b>", table_header_style)],
        [
            Paragraph("<code>GET /api/health</code>", table_cell_bold),
            Paragraph("Express (5000)", table_cell_style),
            Paragraph("No (Public)", table_cell_style),
            Paragraph("Returns system status, service name, backend version (2.0.0), and server timestamp.", table_cell_style)
        ],
        [
            Paragraph("<code>GET /api/ml-health</code>", table_cell_bold),
            Paragraph("Express (5000)", table_cell_style),
            Paragraph("No (Public)", table_cell_style),
            Paragraph("Queries FastAPI's <code>/health</code> to verify model status, active classes (11), and version.", table_cell_style)
        ],
        [
            Paragraph("<code>GET /api/domains</code>", table_cell_bold),
            Paragraph("Express (5000)", table_cell_style),
            Paragraph("No (Public)", table_cell_style),
            Paragraph("Returns the catalog of 13 engineering career domains with core skills and role titles.", table_cell_style)
        ],
        [
            Paragraph("<code>POST /api/auth/register</code>", table_cell_bold),
            Paragraph("Express (5000)", table_cell_style),
            Paragraph("No (Public)", table_cell_style),
            Paragraph("Validates email & password, hashes password via bcrypt, creates user record, and issues JWT.", table_cell_style)
        ],
        [
            Paragraph("<code>POST /api/auth/login</code>", table_cell_bold),
            Paragraph("Express (5000)", table_cell_style),
            Paragraph("No (Public)", table_cell_style),
            Paragraph("Verifies password against stored bcrypt hash; returns JWT and profile completion status.", table_cell_style)
        ],
        [
            Paragraph("<code>GET /api/auth/me</code>", table_cell_bold),
            Paragraph("Express (5000)", table_cell_style),
            Paragraph("<b>Yes (Bearer)</b>", table_cell_style),
            Paragraph("Returns authenticated student identity (id, name, email) and assessment status.", table_cell_style)
        ],
        [
            Paragraph("<code>GET /api/student/profile</code>", table_cell_bold),
            Paragraph("Express (5000)", table_cell_style),
            Paragraph("<b>Yes (Bearer)</b>", table_cell_style),
            Paragraph("Returns the isolated profile and recommendations belonging strictly to the requesting user.", table_cell_style)
        ],
        [
            Paragraph("<code>POST /api/recommend</code>", table_cell_bold),
            Paragraph("Express (5000)", table_cell_style),
            Paragraph("<b>Yes (Bearer)</b>", table_cell_style),
            Paragraph("Main recommendation pipeline: invokes ML microservice, computes roadmaps, and saves results.", table_cell_style)
        ],
        [
            Paragraph("<code>PUT /api/student/roadmap</code>", table_cell_bold),
            Paragraph("Express (5000)", table_cell_style),
            Paragraph("<b>Yes (Bearer)</b>", table_cell_style),
            Paragraph("Updates task milestone status (<code>not_started</code>, <code>in_progress</code>, <code>completed</code>).", table_cell_style)
        ],
        [
            Paragraph("<code>POST /predict</code>", table_cell_bold),
            Paragraph("FastAPI (8000)", table_cell_style),
            Paragraph("Internal / Open", table_cell_style),
            Paragraph("Microservice endpoint executing <code>predict_proba()</code> on candidate feature vectors.", table_cell_style)
        ]
    ]

    t_api = Table(api_endpoints, colWidths=[120, 75, 75, 235])
    t_api.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_navy),
        ('GRID', (0,0), (-1,-1), 0.5, c_border),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_api)

    story.append(Spacer(1, 10))
    story.append(Paragraph("<b>9.1 Sample REST JSON Interaction (Inference Payload)</b>", h2_style))
    sample_json = """
// POST http://127.0.0.1:8000/predict
// REQUEST PAYLOAD:
{
  "student_branch": "Computer Science Engineering",
  "study_year": "3rd Year",
  "current_skills": ["Python", "SQL", "Machine Learning", "pandas"],
  "primary_interest": "AI, prediction and experimentation",
  "work_style_preference": "analytical problem-solving",
  "career_aspiration": "AI Research or ML Engineer"
}

// RESPONSE PAYLOAD (FastAPI ML Service):
{
  "success": true,
  "model_type": "RandomForestClassifier",
  "model_version": "1.0.0",
  "total_classes_evaluated": 11,
  "recommendations": [
    {
      "domain": "AI & Machine Learning",
      "score": 0.815,
      "estimated_probability_percent": 81.5,
      "matching_skills": ["Python", "Machine Learning", "pandas"],
      "skill_gaps": ["Linear algebra", "scikit-learn", "NumPy"],
      "explanation": "Direct foundation in Python, pandas; aligned with CSE curriculum"
    }
  ]
}
"""
    story.append(Paragraph(f"<pre>{sample_json}</pre>", code_style))

    story.append(PageBreak())

    # =========================================================================
    # SECTION 10: TRAINING AND EVALUATION RESULTS
    # =========================================================================
    story.append(Paragraph("10. Training and Evaluation Results", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=c_border, spaceBefore=4, spaceAfter=10))

    story.append(Paragraph("<b>10.1 Experimental Protocol & Validation Setup</b>", h2_style))
    story.append(Paragraph(
        "The model training pipeline (<code>ml/train_model.py</code>) enforces rigorous machine learning validation procedures: an 80/20 stratified train/test split (440 training samples, 110 held-out testing samples) and Stratified 5-Fold Cross Validation across the training set to preserve equal class representations.",
        body_style
    ))

    eval_table = [
        [Paragraph("<b>Metric / Parameter</b>", table_header_style), Paragraph("<b>Observed Value</b>", table_header_style), Paragraph("<b>Interpretation & Significance</b>", table_header_style)],
        [
            Paragraph("Total Dataset Size", table_cell_bold),
            Paragraph("550 student profiles", table_cell_style),
            Paragraph("Complete synthetic dataset from Excel workbook.", table_cell_style)
        ],
        [
            Paragraph("Training Set Size", table_cell_bold),
            Paragraph("440 samples (80%)", table_cell_style),
            Paragraph("Used for fitting both preprocessing transformers and tree estimators.", table_cell_style)
        ],
        [
            Paragraph("Testing Set Size", table_cell_bold),
            Paragraph("110 samples (20%)", table_cell_style),
            Paragraph("Held-out test set completely unseen during model fitting.", table_cell_style)
        ],
        [
            Paragraph("Cross-Validation Accuracy", table_cell_bold),
            Paragraph("1.0000 (100.0%) &plusmn; 0.00", table_cell_style),
            Paragraph("Stratified 5-Fold CV mean accuracy across all 5 folds.", table_cell_style)
        ],
        [
            Paragraph("Held-Out Test Accuracy", table_cell_bold),
            Paragraph("1.0000 (100.0%)", table_cell_style),
            Paragraph("Exact accuracy achieved on the 110 held-out test samples.", table_cell_style)
        ],
        [
            Paragraph("Macro Avg Precision / Recall", table_cell_bold),
            Paragraph("1.0000 / 1.0000", table_cell_style),
            Paragraph("Zero false positives or false negatives across all 11 classes.", table_cell_style)
        ],
        [
            Paragraph("Macro Avg F1-Score", table_cell_bold),
            Paragraph("1.0000 (100.0%)", table_cell_style),
            Paragraph("Harmonic mean of precision and recall indicates perfect classification on this data.", table_cell_style)
        ]
    ]

    t_eval = Table(eval_table, colWidths=[130, 110, 265])
    t_eval.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_navy),
        ('GRID', (0,0), (-1,-1), 0.5, c_border),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_eval)

    story.append(Spacer(1, 10))
    story.append(Paragraph("<b>10.2 Why Did the Model Achieve 100% Accuracy? (Critical Exam Topic)</b>", h2_style))
    story.append(Paragraph(
        "In a viva or project defense, achieving 100% accuracy immediately invites scrutiny: <i>'Is there data leakage? Did the model memorize the data?'</i>",
        body_style
    ))
    story.append(Paragraph(
        "<b>The Technical Explanation:</b><br/>"
        "1. <b>Zero Target Leakage:</b> All 11 post-recommendation columns (e.g. <code>Suggested_Career_Path</code>, <code>Roadmap_Step_1..5</code>) were explicitly purged before training. The model only trained on independent student attributes.<br/>"
        "2. <b>Deterministic Synthetic Generation:</b> In the synthetic Excel dataset, combinations of <code>Primary_Interest</code> and <code>Current_Skills</code> are strongly correlated with the target label (e.g. every student with interest <i>'buildings, structures and digital construction'</i> maps deterministically to <i>Civil Design & BIM</i>; every student with <i>'hardware, sensors and connected devices'</i> maps to <i>Embedded Systems & IoT</i>). The feature importance report confirms this: <code>Primary_Interest</code> accounts for over 60% of total Gini impurity reduction.<br/>"
        "3. <b>Real-World Recommendation:</b> While 100% accuracy proves that the Random Forest successfully learned the synthetic generation rules with zero error, real engineering students have ambiguous, overlapping, and contradictory interests. Deploying the system to real students will introduce noise, which is why future iterations should gather human empirical feedback.",
        body_style
    ))

    story.append(PageBreak())

    # =========================================================================
    # SECTION 11: SKILL-GAP ANALYSIS & ROADMAP GENERATION
    # =========================================================================
    story.append(Paragraph("11. Skill-Gap Analysis & Roadmap Generation", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=c_border, spaceBefore=4, spaceAfter=10))

    story.append(Paragraph("<b>11.1 Skill-Gap Analysis Algorithm</b>", h2_style))
    story.append(Paragraph(
        "Once a target domain is identified, the system conducts a multi-tier skill discrepancy analysis (implemented in <code>server/recommendationEngine.js</code>). The domain's catalog benchmark skills (<i>S<sub>domain</sub></i>) are compared against the candidate's verified skills (<i>S<sub>student</sub></i>) using set theory:",
        body_style
    ))
    story.append(Paragraph("• <b>Matched Skills:</b> <i>S<sub>student</sub> &cap; S<sub>domain</sub></i> &mdash; Technical tools the student already possesses (e.g. Python, SQL).", bullet_style))
    story.append(Paragraph("• <b>Skills to Improve:</b> Skills in <i>S<sub>student</sub></i> marked as 'Beginner' that are critical to the domain.", bullet_style))
    story.append(Paragraph("• <b>High-Priority Gaps:</b> <i>S<sub>domain</sub> \\ S<sub>student</sub></i> &mdash; Core industry tools completely absent from the student's profile (e.g. Power BI, Statistics, Tableau for Data Analytics).", bullet_style))

    story.append(Paragraph("<b>11.2 Illustrative Example: Student Targeting Data Analytics & BI</b>", h2_style))
    story.append(Paragraph(
        "Candidate Skills: <code>Python (Intermediate)</code>, <code>SQL (Intermediate)</code>, <code>HTML/CSS (Beginner)</code><br/>"
        "Target Domain Core Skills: <code>Python</code>, <code>SQL</code>, <code>Excel</code>, <code>Statistics</code>, <code>Data analysis</code>, <code>Power BI</code>, <code>Tableau</code>",
        body_style
    ))

    gap_table = [
        [Paragraph("<b>Classification</b>", table_header_style), Paragraph("<b>Skills Identified</b>", table_header_style), Paragraph("<b>Actionable System Guidance</b>", table_header_style)],
        [
            Paragraph("<b>Verified Strengths</b>", table_cell_bold),
            Paragraph("Python, SQL", table_cell_style),
            Paragraph("Marked as foundational prerequisites already completed. Student can skip basic programming tutorials.", table_cell_style)
        ],
        [
            Paragraph("<b>Skills to Improve</b>", table_cell_bold),
            Paragraph("HTML/CSS", table_cell_style),
            Paragraph("Low priority for analytics; deprioritized in roadmap to avoid cognitive overload.", table_cell_style)
        ],
        [
            Paragraph("<b>Critical Skill Gaps</b>", table_cell_bold),
            Paragraph("Excel, Statistics, Power BI, Tableau", table_cell_style),
            Paragraph("Inserted as core objectives into Phase 1 and Phase 2 of the personalized curriculum.", table_cell_style)
        ]
    ]
    t_gap = Table(gap_table, colWidths=[110, 140, 255])
    t_gap.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_navy),
        ('GRID', (0,0), (-1,-1), 0.5, c_border),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_gap)

    story.append(Paragraph("<b>11.3 Adaptive Phased Roadmap Structure</b>", h2_style))
    story.append(Paragraph(
        "The roadmap engine (<code>generateAdaptiveRoadmap</code>) generates four progressive milestones scaled dynamically by the student's weekly study commitment:",
        body_style
    ))
    story.append(Paragraph("• <b>Phase 1: Foundation & Tooling (2-3 Weeks):</b> Consolidates fundamental logic, sets up local IDE, Git, and environments. Deliverable: Working local development workspace.", bullet_style))
    story.append(Paragraph("• <b>Phase 2: Core Domain Deep-Dive (4-6 Weeks):</b> Bridges high-priority skill gaps through structured drills. Deliverable: Small-scale domain prototypes.", bullet_style))
    story.append(Paragraph("• <b>Phase 3: Portfolio Capstone Project (4-5 Weeks):</b> Builds an end-to-end production-quality application with unit tests and README. Deliverable: Public GitHub repository with live demo.", bullet_style))
    story.append(Paragraph("• <b>Phase 4: Interview & Placement Readiness (2-4 Weeks):</b> ATS-optimized resume formatting, technical question drills, and mock interview practice. Deliverable: Polished portfolio website and active applications.", bullet_style))

    story.append(PageBreak())

    # =========================================================================
    # SECTION 12: AUTHENTICATION AND DATA STORAGE
    # =========================================================================
    story.append(Paragraph("12. Authentication System & Data Isolation", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=c_border, spaceBefore=4, spaceAfter=10))

    story.append(Paragraph("<b>12.1 Security & Authentication Architecture</b>", h2_style))
    story.append(Paragraph(
        "CareerCompass AI implements industrial-standard security protocols to protect student identities and ensure per-student data privacy:",
        body_style
    ))
    story.append(Paragraph("• <b>Bcrypt Password Hashing:</b> Plaintext passwords are never stored. Upon registration, <code>bcrypt.hash(password, 10)</code> applies 10 salt rounds to generate a cryptographically irreversible 60-character hash (e.g. <code>$2b$10$...</code>).", bullet_style))
    story.append(Paragraph("• <b>JSON Web Tokens (JWT):</b> Upon valid login, the server generates a signed cryptographic token containing <code>{ userId, email, name }</code> with a 7-day expiration. The frontend stores this token in browser local storage and passes it in the <code>Authorization: Bearer &lt;token&gt;</code> header on all protected requests.", bullet_style))
    story.append(Paragraph("• <b>Middleware Route Protection:</b> The <code>authenticateToken</code> middleware intercepts requests to <code>/api/student/*</code> and <code>/api/recommend</code>. If the token is missing or invalid, the server immediately rejects the request with HTTP 401 Unauthorized.", bullet_style))

    story.append(Paragraph("<b>12.2 Per-Student Data Isolation Model</b>", h2_style))
    story.append(Paragraph(
        "To prevent one student from viewing or overwriting another student's assessment, data is strictly partitioned in file storage by <code>userId</code>:",
        body_style
    ))

    data_store_table = [
        [Paragraph("<b>Storage Entity</b>", table_header_style), Paragraph("<b>File Location</b>", table_header_style), Paragraph("<b>Data Structure & Isolation Mechanism</b>", table_header_style)],
        [
            Paragraph("User Accounts", table_cell_bold),
            Paragraph("<code>server/data/users.json</code>", table_cell_style),
            Paragraph("Dictionary keyed by <code>userId</code> storing <code>{ id, name, email, passwordHash, createdAt }</code>. Plaintext passwords never exist.", table_cell_style)
        ],
        [
            Paragraph("Student Profiles & Progress", table_cell_bold),
            Paragraph("<code>server/data/saved_profiles.json</code>", table_cell_style),
            Paragraph("Dictionary keyed strictly by <code>userId</code>. Endpoints look up <code>db[req.user.userId]</code>. A student cannot access any other key.", table_cell_style)
        ],
        [
            Paragraph("Password Resets", table_cell_bold),
            Paragraph("<code>server/data/password_resets.json</code>", table_cell_style),
            Paragraph("Dictionary keyed by secure reset tokens with 1-hour expiration timestamps.", table_cell_style)
        ],
        [
            Paragraph("Career Catalog", table_cell_bold),
            Paragraph("<code>server/data/career_domains.json</code>", table_cell_style),
            Paragraph("Static platform catalog detailing 13 engineering domains, potential roles, and benchmark skills.", table_cell_style)
        ]
    ]
    t_ds_iso = Table(data_store_table, colWidths=[110, 150, 245])
    t_ds_iso.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_navy),
        ('GRID', (0,0), (-1,-1), 0.5, c_border),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_ds_iso)

    story.append(Spacer(1, 10))
    story.append(Paragraph("<b>12.3 Name Synchronization & Greeting Bug Fix</b>", h2_style))
    story.append(Paragraph(
        "During early testing, an issue occurred where a newly logged-in student (<i>Vidhi Joshi</i>) saw the greeting <i>'Welcome back, Aarav Sharma!'</i> on their dashboard. Investigation revealed that the browser's local storage held a stale un-scoped cache key (<code>careercompass_profile</code>) left over from an earlier demo test. The issue was resolved across three layers: (1) Client storage was scoped to <code>careercompass_profile_${userId}</code>; (2) The Express backend now forcefully overrides any profile name with the authenticated account name <code>req.user.name</code>; and (3) The React dashboard greeting reads directly from <code>userName || profile.name</code>.",
        body_style
    ))

    story.append(PageBreak())

    # =========================================================================
    # SECTION 13: PROJECT FILE STRUCTURE
    # =========================================================================
    story.append(Paragraph("13. Project File Structure & Code Map", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=c_border, spaceBefore=4, spaceAfter=10))

    story.append(Paragraph(
        "The following guide outlines the essential files in the repository and indicates the recommended inspection order for beginners:",
        body_style
    ))

    files_table = [
        [Paragraph("<b>File / Folder</b>", table_header_style), Paragraph("<b>Inspection Order</b>", table_header_style), Paragraph("<b>Architectural Responsibility</b>", table_header_style)],
        [
            Paragraph("<code>client/src/App.tsx</code>", table_cell_bold),
            Paragraph("<b>#1</b> (Start Here)", table_cell_style),
            Paragraph("Central frontend orchestrator managing views (<code>auth</code>, <code>assessment</code>, <code>dashboard</code>), user session, and modal states.", table_cell_style)
        ],
        [
            Paragraph("<code>client/src/components/AuthPage.tsx</code>", table_cell_bold),
            Paragraph("#2", table_cell_style),
            Paragraph("Authentication interface: Sign In, Sign Up, and Password Reset screens with password strength validation.", table_cell_style)
        ],
        [
            Paragraph("<code>client/src/components/AssessmentWizard.tsx</code>", table_cell_bold),
            Paragraph("#3", table_cell_style),
            Paragraph("Step-by-step interactive student assessment capturing branch, year, skills, proficiencies, and career goals.", table_cell_style)
        ],
        [
            Paragraph("<code>client/src/components/Dashboard.tsx</code>", table_cell_bold),
            Paragraph("#4", table_cell_style),
            Paragraph("Personalized career dashboard rendering top-3 match cards, skill radar chart, and phased roadmap milestones.", table_cell_style)
        ],
        [
            Paragraph("<code>server/server.js</code>", table_cell_bold),
            Paragraph("<b>#5</b> (Backend Gateway)", table_cell_style),
            Paragraph("Primary Node/Express server hosting REST APIs, JWT authentication route guards, and orchestrating ML calls.", table_cell_style)
        ],
        [
            Paragraph("<code>server/recommendationEngine.js</code>", table_cell_bold),
            Paragraph("#6", table_cell_style),
            Paragraph("Multi-factor heuristic scoring engine and dynamic 4-phase adaptive roadmap generator.", table_cell_style)
        ],
        [
            Paragraph("<code>server/auth.js</code>", table_cell_bold),
            Paragraph("#7", table_cell_style),
            Paragraph("Security module handling bcrypt password hashing, token generation, and the <code>authenticateToken</code> middleware.", table_cell_style)
        ],
        [
            Paragraph("<code>ml/app.py</code>", table_cell_bold),
            Paragraph("<b>#8</b> (ML Service)", table_cell_style),
            Paragraph("FastAPI Python application exposing <code>/predict</code> and <code>/health</code> endpoints for Random Forest inference.", table_cell_style)
        ],
        [
            Paragraph("<code>ml/train_model.py</code>", table_cell_bold),
            Paragraph("#9", table_cell_style),
            Paragraph("Model training pipeline script executing data loading, stratified CV, Random Forest fitting, and joblib export.", table_cell_style)
        ],
        [
            Paragraph("<code>ml/preprocessing.py</code>", table_cell_bold),
            Paragraph("#10", table_cell_style),
            Paragraph("Feature transformers: <code>SkillMultiHotEncoder</code> and categorical <code>OneHotEncoder</code> in a <code>ColumnTransformer</code>.", table_cell_style)
        ],
        [
            Paragraph("<code>ml/artifacts/*.joblib</code>", table_cell_bold),
            Paragraph("#11", table_cell_style),
            Paragraph("Trained scikit-learn model artifact binary and accompanying <code>model_metadata.json</code>.", table_cell_style)
        ],
        [
            Paragraph("<code>test_complete_platform.js</code>", table_cell_bold),
            Paragraph("#12", table_cell_style),
            Paragraph("Automated end-to-end test suite testing health, authentication, password hashing, isolation, and recommendations.", table_cell_style)
        ]
    ]

    t_files = Table(files_table, colWidths=[150, 85, 270])
    t_files.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_navy),
        ('GRID', (0,0), (-1,-1), 0.5, c_border),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_files)

    story.append(PageBreak())

    # =========================================================================
    # SECTION 14: HOW TO RUN THE PROJECT LOCALLY
    # =========================================================================
    story.append(Paragraph("14. How to Run the Project Locally", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=c_border, spaceBefore=4, spaceAfter=10))

    story.append(Paragraph(
        "Follow these exact step-by-step instructions to run CareerCompass AI on a local computer:",
        body_style
    ))

    story.append(Paragraph("<b>Step 1: Prerequisites</b>", h2_style))
    story.append(Paragraph("• <b>Python:</b> Python 3.10+ (Python 3.14 verified in this workspace).<br/>• <b>Node.js:</b> Node.js v18+ (Node v24.19 verified).<br/>• <b>Browser:</b> Modern Chromium, Firefox, or Edge browser.", body_style))

    story.append(Paragraph("<b>Step 2: Install Dependencies</b>", h2_style))
    install_cmd = """
# 1. Install root, client, and server Node packages
npm run install:all

# 2. Install Python ML requirements
py -m pip install fastapi uvicorn scikit-learn pandas numpy openpyxl joblib pydantic
"""
    story.append(Paragraph(f"<pre>{install_cmd}</pre>", code_style))

    story.append(Paragraph("<b>Step 3: Start the FastAPI Machine Learning Service (Terminal 1)</b>", h2_style))
    ml_cmd = """
# Start FastAPI ML Microservice on Port 8000
py -m uvicorn ml.app:app --host 127.0.0.1 --port 8000
# Output should indicate: 'Application startup complete.' and 'Uvicorn running on http://127.0.0.1:8000'
"""
    story.append(Paragraph(f"<pre>{ml_cmd}</pre>", code_style))

    story.append(Paragraph("<b>Step 4: Start the Web Application & Backend (Terminal 2)</b>", h2_style))
    server_cmd = """
# Build the React client production bundle
cd client && npm run build && cd ..

# Start the Express server on Port 5000
node server/server.js
# Output: 'CareerCompass AI Server running on port 5000'
"""
    story.append(Paragraph(f"<pre>{server_cmd}</pre>", code_style))

    story.append(Paragraph("<b>Step 5: Access the Platform in Browser</b>", h2_style))
    story.append(Paragraph("Open <b><code>http://localhost:5000</code></b>. You will be greeted with the authentication screen. Sign up with a new student account or log in.", body_style))

    story.append(Paragraph("<b>Step 6: Run Automated Verification Tests</b>", h2_style))
    test_cmd = """
# Run complete end-to-end test suite (14 checks)
node test_complete_platform.js

# Run ML unit tests
py ml/test_ml_pipeline.py
"""
    story.append(Paragraph(f"<pre>{test_cmd}</pre>", code_style))

    story.append(PageBreak())

    # =========================================================================
    # SECTION 15: COMMON ERRORS AND TROUBLESHOOTING
    # =========================================================================
    story.append(Paragraph("15. Common Errors, Diagnosis & Troubleshooting", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=c_border, spaceBefore=4, spaceAfter=10))

    err_table = [
        [Paragraph("<b>Symptom / Error Message</b>", table_header_style), Paragraph("<b>Root Cause</b>", table_header_style), Paragraph("<b>Verification & Fix</b>", table_header_style)],
        [
            Paragraph("<b>FastAPI connection refused / 503 Service Unavailable</b>", table_cell_bold),
            Paragraph("FastAPI ML microservice is not running on port 8000.", table_cell_style),
            Paragraph("Open Terminal 1 and start uvicorn: <code>py -m uvicorn ml.app:app --host 127.0.0.1 --port 8000</code>. Verify at <code>http://127.0.0.1:8000/health</code>.", table_cell_style)
        ],
        [
            Paragraph("<b>Port 5000 already in use (EADDRINUSE)</b>", table_cell_bold),
            Paragraph("A previous instance of Node is still running in the background.", table_cell_style),
            Paragraph("Kill the stale process via PowerShell: <code>Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force</code>.", table_cell_style)
        ],
        [
            Paragraph("<b>Model artifact not found / FileNotFoundError</b>", table_cell_bold),
            Paragraph("The <code>.joblib</code> artifact has not been trained or was moved.", table_cell_style),
            Paragraph("Run the training script to regenerate the model: <code>py ml/train_model.py</code>. Verify that <code>career_rf_pipeline.joblib</code> exists in <code>ml/artifacts/</code>.", table_cell_style)
        ],
        [
            Paragraph("<b>HTTP 401 Unauthorized on Dashboard</b>", table_cell_bold),
            Paragraph("Session token has expired or is absent from local storage.", table_cell_style),
            Paragraph("Click Log In and re-authenticate. The client will store a fresh JWT in local storage.", table_cell_style)
        ],
        [
            Paragraph("<b>Changes in React components not showing in browser</b>", table_cell_bold),
            Paragraph("Express serves static production assets from <code>client/dist</code>.", table_cell_style),
            Paragraph("Run <code>cd client && npm run build</code> to compile TypeScript to <code>client/dist</code>, then refresh the browser (<code>Ctrl + F5</code>).", table_cell_style)
        ],
        [
            Paragraph("<b>Bcrypt build errors during npm install</b>", table_cell_bold),
            Paragraph("Native C++ node-gyp build dependencies missing.", table_cell_style),
            Paragraph("The project intentionally uses <b><code>bcryptjs</code></b> (pure JavaScript implementation) to guarantee seamless installation on Windows without C++ compilers.", table_cell_style)
        ]
    ]

    t_err = Table(err_table, colWidths=[120, 140, 245])
    t_err.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_navy),
        ('GRID', (0,0), (-1,-1), 0.5, c_border),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_err)

    story.append(PageBreak())

    # =========================================================================
    # SECTION 16: PROJECT LIMITATIONS AND FUTURE SCOPE
    # =========================================================================
    story.append(Paragraph("16. Project Limitations & Future Scope", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=c_border, spaceBefore=4, spaceAfter=10))

    story.append(Paragraph("<b>16.1 Honest Project Limitations</b>", h2_style))
    story.append(Paragraph("Every credible engineering project must acknowledge its boundaries. CareerCompass AI currently operates under the following known technical constraints:", body_style))
    story.append(Paragraph("• <b>Synthetic Training Data:</b> The 550 training profiles were generated using rule-based templates. While excellent for prototyping the pipeline, it does not capture the subtle nuances or contradictions of real human career decisions.", bullet_style))
    story.append(Paragraph("• <b>Domain Class Coverage:</b> The dataset contains 11 target classes, requiring the other 2 catalog domains (Chemical and AR/VR) to rely on heuristic fallback rules.", bullet_style))
    story.append(Paragraph("• <b>Static Skill Catalog:</b> Technical frameworks evolve rapidly. New tools (e.g. Next.js 15, Mojo, LangChain) must currently be added manually to the metadata catalog.", bullet_style))
    story.append(Paragraph("• <b>Local File-Based Storage:</b> While optimal for local execution and zero-dependency testing, production deployment at institutional scale would benefit from a relational database (PostgreSQL) with connection pooling.", bullet_style))

    story.append(Paragraph("<b>16.2 Strategic Future Scope</b>", h2_style))
    story.append(Paragraph("The platform was architected to support future evolutionary enhancements:", body_style))
    story.append(Paragraph("• <b>Human-in-the-Loop Feedback:</b> Introduce post-placement surveys where graduated students validate their career satisfaction, continuously retraining the Random Forest model on verified outcomes.", bullet_style))
    story.append(Paragraph("• <b>Conversational AI Assistant (LLM Integration):</b> Integrate a secure Large Language Model (e.g. Gemini 1.5 Flash) strictly as an interactive conversational tutor for explaining roadmap milestone concepts.", bullet_style))
    story.append(Paragraph("• <b>GitHub Portfolio Analyzer:</b> Allow students to connect their GitHub profile, automatically extracting their code repositories, commit activity, and language frequency to pre-fill their skills assessment.", bullet_style))
    story.append(Paragraph("• <b>Automated ATS Resume Parser:</b> Enable PDF resume uploads that automatically parse technical skills, academic performance, and branch background.", bullet_style))

    story.append(PageBreak())

    # =========================================================================
    # SECTION 17: VIVA & PRESENTATION PREPARATION (25 QUESTIONS)
    # =========================================================================
    story.append(Paragraph("17. Comprehensive Viva & Presentation Preparation", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=c_border, spaceBefore=4, spaceAfter=10))

    story.append(Paragraph("<b>17.1 The 1-Minute Elevator Pitch</b>", h2_style))
    story.append(Paragraph(
        "<i>'CareerCompass AI is a full-stack, AI-powered career recommendation platform specifically designed for engineering college students. Students often learn multiple programming languages and tools but struggle to identify which industry domain fits them best. Our platform assesses their technical skills, branch, and preferences, processes them through a trained Random Forest Classifier pipeline, ranks the top 3 matching career domains with transparent explainability, and automatically generates an adaptive, 4-phase milestone roadmap to help them bridge skill gaps and become placement-ready.'</i>",
        callout_style
    ))

    story.append(Paragraph("<b>17.2 The 3-Minute Comprehensive Presentation Structure</b>", h2_style))
    story.append(Paragraph(
        "<b>1. Problem Statement (45s):</b> Introduce the challenge of career ambiguity in engineering colleges. Highlight that students pick online courses randomly without understanding domain requirements.<br/>"
        "<b>2. Machine Learning Pipeline (60s):</b> Explain the Random Forest Classifier. Detail how skills are transformed via custom Multi-Hot encoding, how 200 trees vote to produce continuous class probabilities, and how the model was evaluated.<br/>"
        "<b>3. System Demo & Architecture (45s):</b> Show the React frontend connecting to Express on Port 5000 and FastAPI on Port 8000. Show user registration with Bcrypt and JWT, and display the personalized roadmap.<br/>"
        "<b>4. Results & Future Scope (30s):</b> Conclude with the importance of explainable AI over black-box predictions and outline future plans for real-world feedback loops.",
        body_style
    ))

    story.append(Paragraph("<b>17.3 Top 25 Viva Questions with Beginner-Friendly Answers</b>", h2_style))

    viva_qa = [
        ("Q1: What is the main objective of CareerCompass AI?", "To help engineering students discover optimal career domains based on their existing technical skills, branch, and working preferences, providing an explainable roadmap to bridge skill gaps."),
        ("Q2: Why did you choose Random Forest instead of a Single Decision Tree?", "A single decision tree easily overfits and has high variance. A Random Forest combines 200 diverse trees using bagging, voting across the ensemble to yield higher generalization and reliable probability distributions."),
        ("Q3: Why Random Forest instead of Deep Learning / Neural Networks?", "Tabular student data with categorical and multi-hot features is best handled by tree-based ensembles. Neural networks require massive datasets and act as black boxes, whereas Random Forests provide fast inference and feature importance explainability."),
        ("Q4: What is Supervised Learning?", "A machine learning paradigm where the model learns from labeled training examples consisting of input feature vectors X and corresponding target labels y."),
        ("Q5: What is Classification?", "Predicting a discrete category or class label (e.g. 'Software Development' vs. 'Cybersecurity') rather than a continuous numerical value (which would be regression)."),
        ("Q6: What is a Feature in Machine Learning?", "An individual measurable property or characteristic of a student profile used as an input to the model (e.g. Current_Skills, Student_Branch, Primary_Interest)."),
        ("Q7: What is the Target Variable in your project?", "'Recommended_Domain'—the ground-truth career classification label present in the training dataset."),
        ("Q8: What does predict_proba() do?", "Returns the percentage of decision trees in the forest that voted for each class, representing the model's confidence or probability distribution across all domains."),
        ("Q9: What does 100% accuracy on your synthetic dataset mean?", "It indicates that the Random Forest successfully learned the deterministic relationships present in the synthetic dataset without error. However, we acknowledge that real-world student data will require empirical validation."),
        ("Q10: What is Data Leakage and how did you prevent it?", "Data leakage occurs when information from outside the training dataset (or derived from the target) contaminates the model. We prevented it by explicitly dropping post-recommendation columns (e.g. Suggested_Career_Path, Roadmap_Steps) before training."),
        ("Q11: Why do you use Stratified K-Fold Cross Validation?", "Stratified K-Fold splits the dataset into folds while ensuring every fold has the exact same percentage of each domain class, preventing minority class starvation during validation."),
        ("Q12: What is Joblib and why is it used?", "Joblib is a Python library optimized for serializing large NumPy arrays and Scikit-Learn pipelines to disk, allowing instant model loading during server startup."),
        ("Q13: What is FastAPI and why is it used?", "FastAPI is a modern, high-performance Python web framework used to expose our trained model over a REST API (port 8000) with automatic Pydantic request validation."),
        ("Q14: How does the React frontend talk to the FastAPI model?", "The React frontend sends requests to the Express gateway (port 5000), which verifies the user's token and forward-proxies the profile to FastAPI (port 8000) via HTTP JSON."),
        ("Q15: Is your learning roadmap generated by AI?", "No. The domain recommendation uses Machine Learning, but the roadmap is generated by a deterministic parametric rules engine that tailors 4 milestone phases based on calculated skill gaps and study hours."),
        ("Q16: How is the Skill Gap calculated?", "Using set difference: Domain Core Skills minus Student Possessed Skills. Missing skills are prioritized into high, medium, and low urgency."),
        ("Q17: Why do you have 11 classes in the dataset but 13 domains in the catalog?", "The 11 core classes have synthetic ML training examples. Two newer disciplines (Chemical and AR/VR) use verified heuristic compatibility rules as a fallback."),
        ("Q18: What is Bcrypt and why is it used?", "Bcrypt is an adaptive cryptographic password hashing function. It incorporates random salts (10 rounds) to protect passwords against rainbow table and brute-force attacks."),
        ("Q19: What is a JSON Web Token (JWT)?", "A compact, URL-safe token containing cryptographically signed user claims, allowing stateless authentication across HTTP requests."),
        ("Q20: How do you prevent one student from viewing another student's data?", "All profile reads and writes in server/data/saved_profiles.json are keyed strictly by the verified req.user.userId extracted from the validated JWT token."),
        ("Q21: What is the purpose of the SkillMultiHotEncoder?", "Candidate skills are lists of strings. Standard encoders cannot parse comma-separated lists. The custom encoder creates a fixed-width binary vector where 1 indicates skill presence and 0 indicates absence."),
        ("Q22: What role does Tailwind CSS play?", "Tailwind provides utility classes for our custom SaaS visual design system, delivering responsive layouts, consistent navy/blue color tokens, and clean typography."),
        ("Q23: What is the difference between n_estimators and max_depth in Random Forest?", "n_estimators is the total count of decision trees in the forest (200 in our model). max_depth is the maximum depth allowed for each individual tree (None allows full expansion)."),
        ("Q24: What happens if a student inputs a skill not present in training data?", "The SkillMultiHotEncoder safely ignores unseen skills during transformation (yielding zeros), preventing runtime index errors or server crashes."),
        ("Q25: What is the single biggest limitation of the current project?", "The reliance on synthetic student training data rather than empirical, multi-year post-graduation career placement outcomes.")
    ]

    for q, a in viva_qa:
        story.append(Paragraph(f"<b>{q}</b>", h3_style))
        story.append(Paragraph(a, body_style))
        story.append(Spacer(1, 2))

    story.append(PageBreak())

    # =========================================================================
    # SECTION 18: GLOSSARY OF TECHNICAL TERMS
    # =========================================================================
    story.append(Paragraph("18. Glossary of Technical Terms", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=c_border, spaceBefore=4, spaceAfter=10))

    glossary = [
        ("Bagging (Bootstrap Aggregation)", "An ensemble meta-algorithm where multiple models are trained on random subsets of the dataset with replacement, and their outputs are averaged or voted on to reduce variance."),
        ("Bcrypt", "A password hashing function based on the Blowfish cipher, designed to remain computationally expensive over time to resist hardware-accelerated attacks."),
        ("ColumnTransformer", "A Scikit-Learn utility that applies different preprocessing transformers to different subsets of columns (e.g. multi-hot encoding for skills, one-hot for branch)."),
        ("Cross-Validation", "A statistical technique for assessing model generalization by partitioning data into multiple subsets and rotating training and testing roles."),
        ("Decision Tree", "A flowchart-like tree structure where internal nodes represent tests on features, branches represent outcomes, and leaf nodes represent final class labels."),
        ("Explainable AI (XAI)", "Methods and techniques in artificial intelligence that allow human experts to understand and trace how a machine learning model arrived at its predictions."),
        ("FastAPI", "A modern, asynchronous Python web framework for building APIs, leveraging Python type hints and Pydantic for high performance and automatic documentation."),
        ("Gini Impurity", "A mathematical metric measuring the probability of an element being incorrectly classified when chosen at random. Random Forests use it to pick optimal feature splits."),
        ("JWT (JSON Web Token)", "An open industry standard (RFC 7519) representing claims securely between two parties, typically used for stateless authentication."),
        ("Multi-Hot Encoding", "A vector representation where multiple entries in a binary array can be set to 1 simultaneously, representing the presence of multiple items (e.g. a student knowing Python AND SQL)."),
        ("One-Hot Encoding", "A vector representation for single-choice categorical variables where exactly one entry is set to 1 and all others are 0."),
        ("Overfitting", "A modeling error occurring when an algorithm learns noise and eccentricities of the training data so closely that it fails to generalize to new, unseen data."),
        ("Pydantic", "A data parsing and validation library for Python that uses type annotations to enforce schema integrity and data serialization."),
        ("Random Forest", "An ensemble learning method for classification and regression that operates by constructing a multitude of decision trees at training time and outputting class majority votes."),
        ("REST (Representational State Transfer)", "An architectural style for network applications relying on stateless client-server communication using standard HTTP verbs (GET, POST, PUT, DELETE)."),
        ("Scikit-Learn", "An open-source Python library providing simple and efficient tools for predictive data analysis and machine learning."),
        ("Set Difference", "A mathematical operation on two sets A and B that yields the elements belonging to A but not to B (used in our project to calculate skill gaps)."),
        ("Supervised Learning", "Machine learning where the algorithm is supplied with labeled training pairs consisting of input features and desired target outputs."),
        ("Target Leakage", "An error where information that will not be available at prediction time is inadvertently included in the training features, leading to falsely optimistic metrics."),
        ("Vite", "A frontend build tool that leverages native browser ES modules to deliver ultra-fast hot module replacement during development and optimized Rollup/esbuild production bundles.")
    ]

    gloss_table = [[Paragraph(f"<b>{term}</b>", table_cell_bold), Paragraph(defn, table_cell_style)] for term, defn in glossary]
    t_gloss = Table(gloss_table, colWidths=[140, 365])
    t_gloss.setStyle(TableStyle([
        ('LINEBELOW', (0,0), (-1,-1), 0.5, c_border),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('BACKGROUND', (0,0), (0,-1), c_light),
    ]))
    story.append(t_gloss)

    story.append(PageBreak())

    # =========================================================================
    # SECTION 19: FINAL QUICK-REVISION SHEET
    # =========================================================================
    story.append(Paragraph("19. Final Quick-Revision Sheet & System Summary", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=c_border, spaceBefore=4, spaceAfter=10))

    rev_data = [
        [Paragraph("<b>Key Dimension</b>", table_header_style), Paragraph("<b>Summary Specification</b>", table_header_style)],
        [Paragraph("Project Name", table_cell_bold), Paragraph("CareerCompass AI", table_cell_style)],
        [Paragraph("Core Mission", table_cell_bold), Paragraph("Intelligent, explainable career domain discovery and adaptive phased roadmaps for engineering students.", table_cell_style)],
        [Paragraph("Target Users", table_cell_bold), Paragraph("Engineering college students (1st through 4th Year) across Computing, Electronics, Electrical, Mechanical, Civil & Chemical disciplines.", table_cell_style)],
        [Paragraph("Frontend Stack", table_cell_bold), Paragraph("React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Vite (Served at <code>http://localhost:5000</code>).", table_cell_style)],
        [Paragraph("Backend Stack", table_cell_bold), Paragraph("Node.js, Express.js 5, Bcryptjs password hashing, JWT authentication (Port 5000).", table_cell_style)],
        [Paragraph("ML Stack & Microservice", table_cell_bold), Paragraph("Python 3.14, FastAPI, Uvicorn, Scikit-Learn, Pandas, NumPy, Joblib (Served at <code>http://127.0.0.1:8000</code>).", table_cell_style)],
        [Paragraph("Machine Learning Algorithm", table_cell_bold), Paragraph("<code>RandomForestClassifier(n_estimators=200, class_weight='balanced', random_state=42)</code>.", table_cell_style)],
        [Paragraph("Model Artifact", table_cell_bold), Paragraph("<code>ml/artifacts/career_rf_pipeline.joblib</code> (Includes custom <code>SkillMultiHotEncoder</code> & categorical <code>OneHotEncoder</code>).", table_cell_style)],
        [Paragraph("Training Dataset", table_cell_bold), Paragraph("<code>Engineering_Career_Recommendation_Dataset_550.xlsx</code> (550 synthetic engineering profiles across 11 classes).", table_cell_style)],
        [Paragraph("Target Variable", table_cell_bold), Paragraph("<code>Recommended_Domain</code> (Categorical label predicting ground-truth domain).", table_cell_style)],
        [Paragraph("Inference Mechanism", table_cell_bold), Paragraph("<code>predict_proba()</code> continuous class probabilities ranked into Top 3 recommended career domains.", table_cell_style)],
        [Paragraph("Roadmap Engine", table_cell_bold), Paragraph("Dynamic 4-phase parametric template rules engine scaled by weekly hours and set-difference skill gaps.", table_cell_style)],
        [Paragraph("Security & Data Model", table_cell_bold), Paragraph("Bcrypt salted hashing (10 rounds), signed JWT tokens, isolated profile storage in <code>server/data/saved_profiles.json</code>.", table_cell_style)],
        [Paragraph("Evaluation Metric", table_cell_bold), Paragraph("100% Stratified 5-Fold Cross-Validation accuracy on synthetic benchmark data; zero target leakage.", table_cell_style)],
        [Paragraph("Verified Status", table_cell_bold), Paragraph("End-to-End verified: all 14 platform tests and 7 ML unit tests passing cleanly.", table_cell_style)]
    ]

    t_rev = Table(rev_data, colWidths=[140, 365])
    t_rev.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_navy),
        ('GRID', (0,0), (-1,-1), 0.5, c_border),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('BACKGROUND', (0,1), (0,-1), c_light),
    ]))
    story.append(t_rev)

    story.append(Spacer(1, 15))
    story.append(Paragraph("<b>Final Takeaway for Your Presentation:</b>", h2_style))
    story.append(Paragraph(
        "CareerCompass AI proves how modern machine learning and full-stack web engineering can merge to solve genuine educational challenges. By combining <b>supervised Random Forest classification for domain prediction</b> with <b>deterministic explainable logic for skill gaps and roadmaps</b>, the platform provides students with transparent, actionable, and trustworthy guidance without relying on opaque black-box systems.",
        callout_style
    ))

    # Build the document with NumberedCanvas
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"[*] PDF generation complete: {filename}")


if __name__ == "__main__":
    out_file = "CareerCompass_AI_Complete_Project_Guide.pdf"
    if len(sys.argv) > 1:
        out_file = sys.argv[1]
    build_pdf(out_file)
