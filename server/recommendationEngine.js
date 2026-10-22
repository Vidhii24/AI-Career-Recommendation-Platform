import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load domain catalog
const domainsDataPath = path.join(__dirname, 'data', 'career_domains.json');
let careerDomains = [];
try {
  careerDomains = JSON.parse(fs.readFileSync(domainsDataPath, 'utf-8'));
} catch (err) {
  console.error('Error loading career_domains.json:', err.message);
}

// Domain definitions enriched with metadata
export const DOMAIN_METADATA = {
  'Software Development': {
    category: 'Software & Computing',
    branchSynergy: ['Computer Engineering', 'Information Technology', 'Electronics & Communication', 'Electrical Engineering'],
    coreSkills: ['Python', 'C++', 'Java', 'JavaScript', 'React', 'Node.js', 'DSA', 'Git', 'SQL', 'HTML/CSS'],
    secondarySkills: ['Linux', 'Docker', 'Cloud basics', 'CI/CD'],
    interestKeywords: ['building applications', 'programming', 'software', 'web development', 'apps'],
    workStyles: ['hands-on building', 'team-based delivery', 'analytical problem-solving'],
    description: 'Design, build, test, and maintain modern web applications, distributed backend services, and scalable software systems.'
  },
  'Data Analytics & BI': {
    category: 'Data & Analytics',
    branchSynergy: ['Computer Engineering', 'Information Technology', 'Electronics & Communication', 'Mechanical Engineering', 'Civil Engineering', 'Electrical Engineering', 'Chemical Engineering'],
    coreSkills: ['Python', 'SQL', 'Excel', 'Statistics', 'Data analysis', 'Power BI', 'Tableau'],
    secondarySkills: ['pandas', 'NumPy', 'Git', 'Linear algebra'],
    interestKeywords: ['working with data and patterns', 'data', 'analytics', 'dashboards', 'business intelligence'],
    workStyles: ['analytical problem-solving', 'structured and detail-oriented', 'creative exploration'],
    description: 'Transform complex raw datasets into actionable executive insights, interactive dashboards, and strategic business decisions.'
  },
  'AI & Machine Learning': {
    category: 'AI & Data Science',
    branchSynergy: ['Computer Engineering', 'Information Technology', 'Electronics & Communication', 'Electrical Engineering'],
    coreSkills: ['Python', 'Statistics', 'Linear algebra', 'pandas', 'NumPy', 'scikit-learn', 'Data analysis'],
    secondarySkills: ['DSA', 'Git', 'Linux', 'SQL'],
    interestKeywords: ['AI, prediction and experimentation', 'AI', 'machine learning', 'deep learning', 'prediction'],
    workStyles: ['research and experimentation', 'analytical problem-solving', 'creative exploration'],
    description: 'Build predictive statistical models, neural networks, recommendation engines, and intelligent computer vision or NLP pipelines.'
  },
  'Cybersecurity': {
    category: 'Security & Systems',
    branchSynergy: ['Computer Engineering', 'Information Technology', 'Electronics & Communication'],
    coreSkills: ['Linux', 'Networking', 'Python', 'Cybersecurity basics', 'Web fundamentals', 'Git'],
    secondarySkills: ['Cloud basics', 'Docker', 'C', 'C++'],
    interestKeywords: ['security and problem investigation', 'cybersecurity', 'security', 'defensive security', 'networking'],
    workStyles: ['analytical problem-solving', 'structured and detail-oriented', 'investigative'],
    description: 'Protect vital networks, software applications, cloud systems, and data infrastructure against vulnerabilities and active cyber threats.'
  },
  'Cloud & DevOps': {
    category: 'Cloud & Infrastructure',
    branchSynergy: ['Computer Engineering', 'Information Technology', 'Electronics & Communication'],
    coreSkills: ['Linux', 'Git', 'Cloud basics', 'Docker', 'Networking', 'Python', 'CI/CD'],
    secondarySkills: ['SQL', 'Cybersecurity basics', 'Automation'],
    interestKeywords: ['automation, deployment and infrastructure', 'cloud', 'devops', 'infrastructure', 'deployment'],
    workStyles: ['team-based delivery', 'hands-on building', 'analytical problem-solving'],
    description: 'Architect automated continuous deployment pipelines, manage resilient cloud infrastructure, and maintain scalable cloud systems.'
  },
  'Embedded Systems & IoT': {
    category: 'Hardware & IoT',
    branchSynergy: ['Electronics & Communication', 'Electrical Engineering', 'Computer Engineering'],
    coreSkills: ['C', 'Embedded C', 'Arduino', 'Microcontrollers', 'Digital electronics', 'IoT', 'Circuit analysis'],
    secondarySkills: ['C++', 'Linux', 'Git', 'Sensors'],
    interestKeywords: ['hardware, sensors and connected devices', 'embedded', 'iot', 'sensors', 'hardware'],
    workStyles: ['hands-on building', 'analytical problem-solving', 'research and experimentation'],
    description: 'Engineer low-level firmware and connected smart devices that interact with the physical world through microcontrollers and sensors.'
  },
  'VLSI & Chip Design': {
    category: 'Semiconductors & Electronics',
    branchSynergy: ['Electronics & Communication', 'Electrical Engineering'],
    coreSkills: ['Digital electronics', 'Verilog', 'Logic design', 'Electronics', 'Timing analysis'],
    secondarySkills: ['C', 'Circuit analysis', 'Linux'],
    interestKeywords: ['hardware, sensors and connected devices', 'chip design', 'semiconductors', 'vlsi', 'circuits'],
    workStyles: ['structured and detail-oriented', 'research and experimentation', 'analytical problem-solving'],
    description: 'Design and verify next-generation integrated circuits, silicon microchips, and hardware description architectures using RTL and Verilog.'
  },
  'Robotics & Automation': {
    category: 'Robotics & Mechatronics',
    branchSynergy: ['Mechanical Engineering', 'Electronics & Communication', 'Electrical Engineering', 'Computer Engineering'],
    coreSkills: ['C++', 'Python', 'Robotics basics', 'Arduino', 'Control systems', 'CAD', 'MATLAB'],
    secondarySkills: ['Embedded C', 'Digital electronics', 'Linux', 'Microcontrollers'],
    interestKeywords: ['robots and intelligent machines', 'robotics', 'automation', 'mechatronics', 'machines'],
    workStyles: ['hands-on building', 'research and experimentation', 'creative exploration'],
    description: 'Integrate mechanical kinematics, electronics, motor control, and intelligent autonomous algorithms to build automated robotic systems.'
  },
  'UI/UX & Product Design': {
    category: 'Design & Human-Computer Interaction',
    branchSynergy: ['Computer Engineering', 'Information Technology', 'Mechanical Engineering', 'Civil Engineering'],
    coreSkills: ['Figma', 'Wireframing', 'Visual design', 'HTML/CSS', 'User research', 'Prototyping'],
    secondarySkills: ['JavaScript', 'Design systems', 'Usability testing'],
    interestKeywords: ['visual design and user experience', 'design', 'ui/ux', 'user experience', 'prototyping'],
    workStyles: ['creative exploration', 'team-based delivery', 'collaborative and communicative'],
    description: 'Craft intuitive, accessible digital experiences, design systems, and delightful human-centric user interfaces through iterative prototyping.'
  },
  'Mechanical Design & Manufacturing': {
    category: 'Mechanical & Production',
    branchSynergy: ['Mechanical Engineering'],
    coreSkills: ['CAD', 'SolidWorks', 'AutoCAD', 'CNC basics', '3D printing', 'Quality tools'],
    secondarySkills: ['MATLAB', 'Finite Element Analysis', 'Manufacturing processes'],
    interestKeywords: ['product design and manufacturing', 'mechanical', 'manufacturing', '3D printing', 'solidworks'],
    workStyles: ['hands-on building', 'structured and detail-oriented', 'creative exploration'],
    description: 'Model parametric mechanical assemblies, design innovative industrial components, and streamline modern manufacturing processes.'
  },
  'Civil Design & BIM': {
    category: 'Civil & Infrastructure',
    branchSynergy: ['Civil Engineering'],
    coreSkills: ['AutoCAD', 'Revit', 'STAAD.Pro', 'BIM basics', 'Structural analysis', 'Project planning'],
    secondarySkills: ['GIS basics', 'Quantity surveying', 'Project estimation'],
    interestKeywords: ['buildings, structures and digital construction', 'civil', 'bim', 'structures', 'construction'],
    workStyles: ['structured and detail-oriented', 'team-based delivery', 'analytical problem-solving'],
    description: 'Plan resilient civil infrastructure, develop 3D Building Information Models (BIM), and conduct structural safety analysis.'
  },
  'Electrical & Renewable Energy': {
    category: 'Electrical & Clean Tech',
    branchSynergy: ['Electrical Engineering', 'Electronics & Communication'],
    coreSkills: ['Circuit analysis', 'MATLAB', 'Power systems', 'Control systems', 'Renewable energy', 'PLC basics'],
    secondarySkills: ['AutoCAD Electrical', 'Solar PV', 'Energy storage'],
    interestKeywords: ['power systems and sustainability', 'electrical', 'renewable energy', 'solar', 'power grid'],
    workStyles: ['analytical problem-solving', 'research and experimentation', 'hands-on building'],
    description: 'Design sustainable renewable power grids, solar-wind generation systems, electrical machines, and modern energy distribution.'
  },
  'Chemical & Process Engineering': {
    category: 'Chemical & Materials',
    branchSynergy: ['Chemical Engineering'],
    coreSkills: ['Process simulation', 'Thermodynamics', 'Mass transfer', 'Process safety', 'Excel', 'Data analysis'],
    secondarySkills: ['Process control', 'Python', 'Environmental safety'],
    interestKeywords: ['chemical processes, materials and safety', 'chemical', 'process engineering', 'thermodynamics'],
    workStyles: ['research and experimentation', 'structured and detail-oriented', 'analytical problem-solving'],
    description: 'Simulate industrial reaction kinetics, optimize chemical plant processes, and ensure rigorous safety and environmental standards.'
  }
};

