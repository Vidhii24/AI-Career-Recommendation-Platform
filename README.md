# CareerCompass AI 🧭

> **Your Skills Have a Future. Discover Where They Belong.**  
> An explainable, AI-assisted career discovery and adaptive learning roadmap platform designed specifically for engineering college students, powered by a Scikit-Learn **Random Forest Classifier**.

---

## 🌟 Executive Summary

Many engineering students master programming languages, simulation packages, or lab toolchains without knowing which real-world career domains best capitalize on their strengths—or what specific skills they need to learn next.

**CareerCompass AI** bridges this gap. It replaces generic career questionnaires with a dual-layer recommendation architecture:
1. **Machine Learning Model (Random Forest Classifier)**: Trained on student profile vectors to compute class probabilities across engineering domains.
2. **Explainable Multi-Factor Compatibility Engine**: Calculates transparent feature breakdowns, identifying matching skills, skill gaps, potential roles, and adaptive phased learning roadmaps.

---

## 🤖 Machine Learning Architecture

```
ml/
├── preprocessing.py          # SkillMultiHotEncoder & OneHotEncoder pipeline
├── train_model.py            # Model training & serialization script
├── evaluate_model.py         # Comprehensive evaluation metrics & limitations
├── predict.py                # Standalone inference & probability ranker
├── app.py                    # FastAPI inference microservice (port 8000)
├── test_ml_pipeline.py       # Automated unit tests (7 test cases)
├── requirements.txt          # Python dependencies
└── artifacts/
    ├── career_rf_pipeline.joblib   # Serialized preprocessor + RandomForest
    ├── test_data.joblib            # Stratified held-out test split
    ├── model_metadata.json         # Hyperparameters & feature rankings
    ├── evaluation_report.txt       # Full classification report & matrix
    └── evaluation_metrics.json     # Machine-readable performance metrics
```

### Model Specification
- **Algorithm**: `sklearn.ensemble.RandomForestClassifier`
- **Estimators**: 200 trees
- **Class Weights**: `balanced` (ensuring equal treatment across domains)
- **Random State**: 42 (reproducible)
- **Target Variable**: `Recommended_Domain` (11 distinct engineering domains with 50 examples each in synthetic training data)
- **Input Features (8)**:
  1. `Current_Skills`: Encoded via `SkillMultiHotEncoder` (67 vocabulary skills; handles unseen skills gracefully without runtime crashes).
  2. `Student_Branch`: One-hot encoded.
  3. `Study_Year`: One-hot encoded.
  4. `Work_Style_Preference`: One-hot encoded.
  5. `Personality_Traits`: One-hot encoded.
  6. `Academic_Performance`: One-hot encoded.
  7. `Certifications`: One-hot encoded.
  8. `Career_Aspiration`: One-hot encoded.
- **Target Leakage Prevention**: `Primary_Interest` is strictly excluded because the synthetic dataset generator embedded a 1:1 deterministic bijection with `Recommended_Domain` (which previously produced an artificial 100% test accuracy). Identifiers and downstream fields (`Profile_ID`, `Suggested_Career_Path`, `Roadmap_Step_1`..`6`, `Potential_Job_Opportunities`, `Portfolio_Project_Ideas`, `Learning_Resources`, `Dataset_Note`) are strictly excluded.

---

## 📊 Actual Model Evaluation Metrics (Post-Leakage Correction)

Evaluated on the 20% held-out stratified test set (110 samples across 11 classes, 10 samples per class):

| Metric | Score | Note |
|---|---|---|
| **Top-1 Test Accuracy** | **70.91% (0.7091)** | Baseline random guessing across 11 classes is 9.09% |
| **Top-3 Test Accuracy** | **90.91% (0.9091)** | Correct domain is in the top 3 recommendations |
| **5-Fold Cross-Validation** | **75.45% (+/- 4.10%)** | Stratified K-Fold across 440 training profiles |
| **Macro Precision** | **0.7367** | Average precision across all 11 classes |
| **Weighted Precision** | **0.7367** | Weighted precision across all 11 classes |
| **Macro Recall** | **0.7091** | Average recall across all 11 classes |
| **Weighted Recall** | **0.7091** | Weighted recall across all 11 classes |
| **Macro F1-Score** | **0.7098** | Balanced harmonic mean |
| **Weighted F1-Score** | **0.7098** | Balanced harmonic mean |

