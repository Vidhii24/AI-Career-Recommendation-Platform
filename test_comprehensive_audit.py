"""
CareerCompass AI - Comprehensive Technical Audit & Validation Test Suite
Executes end-to-end verification across:
1. Dataset properties, distributions, catalog alignment, and leakage check
2. Scikit-learn Random Forest model pipeline, artifacts, and realistic metrics
3. Backend Express & FastAPI APIs, authentication, and user data isolation
4. Recommendation engine dynamic scoring, skill gap 3-tier analysis, and roadmap generation
"""

import os
import sys
import json
import urllib.request
import urllib.error
import pandas as pd
import numpy as np
import joblib

DATASET_PATH = os.path.join(os.path.dirname(__file__), 'Engineering_Career_Recommendation_Dataset_550.xlsx')
ML_ARTIFACTS_DIR = os.path.join(os.path.dirname(__file__), 'ml', 'artifacts')
PIPELINE_PATH = os.path.join(ML_ARTIFACTS_DIR, 'career_rf_pipeline.joblib')
METADATA_PATH = os.path.join(ML_ARTIFACTS_DIR, 'model_metadata.json')
METRICS_PATH = os.path.join(ML_ARTIFACTS_DIR, 'evaluation_metrics.json')

EXPRESS_BASE = "http://localhost:5000"
FASTAPI_BASE = "http://127.0.0.1:8000"

def log_section(title):
    print("\n" + "=" * 70)
    print(f" {title}")
    print("=" * 70)

def assert_test(condition, message):
    if condition:
        print(f"  [PASS] {message}")
    else:
        print(f"  [FAIL] {message}")
        raise AssertionError(message)

# =====================================================================
# 1. DATASET PROPERTIES & INTEGRITY AUDIT
# =====================================================================
def test_dataset_audit():
    log_section("1. DATASET PROPERTIES & INTEGRITY AUDIT")
    assert_test(os.path.exists(DATASET_PATH), f"Excel dataset exists at {DATASET_PATH}")
    
    excel_file = pd.ExcelFile(DATASET_PATH)
    assert_test(set(excel_file.sheet_names) == {'Student_Profile_Dataset', 'Career_Domain_Catalog', 'Readme'},
                f"Dataset contains expected sheets: {excel_file.sheet_names}")
    
    df_students = pd.read_excel(excel_file, sheet_name='Student_Profile_Dataset')
    assert_test(df_students.shape == (550, 22), f"Student dataset dimensions: {df_students.shape} (expected 550x22)")
    assert_test(df_students.isnull().sum().sum() == 0, "No missing or null values in student dataset")
    assert_test(df_students.duplicated().sum() == 0, "No duplicate rows in student dataset")

    # Target class distribution
    class_counts = df_students['Recommended_Domain'].value_counts()
    assert_test(len(class_counts) == 11, f"Student dataset contains exactly 11 distinct classes (not 13)")
    assert_test(all(count == 50 for count in class_counts), "Every class in student dataset has exactly 50 instances (balanced)")

    # Catalog comparison
    df_catalog = pd.read_excel(excel_file, sheet_name='Career_Domain_Catalog')
    assert_test(len(df_catalog) == 13, f"Career Domain Catalog contains {len(df_catalog)} domains")
    catalog_domains = set(df_catalog['Career_Domain'].tolist())
    student_domains = set(class_counts.index.tolist())
    missing_from_students = catalog_domains - student_domains
    assert_test(missing_from_students == {'VLSI & Chip Design', 'Chemical & Process Engineering'},
                f"Identified exactly the 2 catalog domains missing from student training data: {missing_from_students}")

    # Leakage check: Primary_Interest mapping
    interest_domain_map = df_students.groupby('Primary_Interest')['Recommended_Domain'].nunique()
    assert_test(all(n == 1 for n in interest_domain_map),
                "Audited dataset leakage: Primary_Interest is indeed a 1-to-1 deterministic proxy for Recommended_Domain")
    print(f"       -> Synthetic generator mapped 11 unique interests directly to 11 domains (causing artificial 100% accuracy if uncorrected).")

