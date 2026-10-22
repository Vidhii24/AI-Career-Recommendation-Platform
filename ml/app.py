"""
FastAPI Microservice for CareerCompass AI Machine Learning Model
Serves Random Forest career domain predictions, explainability, and health checks.
"""

import os
import sys
from typing import List, Optional, Any, Dict
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Ensure current directory is on python path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
if CURRENT_DIR not in sys.path:
    sys.path.insert(0, CURRENT_DIR)

from predict import predict_career_domains, load_model_artifacts

app = FastAPI(
    title="CareerCompass AI ML Service",
    description="Random Forest Career Recommendation Inference API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class StudentProfileRequest(BaseModel):
    student_branch: Optional[str] = Field(default="Computer Engineering")
    study_year: Optional[str] = Field(default="2nd Year")
    current_skills: Optional[Any] = Field(default_factory=list)
    primary_interest: Optional[str] = Field(default="building applications")
    work_style_preference: Optional[str] = Field(default="hands-on building")
    personality_traits: Optional[str] = Field(default="curious and experimental")
    academic_performance: Optional[str] = Field(default="Intermediate")
    certifications: Optional[str] = Field(default="None yet")
    career_aspiration: Optional[str] = Field(default="internship first")
    # Compatibility with camelCase inputs
    branch: Optional[str] = None
    year: Optional[str] = None
    skills: Optional[Any] = None
    primaryInterest: Optional[str] = None
    interests: Optional[List[str]] = None
    workStylePreference: Optional[str] = None
    workStyles: Optional[List[str]] = None
    aspiration: Optional[str] = None

class RecommendationItem(BaseModel):
    domain: str
    score: float
    estimated_probability_percent: float
    matching_skills: List[str]
    skill_gaps: List[str]
    career_roles: List[str]
    explanation: str

class RecommendationResponse(BaseModel):
    success: bool
    recommendations: List[RecommendationItem]
    all_scores: Optional[Dict[str, float]] = None
    model_version: str
    model_type: str
    total_classes_evaluated: int
    disclaimer: str

@app.on_event("startup")
def startup_event():
    try:
        load_model_artifacts()
        print("ML Model pipeline loaded successfully into memory.")
    except Exception as e:
        print(f"Warning: Model could not be pre-loaded: {e}")

@app.get("/health")
def health_check():
    try:
        pipeline, metadata, _ = load_model_artifacts()
        return {
            "status": "ok",
            "service": "CareerCompass ML Inference API",
            "model": "RandomForestClassifier",
            "version": metadata.get("model_version", "1.0.0") if metadata else "1.0.0",
            "classes_count": len(pipeline.classes_),
            "classes": list(pipeline.classes_)
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Model artifact not ready: {str(e)}"
        )

@app.post("/api/career-recommendations", response_model=RecommendationResponse)
@app.post("/predict", response_model=RecommendationResponse)
def get_career_recommendations(profile: StudentProfileRequest):
    try:
        profile_dict = profile.dict()
        result = predict_career_domains(profile_dict, top_n=3)
        return result
    except FileNotFoundError as fnf:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Model artifact not found. Please run 'py ml/train_model.py': {str(fnf)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Prediction error: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=False)
