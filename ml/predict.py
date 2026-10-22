"""
Prediction module for CareerCompass AI
Accepts a student profile, applies the fitted Random Forest pipeline,
and returns the ranked top 3 career domains with explainable factors.
"""

import os
import sys
import json
import joblib
import pandas as pd
import numpy as np

# Ensure ml directory is on sys.path for unpickling custom transformers
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
if CURRENT_DIR not in sys.path:
    sys.path.insert(0, CURRENT_DIR)

from preprocessing import ALL_INPUT_FEATURES

ARTIFACTS_DIR = os.path.join(CURRENT_DIR, 'artifacts')
PIPELINE_PATH = os.path.join(ARTIFACTS_DIR, 'career_rf_pipeline.joblib')
METADATA_PATH = os.path.join(ARTIFACTS_DIR, 'model_metadata.json')
CATALOG_PATH = os.path.join(CURRENT_DIR, '..', 'data', 'career_domains.json')

# Cache loaded pipeline
_PIPELINE = None
_METADATA = None
_CATALOG = None

def load_model_artifacts():
    global _PIPELINE, _METADATA, _CATALOG
    if _PIPELINE is None:
        if not os.path.exists(PIPELINE_PATH):
            raise FileNotFoundError(f"Model pipeline not found at {PIPELINE_PATH}. Run ml/train_model.py first.")
        _PIPELINE = joblib.load(PIPELINE_PATH)

    if _METADATA is None and os.path.exists(METADATA_PATH):
        with open(METADATA_PATH, 'r', encoding='utf-8') as f:
            _METADATA = json.load(f)

    if _CATALOG is None and os.path.exists(CATALOG_PATH):
        try:
            with open(CATALOG_PATH, 'r', encoding='utf-8') as f:
                _CATALOG = json.load(f)
        except Exception:
            _CATALOG = []
    return _PIPELINE, _METADATA, _CATALOG

def normalize_profile_input(profile_raw: dict) -> pd.DataFrame:
    """
    Normalizes field names across snake_case, camelCase, and PascalCase formats.
    """
    # 1. Branch
    branch = (
        profile_raw.get('student_branch') or
        profile_raw.get('branch') or
        profile_raw.get('Student_Branch') or
        'Computer Engineering'
    )

    # 2. Year
    year = (
        profile_raw.get('study_year') or
        profile_raw.get('year') or
        profile_raw.get('Study_Year') or
        '2nd Year'
    )

    # 3. Skills
    skills_raw = (
        profile_raw.get('current_skills') or
        profile_raw.get('skills') or
        profile_raw.get('Current_Skills') or
        []
    )
    if isinstance(skills_raw, list):
        skill_names = []
        for s in skills_raw:
            if isinstance(s, dict) and 'name' in s:
                skill_names.append(s['name'])
            elif isinstance(s, str):
                skill_names.append(s)
        skills_str = ', '.join(skill_names)
    elif isinstance(skills_raw, str):
        skills_str = skills_raw
    else:
        skills_str = ''

    # 4. Primary Interest
    interest = (
        profile_raw.get('primary_interest') or
        profile_raw.get('primaryInterest') or
        profile_raw.get('Primary_Interest') or
        ''
    )
    if not interest and isinstance(profile_raw.get('interests'), list) and profile_raw['interests']:
        interest = profile_raw['interests'][0]
    if not interest:
        interest = 'building applications'

    # 5. Work Style
    work_style = (
        profile_raw.get('work_style_preference') or
        profile_raw.get('workStylePreference') or
        profile_raw.get('Work_Style_Preference') or
        ''
    )
    if not work_style and isinstance(profile_raw.get('workStyles'), list) and profile_raw['workStyles']:
        work_style = profile_raw['workStyles'][0]
    if not work_style:
        work_style = 'hands-on building'

    # 6. Personality Traits
    personality = (
        profile_raw.get('personality_traits') or
        profile_raw.get('personalityTraits') or
        profile_raw.get('Personality_Traits') or
        'curious and experimental'
    )

    # 7. Academic Performance
    academic = (
        profile_raw.get('academic_performance') or
        profile_raw.get('academicPerformance') or
        profile_raw.get('Academic_Performance') or
        'Intermediate'
    )

    # 8. Certifications
    certs = (
        profile_raw.get('certifications') or
        profile_raw.get('Certifications') or
        'None yet'
    )

    # 9. Career Aspiration
    aspiration = (
        profile_raw.get('career_aspiration') or
        profile_raw.get('aspiration') or
        profile_raw.get('Career_Aspiration') or
        'internship first'
    )

    row = {
        'Student_Branch': str(branch),
        'Study_Year': str(year),
        'Current_Skills': str(skills_str),
        'Primary_Interest': str(interest),
        'Work_Style_Preference': str(work_style),
        'Personality_Traits': str(personality),
        'Academic_Performance': str(academic),
        'Certifications': str(certs),
        'Career_Aspiration': str(aspiration)
    }

    return pd.DataFrame([row])