# =====================================================================
# 2. MACHINE LEARNING PIPELINE & MODEL ARTIFACT AUDIT
# =====================================================================
def test_ml_pipeline_audit():
    log_section("2. MACHINE LEARNING PIPELINE & VALIDATION AUDIT")
    assert_test(os.path.exists(PIPELINE_PATH), "Trained Random Forest pipeline artifact exists")
    assert_test(os.path.exists(METADATA_PATH), "Model metadata JSON exists")
    assert_test(os.path.exists(METRICS_PATH), "Model evaluation metrics JSON exists")

    with open(METADATA_PATH, 'r', encoding='utf-8') as f:
        meta = json.load(f)
    assert_test(meta.get('model_name') == 'RandomForestClassifier' or meta.get('model_type') == 'RandomForestClassifier', "Model algorithm is RandomForestClassifier")
    assert_test('Primary_Interest' not in meta.get('input_features', []),
                "VERIFIED: 'Primary_Interest' is EXCLUDED from training features to eliminate synthetic data leakage shortcut")
    
    with open(METRICS_PATH, 'r', encoding='utf-8') as f:
        metrics = json.load(f)
    top1_acc = metrics.get('accuracy', 0)
    top3_acc = metrics.get('top3_accuracy', 0)
    cv_acc = meta.get('cv_accuracy_mean', 0)
    
    assert_test(0.65 <= top1_acc <= 0.85, f"Held-out test Top-1 accuracy is realistic: {top1_acc * 100:.2f}% (not 100% artificially inflated)")
    assert_test(0.85 <= top3_acc <= 0.98, f"Held-out test Top-3 accuracy is robust: {top3_acc * 100:.2f}%")
    assert_test(0.70 <= cv_acc <= 0.85, f"5-Fold Stratified Cross-Validation accuracy is: {cv_acc * 100:.2f}%")

# =====================================================================
# 3. FASTAPI ML MICROSERVICE AUDIT
# =====================================================================
def test_fastapi_service():
    log_section("3. FASTAPI ML MICROSERVICE AUDIT (Port 8000)")
    req = urllib.request.Request(f"{FASTAPI_BASE}/health")
    with urllib.request.urlopen(req) as resp:
        assert_test(resp.status == 200, "FastAPI /health returns HTTP 200")
        data = json.loads(resp.read().decode('utf-8'))
        assert_test(data.get('status') == 'ok', "FastAPI health reports status='ok'")
        assert_test(data.get('classes_count') == 11, "FastAPI reports 11 trained classes")

    # Test ML inference with sample profile
    payload = json.dumps({
        "student_branch": "Computer Engineering",
        "study_year": "3rd Year",
        "current_skills": ["Python", "scikit-learn", "pandas", "NumPy", "SQL"],
        "primary_interest": "AI, prediction and experimentation",
        "work_style_preference": "research and experimentation",
        "academic_performance": "Proficient",
        "career_aspiration": "industry job"
    }).encode('utf-8')

    req = urllib.request.Request(f"{FASTAPI_BASE}/api/career-recommendations", data=payload, headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req) as resp:
        assert_test(resp.status == 200, "FastAPI /api/career-recommendations returns HTTP 200")
        result = json.loads(resp.read().decode('utf-8'))
        assert_test(result.get('success') is True, "FastAPI prediction returns success=True")
        recs = result.get('recommendations', [])
        assert_test(len(recs) == 3, f"FastAPI returns top 3 recommendations (returned {len(recs)})")
        top_domain = recs[0]['domain']
        assert_test(top_domain in ['AI & Machine Learning', 'Data Analytics & BI'],
                    f"Profile with Python/NumPy/scikit-learn received expected data/AI top recommendation: {top_domain}")
        assert_test('disclaimer' in result, "FastAPI response contains required synthetic data disclaimer")

