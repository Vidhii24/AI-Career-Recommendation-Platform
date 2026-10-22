import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { getRecommendations, DOMAIN_METADATA } from './recommendationEngine.js';
import { getMLPredictions, checkMLServiceHealth } from './mlClient.js';
import {
  isValidEmail,
  validatePasswordStrength,
  hashPassword,
  verifyPassword,
  generateToken,
  authenticateToken
} from './auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Persistent storage paths
const DATA_DIR = path.join(__dirname, 'data');
const USERS_PATH = path.join(DATA_DIR, 'users.json');
const DOMAINS_PATH = path.join(DATA_DIR, 'career_domains.json');
const SAVED_PROFILES_PATH = path.join(DATA_DIR, 'saved_profiles.json');
const PASSWORD_RESETS_PATH = path.join(DATA_DIR, 'password_resets.json');

// Initialize files if not present
if (!fs.existsSync(USERS_PATH)) {
  fs.writeFileSync(USERS_PATH, JSON.stringify({}), 'utf-8');
}
if (!fs.existsSync(SAVED_PROFILES_PATH)) {
  fs.writeFileSync(SAVED_PROFILES_PATH, JSON.stringify({}), 'utf-8');
}
if (!fs.existsSync(PASSWORD_RESETS_PATH)) {
  fs.writeFileSync(PASSWORD_RESETS_PATH, JSON.stringify({}), 'utf-8');
}

function readJSON(filePath, fallback = {}) {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err.message);
  }
  return fallback;
}

