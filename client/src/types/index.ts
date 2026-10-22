export interface UserAccount {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: UserAccount;
  hasCompletedAssessment?: boolean;
  error?: string;
  resetToken?: string;
}

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Not sure';

export interface SkillItem {
  name: string;
  level: SkillLevel;
  status?: string;
}

export interface StudentProfile {
  profileId?: string;
  name?: string;
  branch: string;
  year: string;
  graduationYear?: string;
  academicInterests?: string[];
  academicPerformance?: 'Developing' | 'Intermediate' | 'Strong' | 'Unspecified';
  skills: SkillItem[];
  interests: string[];
  workStyles: string[];
  aspiration: string;
  domainPreference?: string;
  weeklyHours: number;
  roadmapProgress?: Record<string, 'not_started' | 'in_progress' | 'completed'>;
  recommendations?: RecommendationResponse;
  savedItems?: {
    domains: { name: string; data?: any; savedAt: string }[];
    opportunities?: { id: string; data?: any; savedAt: string }[];
    applications?: Record<string, { status: string; updatedAt: string }>;
  };
}

export interface ScoreBreakdown {
  skillScore: number;
  interestScore: number;
  workStyleScore: number;
  branchScore: number;
  goalScore: number;
  compositeScore: number;
}

export interface RoadmapTask {
  title: string;
  status: 'not_started' | 'in_progress' | 'completed';
  duration?: string;
}

export interface RoadmapPhase {
  phaseNumber: number;
  title: string;
  objective: string;
  estimatedDuration: string;
  tasks: RoadmapTask[];
  deliverable: string;
}

export interface DomainRecommendation {
  domainName: string;
  category: string;
  description: string;
  matchScore: number;
  mlModelPredicted?: boolean;
  mlScore?: number;
  mlConfidencePercent?: number;
  mlExplanation?: string;
  scoreBreakdown: ScoreBreakdown;
  reasons: string[];
  matchedSkills: { name: string; level: SkillLevel; status: string }[];
  skillsToImprove: { name: string; level: SkillLevel; status: string }[];
  missingSkills: { name: string; priority: string }[];
  potentialRoles: string[];
  learningRoadmap: RoadmapPhase[];
  projectIdeas: string[];
  learningResources: string[];
}

export interface MLMetadata {
  model: string;
  version: string;
  topMLDomain?: string;
  topMLScore?: number;
  topMLConfidence?: number;
  disclaimer: string;
}

export interface RecommendationResponse {
  topThree: DomainRecommendation[];
  allRanked: DomainRecommendation[];
  mlMetadata?: MLMetadata;
  metadata: {
    generatedAt: string;
    studentBranch: string;
    studentYear: string;
    totalDomainsEvaluated: number;
    scoringMethod: string;
  };
}

export interface CareerDomainCatalogItem {
  name: string;
  category: string;
  description: string;
  relevantSkills: string[];
  potentialRoles: string[];
  roadmapSummary: string;
  projectIdeas: string[];
  learningResources: string[];
  branchSynergy: string[];
}

export interface JobOpportunity {
  id: string;
  title: string;
  company: string;
  domain: string;
  requiredSkills: string[];
  eligibility: string;
  type: 'Internship' | 'Full-time';
  location: string;
  workMode: 'Remote' | 'Hybrid' | 'On-site';
  stipend?: string;
  deadline?: string;
  applicationLink: string;
  dateVerified: string;
  isSample: boolean;
  description: string;
}

export interface PresetProfile {
  id: string;
  title: string;
  branch: string;
  year: string;
  graduationYear: string;
  category: string;
  skills: SkillItem[];
  interests: string[];
  workStyles: string[];
  aspiration: string;
  weeklyHours: number;
}