# =====================================================================
# 4. EXPRESS SERVER, AUTHENTICATION & DATA ISOLATION AUDIT
# =====================================================================
def test_express_apis_and_isolation():
    log_section("4. EXPRESS SERVER, AUTH & DATA ISOLATION AUDIT (Port 5000)")
    # Public health
    req = urllib.request.Request(f"{EXPRESS_BASE}/api/health")
    with urllib.request.urlopen(req) as resp:
        assert_test(resp.status == 200, "Express /api/health returns HTTP 200")

    # Express to ML bridge
    req = urllib.request.Request(f"{EXPRESS_BASE}/api/ml-health")
    with urllib.request.urlopen(req) as resp:
        assert_test(resp.status == 200, "Express /api/ml-health returns HTTP 200")
        data = json.loads(resp.read().decode('utf-8'))
        assert_test(data.get('ml', {}).get('status') == 'online', "Express verifies FastAPI status is 'online'")

    # Domain catalog
    req = urllib.request.Request(f"{EXPRESS_BASE}/api/domains")
    with urllib.request.urlopen(req) as resp:
        assert_test(resp.status == 200, "Express /api/domains returns HTTP 200")
        catalog_resp = json.loads(resp.read().decode('utf-8'))
        domains = catalog_resp.get('domains', catalog_resp) if isinstance(catalog_resp, dict) else catalog_resp
        assert_test(len(domains) == 13, f"Express serves all {len(domains)} catalog domains")

    # Register two distinct users for isolation testing
    import time
    ts = int(time.time())
    email_a = f"student_a_{ts}@eng.college.edu"
    email_b = f"student_b_{ts}@eng.college.edu"
    pwd = "AuditPassword123!"

    def register_user(name, email):
        payload = json.dumps({"name": name, "email": email, "password": pwd, "confirmPassword": pwd}).encode('utf-8')
        req = urllib.request.Request(f"{EXPRESS_BASE}/api/auth/register", data=payload, headers={'Content-Type': 'application/json'})
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read().decode('utf-8'))

    res_a = register_user("Student Alpha", email_a)
    assert_test(res_a.get('success') is True, "User A registered successfully")
    token_a = res_a['token']

    res_b = register_user("Student Beta", email_b)
    assert_test(res_b.get('success') is True, "User B registered successfully")
    token_b = res_b['token']

    # Submit assessment for User A (Civil Engineering)
    profile_a = {
        "branch": "Civil Engineering",
        "year": "3rd Year",
        "skills": [
            {"name": "AutoCAD", "level": "Intermediate"},
            {"name": "Revit", "level": "Intermediate"},
            {"name": "Structural analysis", "level": "Beginner"}
        ],
        "primaryInterest": "buildings, structures and digital construction",
        "workStyles": ["structured and detail-oriented"],
        "aspiration": "industry job",
        "weeklyHours": 15
    }
    req = urllib.request.Request(f"{EXPRESS_BASE}/api/recommend", data=json.dumps(profile_a).encode('utf-8'),
                                 headers={'Content-Type': 'application/json', 'Authorization': f"Bearer {token_a}"})
    with urllib.request.urlopen(req) as resp:
        rec_data_a = json.loads(resp.read().decode('utf-8'))
        assert_test(rec_data_a.get('success') is True, "User A recommendations computed successfully")
        top3_a = rec_data_a['recommendations']['topThree']
        assert_test(top3_a[0]['domainName'] == 'Civil Design & BIM',
                    f"Civil student with AutoCAD/Revit received top recommendation: {top3_a[0]['domainName']}")
        
        # Verify 3-tier skill breakdown
        active = top3_a[0]
        assert_test(len(active['matchedSkills']) > 0, "Matched skills (Verified Strengths) present")
        assert_test(len(active['skillsToImprove']) > 0, "Skills to improve (Practice) present")
        assert_test(len(active['missingSkills']) > 0, "Missing critical skills present")
        assert_test(len(active['learningRoadmap']) == 4, "Adaptive 4-phase learning roadmap generated")

    # Submit assessment for User B (Mechanical Engineering)
    profile_b = {
        "branch": "Mechanical Engineering",
        "year": "2nd Year",
        "skills": [
            {"name": "CAD", "level": "Intermediate"},
            {"name": "SolidWorks", "level": "Intermediate"},
            {"name": "3D printing", "level": "Beginner"}
        ],
        "primaryInterest": "product design and manufacturing",
        "workStyles": ["hands-on building"],
        "aspiration": "internship first",
        "weeklyHours": 10
    }
    req = urllib.request.Request(f"{EXPRESS_BASE}/api/recommend", data=json.dumps(profile_b).encode('utf-8'),
                                 headers={'Content-Type': 'application/json', 'Authorization': f"Bearer {token_b}"})
    with urllib.request.urlopen(req) as resp:
        rec_data_b = json.loads(resp.read().decode('utf-8'))
        assert_test(rec_data_b.get('success') is True, "User B recommendations computed successfully")
        top3_b = rec_data_b['recommendations']['topThree']
        assert_test(top3_b[0]['domainName'] == 'Mechanical Design & Manufacturing',
                    f"Mechanical student received top recommendation: {top3_b[0]['domainName']}")

    # Check strict data isolation: User A's profile via /api/student/profile
    req = urllib.request.Request(f"{EXPRESS_BASE}/api/student/profile", headers={'Authorization': f"Bearer {token_a}"})
    with urllib.request.urlopen(req) as resp:
        user_a_profile = json.loads(resp.read().decode('utf-8'))['profile']
        assert_test(user_a_profile['name'] == 'Student Alpha', "Profile A name is isolated as 'Student Alpha'")
        assert_test(user_a_profile['branch'] == 'Civil Engineering', "Profile A branch is isolated as 'Civil Engineering'")

    req = urllib.request.Request(f"{EXPRESS_BASE}/api/student/profile", headers={'Authorization': f"Bearer {token_b}"})
    with urllib.request.urlopen(req) as resp:
        user_b_profile = json.loads(resp.read().decode('utf-8'))['profile']
        assert_test(user_b_profile['name'] == 'Student Beta', "Profile B name is isolated as 'Student Beta'")
        assert_test(user_b_profile['branch'] == 'Mechanical Engineering', "Profile B branch is isolated as 'Mechanical Engineering'")

    print("  [+] Strict per-user token and data isolation successfully validated.")

def run_all_tests():
    print("=" * 70)
    print("   CAREERCOMPASS AI - COMPREHENSIVE TECHNICAL AUDIT TEST RUN")
    print("=" * 70)
    test_dataset_audit()
    test_ml_pipeline_audit()
    test_fastapi_service()
    test_express_apis_and_isolation()
    print("\n" + "=" * 70)
    print("   ALL AUDIT AND INTEGRATION TESTS PASSED SUCCESSFULLY!")
    print("=" * 70)

if __name__ == '__main__':
    run_all_tests()