def predict_career_domains(profile_raw: dict, top_n: int = 3) -> dict:
    """
    Inference function: Returns ranked top N career recommendations
    with estimated class probabilities, explainability, matching skills, and gaps.
    """
    pipeline, metadata, catalog = load_model_artifacts()

    # Preprocess and normalize single sample input
    input_df = normalize_profile_input(profile_raw)

    # Predict class probabilities
    probas = pipeline.predict_proba(input_df)[0]
    classes = pipeline.classes_

    # Sort classes descending by probability
    ranked_indices = np.argsort(probas)[::-1]

    # Extract student's current skills list
    student_skills_raw = input_df['Current_Skills'].iloc[0].split(',')
    student_skills_set = set(s.strip().lower() for s in student_skills_raw if s.strip())

    catalog_map = {}
    if catalog:
        for item in catalog:
            catalog_map[item.get('Career_Domain', '').lower()] = item

    recommendations = []
    for rank_idx in ranked_indices:
        domain_name = classes[rank_idx]
        prob = float(probas[rank_idx])

        # Domain metadata from catalog
        cat_info = catalog_map.get(domain_name.lower(), {})
        domain_skills_raw = cat_info.get('Relevant_Skills', '')
        domain_skills = [s.strip() for s in domain_skills_raw.split(',') if s.strip()] if domain_skills_raw else []

        matching_skills = []
        skill_gaps = []

        for ds in domain_skills:
            if ds.lower() in student_skills_set or any(ds.lower() in s for s in student_skills_set):
                matching_skills.append(ds)
            else:
                skill_gaps.append(ds)

        potential_roles = cat_info.get('Potential_Roles', '')
        roles_list = [r.strip() for r in potential_roles.split(',') if r.strip()] if potential_roles else [f"{domain_name} Intern"]

        # Formulate clear, non-inflated explainability
        reasons = []
        if matching_skills:
            reasons.append(f"Direct foundation in {', '.join(matching_skills[:3])}")
        
        interest = input_df['Primary_Interest'].iloc[0]
        reasons.append(f"Strong model association with your interest in {interest}")

        branch = input_df['Student_Branch'].iloc[0]
        reasons.append(f"Aligned with {branch} curriculum concepts")

        rec = {
            "domain": domain_name,
            "score": round(prob, 4),
            "estimated_probability_percent": round(prob * 100, 2),
            "matching_skills": matching_skills,
            "skill_gaps": skill_gaps[:6],
            "career_roles": roles_list[:4],
            "explanation": " • ".join(reasons)
        }
        recommendations.append(rec)

    # Return top N as well as full distribution for hybrid scoring
    top_recommendations = recommendations[:top_n]
    all_scores = {classes[i]: round(float(probas[i]), 4) for i in range(len(classes))}

    return {
        "success": True,
        "recommendations": top_recommendations,
        "all_scores": all_scores,
        "model_version": metadata.get("model_version", "2.0.0") if metadata else "2.0.0",
        "model_type": "RandomForestClassifier",
        "total_classes_evaluated": len(classes),
        "disclaimer": (
            "Model scores reflect Random Forest class probabilities estimated from synthetic training data. "
            "They indicate algorithmic profile match rather than guaranteed employment outcomes."
        )
    }

if __name__ == '__main__':
    # CLI demonstration test or stdin pipe
    sample_profile = {
        "student_branch": "Computer Engineering",
        "study_year": "2nd Year",
        "current_skills": ["Python", "SQL", "HTML", "CSS", "Git"],
        "primary_interest": "building applications",
        "work_style_preference": "hands-on building",
        "academic_performance": "Intermediate",
        "certifications": "None yet",
        "career_aspiration": "internship first"
    }

    if '--stdin' in sys.argv:
        try:
            stdin_data = sys.stdin.read().strip()
            if stdin_data:
                sample_profile = json.loads(stdin_data)
        except Exception as e:
            print(f"Error parsing JSON from stdin: {e}", file=sys.stderr)
    elif len(sys.argv) > 1 and sys.argv[1].startswith('{'):
        try:
            sample_profile = json.loads(sys.argv[1])
        except Exception as e:
            print(f"Error parsing JSON argument: {e}", file=sys.stderr)

    result = predict_career_domains(sample_profile)
    print(json.dumps(result, indent=2))