/**
 * Normalizes skill strings for reliable matching (e.g., "HTML/CSS" -> "html/css", "Git & GitHub" -> "git")
 */
function normalizeSkill(str) {
  if (!str) return '';
  return str.toLowerCase().replace(/[\s\-_/]/g, '').trim();
}

/**
 * Calculates domain compatibility score and generates an explainable breakdown
 */
export function calculateDomainRecommendation(studentProfile, domainName) {
  const meta = DOMAIN_METADATA[domainName];
  if (!meta) return null;

  const catalogEntry = careerDomains.find(d => d.Career_Domain.toLowerCase() === domainName.toLowerCase()) || {};

  // 1. SKILL COMPATIBILITY ANALYSIS
  const studentSkillsList = studentProfile.skills || []; // array of { name: string, level: 'Beginner'|'Intermediate'|'Advanced'|'Not sure' }
  const normalizedStudentSkills = new Map();
  studentSkillsList.forEach(s => {
    normalizedStudentSkills.set(normalizeSkill(s.name), s.level || 'Intermediate');
  });

  const matchedSkills = [];
  const skillsToImprove = [];
  const missingSkills = [];

  let skillPoints = 0;
  const coreSkillList = meta.coreSkills;

  coreSkillList.forEach(domainSkill => {
    const norm = normalizeSkill(domainSkill);
    let found = false;
    let matchedLevel = 'Beginner';

    for (const [sNorm, sLevel] of normalizedStudentSkills.entries()) {
      if (sNorm.includes(norm) || norm.includes(sNorm)) {
        found = true;
        matchedLevel = sLevel;
        break;
      }
    }

    if (found) {
      if (matchedLevel === 'Advanced') {
        skillPoints += 1.2;
        matchedSkills.push({ name: domainSkill, level: matchedLevel, status: 'Strong Foundation' });
      } else if (matchedLevel === 'Intermediate') {
        skillPoints += 1.0;
        matchedSkills.push({ name: domainSkill, level: matchedLevel, status: 'Competent' });
      } else if (matchedLevel === 'Beginner') {
        skillPoints += 0.65;
        skillsToImprove.push({ name: domainSkill, level: matchedLevel, status: 'Needs Practice' });
      } else {
        skillPoints += 0.50;
        skillsToImprove.push({ name: domainSkill, level: 'Exploring', status: 'Uncertain Proficiency' });
      }
    } else {
      missingSkills.push({ name: domainSkill, priority: 'Recommended' });
    }
  });

  // Calculate skill score (0 - 100)
  // For college students, matching 3-4 core skills indicates high domain readiness
  const benchmarkSkillsCount = 3.5;
  const rawSkillScore = Math.min(100, Math.round((skillPoints / benchmarkSkillsCount) * 85));

  // 2. INTEREST ALIGNMENT (0 - 100)
  const studentInterests = Array.isArray(studentProfile.interests) 
    ? studentProfile.interests 
    : [studentProfile.primaryInterest || studentProfile.Primary_Interest].filter(Boolean);

  let interestPoints = 25; // baseline
  studentInterests.forEach(interest => {
    const normInt = (interest || '').toLowerCase();
    meta.interestKeywords.forEach(kw => {
      if (normInt.includes(kw.toLowerCase()) || kw.toLowerCase().includes(normInt)) {
        interestPoints += 40;
      }
    });
  });
  const interestScore = Math.min(98, Math.max(30, interestPoints));

  // 3. WORK STYLE FIT (0 - 100)
  const studentWorkStyles = Array.isArray(studentProfile.workStyles)
    ? studentProfile.workStyles
    : [studentProfile.workStylePreference || studentProfile.Work_Style_Preference].filter(Boolean);

  let workStylePoints = 35;
  studentWorkStyles.forEach(ws => {
    const normWs = (ws || '').toLowerCase();
    meta.workStyles.forEach(mws => {
      if (normWs.includes(mws.toLowerCase()) || mws.toLowerCase().includes(normWs)) {
        workStylePoints += 35;
      }
    });
  });
  const workStyleScore = Math.min(96, Math.max(30, workStylePoints));

  // 4. BRANCH SYNERGY (0 - 100)
  // Non-exclusionary: Provides a contextual baseline while keeping cross-branch opportunities wide open
  const studentBranch = studentProfile.branch || studentProfile.Student_Branch || '';
  let branchScore = 40;
  if (meta.branchSynergy.some(b => b.toLowerCase() === studentBranch.toLowerCase())) {
    branchScore = 92;
  } else if (
    (studentBranch.toLowerCase().includes('computer') || studentBranch.toLowerCase().includes('information')) &&
    ['Data Analytics & BI', 'AI & Machine Learning', 'Cybersecurity', 'Cloud & DevOps', 'Software Development'].includes(domainName)
  ) {
    branchScore = 88;
  } else if (
    studentBranch.toLowerCase().includes('electronics') &&
    ['Embedded Systems & IoT', 'VLSI & Chip Design', 'Robotics & Automation', 'Electrical & Renewable Energy'].includes(domainName)
  ) {
    branchScore = 88;
  }

  // 5. CAREER GOAL & TIME COMMITMENT (0 - 100)
  const aspiration = (studentProfile.aspiration || studentProfile.careerAspiration || studentProfile.Career_Aspiration || '').toLowerCase();
  const studyYear = (studentProfile.year || studentProfile.studyYear || studentProfile.Study_Year || '').toLowerCase();
  const weeklyHours = parseInt(studentProfile.weeklyHours || 10, 10);

  let goalScore = 60;
  if (aspiration.includes('internship')) {
    goalScore += (matchedSkills.length >= 2 ? 30 : 15);
  } else if (aspiration.includes('research') || aspiration.includes('higher studies')) {
    if (['AI & Machine Learning', 'VLSI & Chip Design', 'Robotics & Automation', 'Chemical & Process Engineering'].includes(domainName)) {
      goalScore += 30;
    }
  } else if (aspiration.includes('industry job')) {
    goalScore += 20;
  }
  goalScore = Math.min(95, goalScore);

  // COMPOSITE MATCH SCORE CALCULATION
  // Weighted: 35% Skills + 25% Interest + 15% Work Style + 15% Branch Synergy + 10% Career Goals
  const rawComposite = (
    rawSkillScore * 0.35 +
    interestScore * 0.25 +
    workStyleScore * 0.15 +
    branchScore * 0.15 +
    goalScore * 0.10
  );

  // Normalize cleanly
  const normalizedMatchScore = Math.min(98, Math.max(38, Math.round(rawComposite)));

  // EXPLAINABILITY FACTORS
  const reasons = [];
  if (matchedSkills.length > 0) {
    const topSkills = matchedSkills.slice(0, 3).map(s => s.name).join(', ');
    reasons.push(`You already have a verified baseline in ${topSkills}, directly supporting this domain.`);
  }
  if (interestScore >= 65) {
    reasons.push(`Strong alignment with your interest in ${studentInterests.slice(0, 2).join(' and ')}.`);
  }
  if (workStyleScore >= 70) {
    reasons.push(`Your preferred work style (${studentWorkStyles[0] || 'hands-on building'}) fits well with daily engineering workflows in ${domainName}.`);
  }
  if (meta.branchSynergy.some(b => b.toLowerCase() === studentBranch.toLowerCase())) {
    reasons.push(`Direct academic synergy with your ${studentBranch} curriculum.`);
  } else {
    reasons.push(`High transferable skill potential enabling a high-growth cross-branch pivot.`);
  }

  // ADAPTIVE ROADMAP GENERATION
  const roadmapPhases = generateAdaptiveRoadmap(domainName, matchedSkills, skillsToImprove, missingSkills, studyYear, weeklyHours);

  // SAMPLE OPPORTUNITIES MATCHED TO THIS DOMAIN
  const potentialRoles = catalogEntry.Potential_Roles 
    ? catalogEntry.Potential_Roles.split(',').map(r => r.trim())
    : ['Engineering Intern', 'Junior Associate'];

  return {
    domainName,
    category: meta.category,
    description: meta.description,
    matchScore: normalizedMatchScore,
    scoreBreakdown: {
      skillScore: rawSkillScore,
      interestScore,
      workStyleScore,
      branchScore,
      goalScore,
      compositeScore: normalizedMatchScore
    },
    reasons,
    matchedSkills,
    skillsToImprove,
    missingSkills,
    potentialRoles,
    learningRoadmap: roadmapPhases,
    projectIdeas: catalogEntry.Project_Ideas ? catalogEntry.Project_Ideas.split(',').map(p => p.trim()) : [],
    learningResources: catalogEntry.Learning_Resources ? catalogEntry.Learning_Resources.split(',').map(r => r.trim()) : []
  };
}