function writeJSON(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Error writing to ${filePath}:`, err.message);
  }
}

// ==========================================
// 1. PUBLIC PLATFORM HEALTH & DOMAIN CATALOG
// ==========================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'CareerCompass AI Backend',
    timestamp: new Date().toISOString(),
    version: '2.0.0'
  });
});

// ML Service Health Check
app.get('/api/ml-health', async (req, res) => {
  try {
    const health = await checkMLServiceHealth();
    res.json({ success: true, ml: health });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Public Career Domains Catalog
app.get('/api/domains', (req, res) => {
  const catalog = readJSON(DOMAINS_PATH, []);
  const enriched = catalog.map(item => {
    const meta = DOMAIN_METADATA[item.Career_Domain] || {};
    return {
      name: item.Career_Domain,
      category: meta.category || 'Engineering',
      description: meta.description || item.Roadmap_Summary,
      relevantSkills: item.Relevant_Skills ? item.Relevant_Skills.split(',').map(s => s.trim()) : [],
      potentialRoles: item.Potential_Roles ? item.Potential_Roles.split(',').map(r => r.trim()) : [],
      roadmapSummary: item.Roadmap_Summary,
      projectIdeas: item.Project_Ideas ? item.Project_Ideas.split(',').map(p => p.trim()) : [],
      learningResources: item.Learning_Resources ? item.Learning_Resources.split(',').map(r => r.trim()) : [],
      branchSynergy: meta.branchSynergy || []
    };
  });
  res.json({ success: true, count: enriched.length, domains: enriched });
});

// Single Domain Details
app.get('/api/domains/:name', (req, res) => {
  const domainName = decodeURIComponent(req.params.name);
  const catalog = readJSON(DOMAINS_PATH, []);
  const item = catalog.find(d => d.Career_Domain.toLowerCase() === domainName.toLowerCase());
  if (!item) {
    return res.status(404).json({ success: false, error: 'Career domain not found' });
  }
  const meta = DOMAIN_METADATA[item.Career_Domain] || {};
  res.json({
    success: true,
    domain: {
      name: item.Career_Domain,
      category: meta.category || 'Engineering',
      description: meta.description || item.Roadmap_Summary,
      relevantSkills: item.Relevant_Skills ? item.Relevant_Skills.split(',').map(s => s.trim()) : [],
      potentialRoles: item.Potential_Roles ? item.Potential_Roles.split(',').map(r => r.trim()) : [],
      roadmapSummary: item.Roadmap_Summary,
      projectIdeas: item.Project_Ideas ? item.Project_Ideas.split(',').map(p => p.trim()) : [],
      learningResources: item.Learning_Resources ? item.Learning_Resources.split(',').map(r => r.trim()) : [],
      branchSynergy: meta.branchSynergy || []
    }
  });
});

// ==========================================
// 2. AUTHENTICATION SYSTEM
// ==========================================

// Register New Student Account
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Full name is required.' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ success: false, error: 'Please enter a valid email address.' });
    }

    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({ success: false, error: passwordValidation.message });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, error: 'Passwords do not match.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const users = readJSON(USERS_PATH, {});

    // Check for duplicate email
    const existingUserId = Object.keys(users).find(
      id => users[id].email && users[id].email.toLowerCase() === normalizedEmail
    );

    if (existingUserId) {
      return res.status(409).json({
        success: false,
        error: 'An account with this email address already exists. Please log in.'
      });
    }

    // Securely hash password
    const passwordHash = await hashPassword(password);
    const userId = `usr_${crypto.randomUUID()}`;

    const newUser = {
      id: userId,
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    users[userId] = newUser;
    writeJSON(USERS_PATH, users);

    // Issue JWT token
    const token = generateToken(newUser);

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      },
      hasCompletedAssessment: false
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ success: false, error: 'Failed to create account. Please try again.' });
  }
});

// Login Existing Student
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const users = readJSON(USERS_PATH, {});

    const user = Object.values(users).find(
      u => u.email && u.email.toLowerCase() === normalizedEmail
    );

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    const passwordMatches = await verifyPassword(password, user.passwordHash);
    if (!passwordMatches) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    // Check if user has an existing completed profile & recommendations
    const profiles = readJSON(SAVED_PROFILES_PATH, {});
    const studentProfile = profiles[user.id];
    const hasCompletedAssessment = Boolean(
      studentProfile &&
      studentProfile.skills &&
      studentProfile.skills.length > 0 &&
      studentProfile.recommendations
    );

    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      hasCompletedAssessment
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, error: 'Login failed. Please try again.' });
  }
});

// Current Authenticated User & Profile Status
app.get('/api/auth/me', authenticateToken, (req, res) => {
  try {
    const users = readJSON(USERS_PATH, {});
    const user = users[req.user.userId];

    if (!user) {
      return res.status(404).json({ success: false, error: 'User account not found.' });
    }

    const profiles = readJSON(SAVED_PROFILES_PATH, {});
    const studentProfile = profiles[user.id];
    const hasCompletedAssessment = Boolean(
      studentProfile &&
      studentProfile.skills &&
      studentProfile.skills.length > 0 &&
      studentProfile.recommendations
    );

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      hasCompletedAssessment
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Logout endpoint
app.post('/api/auth/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully.' });
});

// Password Recovery Request
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!isValidEmail(email)) {
      return res.status(400).json({ success: false, error: 'Please provide a valid email.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const users = readJSON(USERS_PATH, {});
    const user = Object.values(users).find(
      u => u.email && u.email.toLowerCase() === normalizedEmail
    );

    if (!user) {
      // Security best practice: don't reveal email existence
      return res.json({
        success: true,
        message: 'If an account exists with this email, password reset instructions have been generated.'
      });
    }

    const resetToken = crypto.randomBytes(24).toString('hex');
    const resets = readJSON(PASSWORD_RESETS_PATH, {});
    resets[resetToken] = {
      userId: user.id,
      email: user.email,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString() // 1 hour
    };
    writeJSON(PASSWORD_RESETS_PATH, resets);

    res.json({
      success: true,
      resetToken, // Provided for direct UI recovery flow
      message: 'Password reset code generated. Use this code or link to reset your password.'
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Password Reset Confirmation
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { resetToken, newPassword, confirmPassword } = req.body;
    if (!resetToken || !newPassword) {
      return res.status(400).json({ success: false, error: 'Reset token and new password are required.' });
    }

    const passwordValidation = validatePasswordStrength(newPassword);
    if (!passwordValidation.valid) {
      return res.status(400).json({ success: false, error: passwordValidation.message });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, error: 'Passwords do not match.' });
    }

    const resets = readJSON(PASSWORD_RESETS_PATH, {});
    const resetRecord = resets[resetToken];

    if (!resetRecord || new Date(resetRecord.expiresAt) < new Date()) {
      return res.status(400).json({ success: false, error: 'Invalid or expired reset token.' });
    }

    const users = readJSON(USERS_PATH, {});
    const user = users[resetRecord.userId];

    if (!user) {
      return res.status(404).json({ success: false, error: 'User account not found.' });
    }

    user.passwordHash = await hashPassword(newPassword);
    user.updatedAt = new Date().toISOString();
    users[user.id] = user;
    writeJSON(USERS_PATH, users);

    // Invalidate used reset token
    delete resets[resetToken];
    writeJSON(PASSWORD_RESETS_PATH, resets);

    res.json({ success: true, message: 'Password has been reset successfully. You can now log in.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 3. PROTECTED STUDENT PROFILE & ROADMAP PROGRESS
// (Enforces strict data isolation by req.user.userId)
// ==========================================

// Get Current Authenticated Student's Profile
app.get('/api/student/profile', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId;
    const db = readJSON(SAVED_PROFILES_PATH, {});
    const profile = db[userId] || null;

    if (profile) {
      // Ensure profile name strictly matches authenticated user account
      profile.name = req.user.name || profile.name;
    }

    res.json({
      success: true,
      profile
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Save or Update Authenticated Student's Profile
app.post('/api/student/profile', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId;
    const profileData = req.body;
    const db = readJSON(SAVED_PROFILES_PATH, {});

    const existing = db[userId] || {};

    db[userId] = {
      ...existing,
      ...profileData,
      name: req.user.name || profileData.name || existing.name,
      userId,
      updatedAt: new Date().toISOString()
    };

    writeJSON(SAVED_PROFILES_PATH, db);

    res.json({
      success: true,
      message: 'Student profile updated successfully.'
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update Roadmap Task Progress (Protected)
app.put('/api/student/roadmap', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId;
    const { phaseIndex, taskIndex, status } = req.body;
    const db = readJSON(SAVED_PROFILES_PATH, {});
    const profile = db[userId];

    if (!profile) {
      return res.status(404).json({ success: false, error: 'Student profile not found.' });
    }

    if (!profile.roadmapProgress) {
      profile.roadmapProgress = {};
    }

    const key = `p${phaseIndex}_t${taskIndex}`;
    profile.roadmapProgress[key] = status;
    profile.updatedAt = new Date().toISOString();

    db[userId] = profile;
    writeJSON(SAVED_PROFILES_PATH, db);

    res.json({ success: true, roadmapProgress: profile.roadmapProgress });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Bookmark or Unbookmark Career Domain (Protected)
app.post('/api/student/saved-items', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId;
    const { itemType, itemId, itemData } = req.body;
    const db = readJSON(SAVED_PROFILES_PATH, {});
    const profile = db[userId];

    if (!profile) {
      return res.status(404).json({ success: false, error: 'Student profile not found.' });
    }

    if (!profile.savedItems) {
      profile.savedItems = { domains: [] };
    }
    if (!profile.savedItems.domains) {
      profile.savedItems.domains = [];
    }

    if (itemType === 'domain') {
      const exists = profile.savedItems.domains.some(d => d.name === itemId);
      if (exists) {
        profile.savedItems.domains = profile.savedItems.domains.filter(d => d.name !== itemId);
      } else {
        profile.savedItems.domains.push({
          name: itemId,
          data: itemData,
          savedAt: new Date().toISOString()
        });
      }
    }

    profile.updatedAt = new Date().toISOString();
    db[userId] = profile;
    writeJSON(SAVED_PROFILES_PATH, db);

    res.json({ success: true, savedItems: profile.savedItems });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 4. RECOMMENDATION ENGINE (Unified ML + Phased Roadmaps)
// (Protected: Requires Authenticated Student Token)
// ==========================================
app.post('/api/recommend', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const studentProfile = req.body;

    if (!studentProfile) {
      return res.status(400).json({ success: false, error: 'Missing student profile payload.' });
    }

    // 1. Run explainable multi-factor engine
    const baseRecommendations = getRecommendations(studentProfile);

    // 2. Run Random Forest ML inference via FastAPI
    let mlData = null;
    try {
      mlData = await getMLPredictions(studentProfile);
    } catch (mlErr) {
      console.warn('ML inference fallback:', mlErr.message);
    }

    // 3. Merge ML probabilities and rankings
    if (mlData && (mlData.all_scores || mlData.recommendations)) {
      const mlScores = mlData.all_scores || {};
      if (mlData.recommendations) {
        mlData.recommendations.forEach(rec => {
          if (mlScores[rec.domain] === undefined) {
            mlScores[rec.domain] = rec.score;
          }
        });
      }

      const mlMap = new Map();
      if (mlData.recommendations) {
        mlData.recommendations.forEach((rec, idx) => {
          mlMap.set(rec.domain.toLowerCase(), {
            rank: idx + 1,
            score: rec.score,
            probabilityPercent: rec.estimated_probability_percent,
            explanation: rec.explanation,
            matchingSkills: rec.matching_skills,
            skillGaps: rec.skill_gaps
          });
        });
      }

      // Re-score each domain using the unified ML + heuristic hybrid formula
      baseRecommendations.allRanked = baseRecommendations.allRanked.map(item => {
        const domainKey = item.domainName;
        const mlProb = mlScores[domainKey] !== undefined ? mlScores[domainKey] : null;
        const mlMatch = mlMap.get(domainKey.toLowerCase());

        let finalScore = item.matchScore;
        let isMLRanked = false;

        if (mlProb !== null) {
          isMLRanked = true;
          // Scale ML probability (0.0 - 1.0) into a 0 - 100 benchmark (0.35+ is strong in 11 classes)
          const mlScoreNormalized = Math.min(100, Math.round(mlProb * 180));
          // Blended score: 55% ML model output + 45% profile compatibility heuristics
          finalScore = Math.min(99, Math.max(30, Math.round(0.55 * mlScoreNormalized + 0.45 * item.matchScore)));
        }

        return {
          ...item,
          matchScore: finalScore,
          mlModelPredicted: isMLRanked,
          mlRank: mlMatch ? mlMatch.rank : null,
          mlScore: mlProb !== null ? mlProb : null,
          mlConfidencePercent: mlProb !== null ? Math.round(mlProb * 100) : null,
          mlExplanation: mlMatch ? mlMatch.explanation : (isMLRanked ? `Machine Learning model estimated match probability: ${(mlProb * 100).toFixed(1)}%` : null)
        };
      });

      // Sort all domains descending by blended match score
      baseRecommendations.allRanked.sort((a, b) => b.matchScore - a.matchScore);
      baseRecommendations.topThree = baseRecommendations.allRanked.slice(0, 3);

      baseRecommendations.mlMetadata = {
        model: 'RandomForestClassifier',
        version: mlData.model_version || '2.0.0',
        topMLDomain: mlData.recommendations?.[0]?.domain,
        topMLScore: mlData.recommendations?.[0]?.score,
        topMLConfidence: mlData.recommendations?.[0]?.estimated_probability_percent,
        disclaimer: mlData.disclaimer || 'Model scores reflect Random Forest class probabilities estimated from synthetic training data.'
      };
    }

    // 4. Persist to student's isolated profile
    const db = readJSON(SAVED_PROFILES_PATH, {});
    const existing = db[userId] || {};
    db[userId] = {
      ...existing,
      ...studentProfile,
      name: req.user.name || studentProfile.name || existing.name,
      userId,
      recommendations: baseRecommendations,
      updatedAt: new Date().toISOString()
    };
    writeJSON(SAVED_PROFILES_PATH, db);

    res.json({
      success: true,
      recommendations: baseRecommendations
    });
  } catch (err) {
    console.error('Recommendation calculation error:', err);
    res.status(500).json({
      success: false,
      error: 'Internal recommendation calculation failed.',
      message: err.message
    });
  }
});

// Serve static client build if available
const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.json({
      status: 'online',
      service: 'CareerCompass AI Backend & ML Service',
      version: '2.0.0',
      message: 'Backend API is active and ready to serve recommendations.',
      endpoints: {
        health: '/api/health',
        ml_health: '/api/ml-health',
        domains: '/api/domains',
        recommend: '/api/recommend'
      }
    });
  });
}

app.listen(PORT, () => {
  console.log(`🚀 CareerCompass AI Server running on port ${PORT}`);
});
