"""
Automated Test Suite for CareerCompass AI Machine Learning Pipeline & API
Verifies model serialization, target leakage prevention, edge cases,
probabilities, distinct branch predictions, and API responses.
"""

import os
import sys
import json
import joblib
import unittest
import numpy as np
import pandas as pd

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
if CURRENT_DIR not in sys.path:
    sys.path.insert(0, CURRENT_DIR)

from predict import predict_career_domains, load_model_artifacts
from preprocessing import ALL_INPUT_FEATURES

ARTIFACTS_DIR = os.path.join(CURRENT_DIR, 'artifacts')
PIPELINE_PATH = os.path.join(ARTIFACTS_DIR, 'career_rf_pipeline.joblib')
METADATA_PATH = os.path.join(ARTIFACTS_DIR, 'model_metadata.json')

class TestMLPipeline(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.pipeline, cls.metadata, cls.catalog = load_model_artifacts()

    def test_01_artifacts_exist_and_loaded(self):
        """Verify model pipeline and metadata are present and loaded."""
        self.assertIsNotNone(self.pipeline, "Pipeline failed to load")
        self.assertIsNotNone(self.metadata, "Metadata failed to load")
        self.assertEqual(len(self.pipeline.classes_), 11, "Expected 11 trained domain classes")
        self.assertEqual(self.metadata["num_classes"], 11)

    def test_02_target_leakage_prevention(self):
        """Verify that downstream/target columns are NOT in input features."""
        forbidden_cols = [
            'Profile_ID', 'Recommended_Domain', 'Suggested_Career_Path',
            'Roadmap_Step_1', 'Roadmap_Step_6', 'Potential_Job_Opportunities',
            'Portfolio_Project_Ideas', 'Learning_Resources', 'Dataset_Note'
        ]
        for col in forbidden_cols:
            self.assertNotIn(col, ALL_INPUT_FEATURES, f"Target leakage! {col} found in input features")

    def test_03_unknown_skills_edge_case(self):
        """Verify that unseen or invented skill names do not crash inference."""
        edge_profile = {
            "student_branch": "Computer Engineering",
            "study_year": "1st Year",
            "current_skills": ["ImaginarySkillAlpha", "UnknownBetaTool", "NonExistentLanguage"],
            "primary_interest": "building applications",
            "work_style_preference": "hands-on building"
        }
        res = predict_career_domains(edge_profile)
        self.assertTrue(res["success"])
        self.assertEqual(len(res["recommendations"]), 3)
        self.assertIn("domain", res["recommendations"][0])
        self.assertGreaterEqual(res["recommendations"][0]["score"], 0.0)

    def test_04_missing_fields_edge_case(self):
        """Verify that missing optional fields default safely without crashing."""
        minimal_profile = {
            "current_skills": ["Python"]
        }
        res = predict_career_domains(minimal_profile)
        self.assertTrue(res["success"])
        self.assertEqual(len(res["recommendations"]), 3)

    def test_05_probability_sum_and_confidence(self):
        """Verify predict_proba outputs valid non-negative probabilities."""
        sample_profile = {
            "student_branch": "Information Technology",
            "study_year": "2nd Year",
            "current_skills": ["Python", "SQL", "Excel", "Statistics"],
            "primary_interest": "working with data and patterns",
            "work_style_preference": "analytical problem-solving"
        }
        res = predict_career_domains(sample_profile)
        top1 = res["recommendations"][0]
        self.assertGreaterEqual(top1["score"], 0.0)
        self.assertLessEqual(top1["score"], 1.0)
        self.assertEqual(top1["domain"], "Data Analytics & BI")

    def test_06_diverse_predictions_across_branches(self):
        """Verify that distinct student profiles receive distinct recommendations."""
        # 1. Software Profile
        sw_profile = {
            "student_branch": "Computer Engineering",
            "current_skills": ["React", "JavaScript", "Node.js", "Python"],
            "primary_interest": "building applications"
        }
        sw_res = predict_career_domains(sw_profile)

        # 2. Civil Profile
        civil_profile = {
            "student_branch": "Civil Engineering",
            "current_skills": ["AutoCAD", "Revit", "BIM basics"],
            "primary_interest": "buildings, structures and digital construction"
        }
        civil_res = predict_career_domains(civil_profile)

        # 3. Mechanical Profile
        mech_profile = {
            "student_branch": "Mechanical Engineering",
            "current_skills": ["SolidWorks", "CAD", "CNC basics"],
            "primary_interest": "product design and manufacturing"
        }
        mech_res = predict_career_domains(mech_profile)

        # 4. Power / Renewable Profile
        elec_profile = {
            "student_branch": "Electrical Engineering",
            "current_skills": ["Circuit analysis", "MATLAB", "Power systems"],
            "primary_interest": "power systems and sustainability"
        }
        elec_res = predict_career_domains(elec_profile)

        top_sw = sw_res["recommendations"][0]["domain"]
        top_civil = civil_res["recommendations"][0]["domain"]
        top_mech = mech_res["recommendations"][0]["domain"]
        top_elec = elec_res["recommendations"][0]["domain"]

        self.assertEqual(top_sw, "Software Development")
        self.assertEqual(top_civil, "Civil Design & BIM")
        self.assertEqual(top_mech, "Mechanical Design & Manufacturing")
        self.assertEqual(top_elec, "Electrical & Renewable Energy")

        # Distinct check
        domains = [top_sw, top_civil, top_mech, top_elec]
        self.assertEqual(len(set(domains)), 4, "Predictions across branches must be distinct")

    def test_07_explanation_and_skill_gaps(self):
        """Verify that explainability, matching skills, and gaps are present and accurate."""
        profile = {
            "student_branch": "Computer Engineering",
            "current_skills": ["Python", "SQL"],
            "primary_interest": "building applications"
        }
        res = predict_career_domains(profile)
        top_rec = res["recommendations"][0]

        self.assertIn("Python", top_rec["matching_skills"])
        self.assertIn("SQL", top_rec["matching_skills"])
        self.assertTrue(len(top_rec["skill_gaps"]) > 0)
        self.assertTrue(len(top_rec["career_roles"]) > 0)
        self.assertTrue("building applications" in top_rec["explanation"])

if __name__ == '__main__':
    unittest.main()
