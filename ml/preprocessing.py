"""
Preprocessing pipeline for CareerCompass AI Random Forest Model.
Handles multi-hot encoding of comma-separated or list-based skills,
and one-hot encoding of student categorical attributes.
"""

import numpy as np
import pandas as pd
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder

def normalize_skill_name(skill: str) -> str:
    """Normalizes skill string for uniform comparison."""
    if not skill or not isinstance(skill, str):
        return ""
    return skill.strip().lower()

class SkillMultiHotEncoder(BaseEstimator, TransformerMixin):
    """
    Transforms comma-separated skill strings or list of skills into a fixed-width binary vector.
    Unknown/unseen skills during inference are safely ignored (yielding 0) to prevent runtime crashes.
    """
    def __init__(self):
        self.classes_ = []
        self.class_to_idx_ = {}

    def fit(self, X, y=None):
        unique_skills = set()
        for item in X:
            skills = self._parse_skills(item)
            for s in skills:
                if s:
                    unique_skills.add(s)
        self.classes_ = sorted(list(unique_skills))
        self.class_to_idx_ = {s: i for i, s in enumerate(self.classes_)}
        return self

    def transform(self, X):
        num_rows = len(X)
        matrix = np.zeros((num_rows, len(self.classes_)), dtype=np.float32)
        for row_idx, item in enumerate(X):
            skills = self._parse_skills(item)
            for s in skills:
                if s in self.class_to_idx_:
                    matrix[row_idx, self.class_to_idx_[s]] = 1.0
        return matrix

    def _parse_skills(self, item):
        if isinstance(item, (list, tuple)):
            parsed = []
            for s in item:
                if isinstance(s, dict) and 'name' in s:
                    parsed.append(normalize_skill_name(s['name']))
                elif isinstance(s, str):
                    parsed.append(normalize_skill_name(s))
            return parsed
        elif isinstance(item, str):
            return [normalize_skill_name(s) for s in item.split(',') if s.strip()]
        return []

    def get_feature_names_out(self, input_features=None):
        return np.array([f"skill_{s}" for s in self.classes_], dtype=object)

# Features used for legitimate, leakage-resistant ML classification
# NOTE: 'Primary_Interest' was removed from ML training features because it had a
# 1-to-1 deterministic correlation with the synthetic target labels, which artificially inflated accuracy to 100%.
# Interests are instead used in the post-ML heuristic domain matching and explainability layer.
CATEGORICAL_FEATURES = [
    'Student_Branch',
    'Study_Year',
    'Work_Style_Preference',
    'Personality_Traits',
    'Academic_Performance',
    'Certifications',
    'Career_Aspiration'
]

SKILL_FEATURE = 'Current_Skills'

ALL_INPUT_FEATURES = [SKILL_FEATURE] + CATEGORICAL_FEATURES

def create_preprocessing_pipeline():
    """
    Constructs a ColumnTransformer that transforms skills and categorical features.
    """
    skill_pipeline = SkillMultiHotEncoder()
    cat_pipeline = OneHotEncoder(handle_unknown='ignore', sparse_output=False)

    preprocessor = ColumnTransformer(
        transformers=[
            ('skills', skill_pipeline, SKILL_FEATURE),
            ('categorical', cat_pipeline, CATEGORICAL_FEATURES)
        ],
        remainder='drop',
        verbose_feature_names_out=False
    )
    return preprocessor