### Top 10 Most Influential Features (Technical Skills & Concepts):
1. `skill_c++` (0.0387)
2. `skill_cad` (0.0318)
3. `skill_circuit analysis` (0.0313)
4. `skill_figma` (0.0311)
5. `skill_linux` (0.0306)
6. `skill_networking` (0.0254)
7. `skill_c` (0.0238)
8. `skill_python` (0.0232)
9. `skill_numpy` (0.0208)
10. `skill_wireframing` (0.0200)
9. `Primary_Interest: AI, prediction and experimentation` (0.0538)
10. `Primary_Interest: security and problem investigation` (0.0528)

### Important Dataset Limitations & Integrity Disclosures:
> [!IMPORTANT]
> 1. **Synthetic Data Characteristics**: The 550 profiles in `Engineering_Career_Recommendation_Dataset_550.xlsx` were synthetically generated for prototype development. High test accuracy reflects deterministic relationships embedded in synthetic generation, **not real-world student validation**.
> 2. **Probability vs. Employability**: `predict_proba` values represent model class probabilities, **not** the probability that a student will be hired or succeed in that career.
> 3. **Catalog Support**: The student profile dataset contains 11 domains (50 samples each). The two catalog domains with 0 profile rows (`VLSI & Chip Design` and `Chemical & Process Engineering`) are augmented via multi-factor compatibility rules so students in those disciplines are not excluded.

---

## ⚡ Setup & Execution Instructions

### Prerequisites
- Python 3.10+ (tested on Python 3.14)
- Node.js 18+ and npm 9+

### 1. Install Dependencies
```bash
# Install Python ML dependencies
py -m pip install -r ml/requirements.txt

# Install frontend and backend packages
npm run install:all
```

### 2. Train and Evaluate the ML Model
```bash
# Train the Random Forest Classifier
py ml/train_model.py

# Run comprehensive test evaluation
py ml/evaluate_model.py

# Run the automated test suite (7 unit tests)
py ml/test_ml_pipeline.py
```

### 3. Start the Application

#### Option A: Unified Full-Stack Run (Recommended)
```bash
# Terminal 1: Start FastAPI ML Inference Microservice (port 8000)
py -m uvicorn ml.app:app --host 127.0.0.1 --port 8000

# Terminal 2: Start Express Full-Stack Server (port 5000, serves API & frontend)
npm start
```
Visit **`http://localhost:5000`** in your browser.

#### Option B: Standalone Inference
Even if the FastAPI microservice is offline, the Express backend automatically falls back to invoking `py ml/predict.py` directly via child processes, ensuring the recommendation API never fails.

---

## 🔌 API Endpoints

### 1. `POST /api/career-recommendations`
Accepts a student profile and returns the Random Forest model predictions:
```bash
curl -X POST http://localhost:5000/api/career-recommendations \
  -H "Content-Type: application/json" \
  -d '{
    "student_branch": "Computer Engineering",
    "study_year": "2nd Year",
    "current_skills": ["Python", "SQL", "React"],
    "primary_interest": "building applications",
    "work_style_preference": "hands-on building",
    "career_aspiration": "internship first"
  }'
```

**Response Format:**
```json
{
  "success": true,
  "recommendations": [
    {
      "domain": "Software Development",
      "score": 0.81,
      "estimated_probability_percent": 81.0,
      "matching_skills": ["Python", "SQL", "React"],
      "skill_gaps": ["C++", "Java", "Node.js", "DSA", "Git"],
      "career_roles": ["Software Developer Intern", "Frontend Developer Intern", "Backend Developer Intern"],
      "explanation": "Direct foundation in Python, SQL, React • Strong model association with your interest in building applications"
    }
  ],
  "model_version": "2.0.0",
  "model_type": "RandomForestClassifier",
  "total_classes_evaluated": 11,
  "disclaimer": "Model scores reflect Random Forest class probabilities estimated from synthetic training data."
}
```

### 2. `GET /api/ml-health`
Returns the status and metadata of the active machine learning service:
```json
{
  "success": true,
  "ml": {
    "status": "online",
    "service": "FastAPI",
    "details": {
      "status": "ok",
      "model": "RandomForestClassifier",
      "version": "1.0.0",
      "classes_count": 11
    }
  }
}
```

---

## 🔄 Retraining the Model

When new student profile data is added to `Engineering_Career_Recommendation_Dataset_550.xlsx`:
1. Place the updated Excel file in the root directory.
2. Run `py ml/train_model.py`.
3. Run `py ml/evaluate_model.py`.
4. Run `py ml/test_ml_pipeline.py`.
5. The pipeline automatically saves the new fitted preprocessor and classifier to `ml/artifacts/career_rf_pipeline.joblib`. The FastAPI service and Express backend pick up the new artifact on reload.

---

## 📄 License
MIT License. Created for engineering student career advancement.