/**
 * Generates an adaptive phased roadmap tailored to student's existing skills and study stage
 */
function generateAdaptiveRoadmap(domainName, matchedSkills, skillsToImprove, missingSkills, studyYear, weeklyHours) {
  const matchedNames = new Set(matchedSkills.map(s => s.name.toLowerCase()));
  const missingNames = missingSkills.map(s => s.name);
  const improveNames = skillsToImprove.map(s => s.name);

  // Standard phases tailored dynamically
  const phases = [];

  // Phase 1: Core Fundamentals & Prerequisite Brush-up
  const phase1Tasks = [];
  if (improveNames.length > 0) {
    phase1Tasks.push({ title: `Reinforce fundamentals in ${improveNames.slice(0, 2).join(' & ')}`, status: 'in_progress', duration: '2-3 weeks' });
  } else {
    phase1Tasks.push({ title: 'Consolidate fundamental engineering logic and core tools', status: matchedNames.size > 0 ? 'completed' : 'not_started', duration: '2 weeks' });
  }
  phase1Tasks.push({ title: 'Set up professional development environment (Git, IDE, CLI tools)', status: matchedNames.has('git') ? 'completed' : 'not_started', duration: '1 week' });
  phase1Tasks.push({ title: 'Complete structured documentation walkthrough and exercises', status: 'not_started', duration: '2 weeks' });

  phases.push({
    phaseNumber: 1,
    title: 'Phase 1: Foundation & Essential Tooling',
    objective: 'Establish a reliable working environment and cement baseline syntax and concepts.',
    estimatedDuration: `${Math.max(2, Math.round(30 / (weeklyHours || 10)))} Weeks`,
    tasks: phase1Tasks,
    deliverable: 'Configured local development workspace and completed foundational drills.'
  });

  // Phase 2: Core Domain Competencies
  const topMissing = missingNames.slice(0, 3);
  const phase2Tasks = topMissing.map(skill => ({
    title: `Master core principles and practical exercises in ${skill}`,
    status: 'not_started',
    duration: '2-3 weeks'
  }));
  if (phase2Tasks.length === 0) {
    phase2Tasks.push({ title: 'Deep dive into advanced domain algorithms and performance patterns', status: 'not_started', duration: '3 weeks' });
  }

  phases.push({
    phaseNumber: 2,
    title: 'Phase 2: Core Domain Deep-Dive',
    objective: 'Bridge critical skill gaps and gain confidence with key industry libraries and workflows.',
    estimatedDuration: `${Math.max(3, Math.round(45 / (weeklyHours || 10)))} Weeks`,
    tasks: phase2Tasks,
    deliverable: 'Small-scale domain prototypes demonstrating core competency.'
  });

  // Phase 3: Applied Real-World Project
  phases.push({
    phaseNumber: 3,
    title: 'Phase 3: Portfolio Project & Architecture',
    objective: 'Build an end-to-end, production-quality project addressing an authentic problem.',
    estimatedDuration: `${Math.max(3, Math.round(50 / (weeklyHours || 10)))} Weeks`,
    tasks: [
      { title: 'Draft project architecture diagram, schema, and API/component specifications', status: 'not_started', duration: '1 week' },
      { title: 'Implement functional core with clean modular code and error handling', status: 'not_started', duration: '2-3 weeks' },
      { title: 'Write unit tests, automated validations, and document setup in a detailed README', status: 'not_started', duration: '1 week' }
    ],
    deliverable: 'Open-source GitHub repository with live demo, documentation, and clean commit history.'
  });

  // Phase 4: Professional Polish & Opportunity Readiness
  phases.push({
    phaseNumber: 4,
    title: 'Phase 4: Interview Preparation & Placement Readiness',
    objective: 'Prepare targeted resumes, technical discussion points, and mock interview practice.',
    estimatedDuration: '2-4 Weeks',
    tasks: [
      { title: 'Draft a one-page ATS-optimized resume highlighting domain projects and quantified impact', status: 'not_started', duration: '1 week' },
      { title: 'Practice technical interview problems, system explanations, and trade-off defense', status: 'not_started', duration: '2 weeks' },
      { title: 'Target and apply to 5-10 verified internships matching your profile tier', status: 'not_started', duration: 'Ongoing' }
    ],
    deliverable: 'Polished portfolio website, optimized LinkedIn/GitHub profiles, and active applications.'
  });

  return phases;
}

/**
 * Main recommendation entrypoint: takes student profile and ranks all 13 domains,
 * returning top 3 recommendations with comprehensive explainability
 */
export function getRecommendations(studentProfile) {
  const domainKeys = Object.keys(DOMAIN_METADATA);
  const scoredDomains = domainKeys
    .map(domainName => calculateDomainRecommendation(studentProfile, domainName))
    .filter(Boolean);

  // Sort descending by match score
  scoredDomains.sort((a, b) => b.matchScore - a.matchScore);

  const topThree = scoredDomains.slice(0, 3);
  const otherDomains = scoredDomains.slice(3);

  return {
    topThree,
    allRanked: scoredDomains,
    metadata: {
      generatedAt: new Date().toISOString(),
      studentBranch: studentProfile.branch || studentProfile.Student_Branch,
      studentYear: studentProfile.year || studentProfile.Study_Year,
      totalDomainsEvaluated: scoredDomains.length,
      scoringMethod: 'Explainable Multi-Factor Weighted Compatibility Model'
    }
  };
}
