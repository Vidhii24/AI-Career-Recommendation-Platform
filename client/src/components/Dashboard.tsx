import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Briefcase,
  ChevronRight,
  TrendingUp,
  BarChart2,
  Bookmark,
  Sliders,
  Award,
  Clock,
  Code2,
  Target,
  Cpu,
  Info,
  ExternalLink,
  Layers,
  HelpCircle
} from 'lucide-react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer
} from 'recharts';
import {
  StudentProfile,
  DomainRecommendation,
  RecommendationResponse
} from '../types';

interface DashboardProps {
  userName?: string;
  profile: StudentProfile;
  recommendations: RecommendationResponse;
  onEditProfile: () => void;
  onViewDomainDetail: (domainName: string) => void;
  onUpdateTaskStatus: (phaseIndex: number, taskIndex: number, status: 'not_started' | 'in_progress' | 'completed') => void;
  onToggleSaveDomain: (domainName: string) => void;
  savedDomainNames: string[];
}

export const Dashboard: React.FC<DashboardProps> = ({
  userName,
  profile,
  recommendations,
  onEditProfile,
  onViewDomainDetail,
  onUpdateTaskStatus,
  onToggleSaveDomain,
  savedDomainNames
}) => {
  const topThree = recommendations.topThree;
  const [selectedDomainIndex, setSelectedDomainIndex] = useState(0);
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [showMethodologyModal, setShowMethodologyModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'matches' | 'roadmap' | 'skills' | 'saved'>('matches');

  const activeDomain = topThree[selectedDomainIndex] || topThree[0];

  // Radar chart data comparing top 3 domains
  const radarData = [
    {
      metric: 'Skill Fit',
      Domain1: topThree[0]?.scoreBreakdown.skillScore || 60,
      Domain2: topThree[1]?.scoreBreakdown.skillScore || 50,
      Domain3: topThree[2]?.scoreBreakdown.skillScore || 40,
    },
    {
      metric: 'Interest',
      Domain1: topThree[0]?.scoreBreakdown.interestScore || 70,
      Domain2: topThree[1]?.scoreBreakdown.interestScore || 65,
      Domain3: topThree[2]?.scoreBreakdown.interestScore || 60,
    },
    {
      metric: 'Work Style',
      Domain1: topThree[0]?.scoreBreakdown.workStyleScore || 65,
      Domain2: topThree[1]?.scoreBreakdown.workStyleScore || 60,
      Domain3: topThree[2]?.scoreBreakdown.workStyleScore || 55,
    },
    {
      metric: 'Curriculum',
      Domain1: topThree[0]?.scoreBreakdown.branchScore || 80,
      Domain2: topThree[1]?.scoreBreakdown.branchScore || 70,
      Domain3: topThree[2]?.scoreBreakdown.branchScore || 60,
    },
    {
      metric: 'Goal Timeline',
      Domain1: topThree[0]?.scoreBreakdown.goalScore || 75,
      Domain2: topThree[1]?.scoreBreakdown.goalScore || 70,
      Domain3: topThree[2]?.scoreBreakdown.goalScore || 65,
    }
  ];

  // Calculate Roadmap Progress for active domain
  const roadmapTasks = activeDomain.learningRoadmap.flatMap((phase, pIdx) =>
    phase.tasks.map((task, tIdx) => {
      const key = `p${pIdx}_t${tIdx}`;
      const savedStatus = profile.roadmapProgress?.[key] || task.status;
      return { ...task, savedStatus, pIdx, tIdx, phaseTitle: phase.title };
    })
  );

  const completedCount = roadmapTasks.filter((t) => t.savedStatus === 'completed').length;
  const inProgressCount = roadmapTasks.filter((t) => t.savedStatus === 'in_progress').length;
  const totalTasks = Math.max(roadmapTasks.length, 1);
  const completionPercentage = Math.round((completedCount / totalTasks) * 100);

  // Next 3 actionable roadmap tasks for preview
  const upcomingTasks = roadmapTasks.filter((t) => t.savedStatus !== 'completed').slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* 1. COMPACT WELCOME INTRODUCTION (Section 4) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600">
                YOUR CAREER DASHBOARD
              </span>
              <button
                onClick={() => setShowMethodologyModal(true)}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                title="View how ML and curriculum factors are calculated"
              >
                <Cpu className="w-3 h-3 text-brand-600" />
                <span>ML-Powered</span>
                <Info className="w-2.5 h-2.5 text-slate-400" />
              </button>
            </div>

            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Welcome back{userName || profile.name ? `, ${userName || profile.name}` : ''}!
            </h1>

            <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
              Discover your best-fit career paths and take the next step toward your professional goals.
            </p>

            {/* Compact secondary row */}
            <div className="pt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-600">
              <span className="font-semibold text-slate-900">
                {profile.branch} · {profile.year}
              </span>
              <span className="text-slate-300 hidden sm:inline">•</span>
              <span className="flex items-center gap-1.5 text-slate-600">
                <Target className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Goal: {profile.aspiration || 'Internship first'}</span>
              </span>
              <span className="text-slate-300 hidden sm:inline">•</span>
              <span className="flex items-center gap-1.5 text-slate-600">
                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Commitment: {profile.weeklyHours || 12} hrs/week</span>
              </span>
              <span className="text-slate-300 hidden sm:inline">•</span>
              <span className="flex items-center gap-1.5 text-slate-600">
                <Award className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                <span>3 Recommended Domains</span>
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5 self-start md:self-center shrink-0">
            <button
              onClick={() => setShowComparisonModal(true)}
              className="px-3.5 py-2 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <BarChart2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Compare Top 3</span>
            </button>

            <button
              onClick={onEditProfile}
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. SIMPLIFIED HORIZONTAL TAB BAR (Section 5) */}
      <div className="border-b border-slate-200/90">
        <nav className="flex space-x-6 sm:space-x-8 overflow-x-auto pb-px" aria-label="Dashboard Tabs">
          {[
            { id: 'matches', label: 'Top Career Matches', count: 3 },
            { id: 'roadmap', label: 'Adaptive Roadmap', badge: `${completionPercentage}%` },
            { id: 'skills', label: 'Skills & Gap Matrix', count: profile.skills.length },
            { id: 'saved', label: 'Saved Items', count: savedDomainNames.length }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 text-xs font-medium border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'border-brand-600 text-brand-600 font-semibold'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold ${
                    isActive ? 'bg-brand-50 text-brand-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {tab.badge}
                  </span>
                )}
                {tab.count !== undefined && (
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold ${
                    isActive ? 'bg-brand-50 text-brand-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* 3. TAB 1: TOP CAREER MATCHES & VISUAL HIERARCHY */}
      {activeTab === 'matches' && (
        <div className="space-y-8 animate-in fade-in duration-100">
          {/* Top 3 Career Recommendation Cards Grid (Section 6 & 7) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {topThree.map((domain, idx) => {
              const isTop = idx === 0;
              const isSelected = selectedDomainIndex === idx;
              const isSaved = savedDomainNames.includes(domain.domainName);

              return (
                <div
                  key={domain.domainName}
                  onClick={() => setSelectedDomainIndex(idx)}
                  className={`bg-white rounded-2xl p-5 border transition-all cursor-pointer flex flex-col justify-between ${
                    isTop
                      ? 'border-brand-300 shadow-xs ring-1 ring-brand-100'
                      : isSelected
                      ? 'border-brand-400 shadow-xs'
                      : 'border-slate-200/90 hover:border-slate-300 hover:shadow-xs'
                  }`}
                >
                  <div>
                    {/* Top Row: Rank & Match Score */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-md text-[11px] font-bold flex items-center justify-center ${
                          isTop ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-700'
                        }`}>
                          #{idx + 1}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                          {domain.category}
                        </span>
                      </div>

                      {/* Single Primary Match Indicator (Section 7) */}
                      <div className="text-right">
                        <span className="text-sm font-extrabold text-brand-700">
                          {domain.matchScore}%
                        </span>
                        <span className="text-[10px] text-slate-500 block -mt-0.5 font-medium">
                          profile match
                        </span>
                      </div>
                    </div>

                    {/* Domain Name & Summary */}
                    <div className="space-y-1 mb-3.5">
                      <h3 className="text-base font-bold text-slate-900 tracking-tight leading-snug">
                        {domain.domainName}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {domain.description}
                      </p>
                    </div>

                    {/* Why this matches you */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 mb-3.5 text-xs text-slate-700 space-y-1">
                      <p className="line-clamp-2 leading-relaxed">
                        • {domain.reasons[0] || 'Matches your core technical foundations and goals.'}
                      </p>
                    </div>

                    {/* Skills Snapshot */}
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                          Matching Skills
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {domain.matchedSkills.length > 0 ? (
                            domain.matchedSkills.slice(0, 3).map((s) => (
                              <span
                                key={s.name}
                                className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-100 text-[11px] font-medium"
                              >
                                {s.name}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-400 text-[11px] italic">Foundation to be developed</span>
                          )}
                          {domain.matchedSkills.length > 3 && (
                            <span className="text-[10px] text-slate-400 font-mono self-center">
                              +{domain.matchedSkills.length - 3}
                            </span>
                          )}
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                          To Develop
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {domain.missingSkills.slice(0, 2).map((s) => (
                            <span
                              key={s.name}
                              className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-100 text-[11px] font-medium"
                            >
                              {s.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Row: Actions */}
                  <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDomainIndex(idx);
                        setActiveTab('roadmap');
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>View Roadmap</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleSaveDomain(domain.domainName);
                        }}
                        className={`p-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                          isSaved
                            ? 'bg-brand-50 border-brand-200 text-brand-600'
                            : 'border-slate-200 text-slate-400 hover:text-slate-600'
                        }`}
                        title={isSaved ? 'Saved to bookmarks' : 'Save domain'}
                      >
                        <Bookmark className="w-3.5 h-3.5" fill={isSaved ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* VISUAL HIERARCHY PREVIEWS (Section 8) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Roadmap Preview & Skills Overview */}
            <div className="lg:col-span-7 space-y-6">
              {/* Roadmap Preview (Next 3 tasks) */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Roadmap Preview: {activeDomain.domainName}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Next actionable milestones tailored for your study year
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('roadmap')}
                    className="text-xs text-brand-600 font-semibold hover:text-brand-800 flex items-center gap-1 cursor-pointer"
                  >
                    <span>View full roadmap</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2">
                  {upcomingTasks.length > 0 ? (
                    upcomingTasks.map((task, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <button
                            onClick={() => onUpdateTaskStatus(task.pIdx, task.tIdx, 'completed')}
                            className="cursor-pointer text-slate-400 hover:text-emerald-600 transition-colors"
                          >
                            <div className="w-4 h-4 rounded border border-slate-300 bg-white" />
                          </button>
                          <span className="text-slate-800 font-medium">{task.title}</span>
                        </div>
                        <span className="text-[11px] text-slate-500 font-mono shrink-0">
                          {task.duration || '2 wks'}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-xs text-emerald-800 bg-emerald-50 rounded-xl">
                      All immediate tasks in this roadmap are marked completed!
                    </div>
                  )}
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
                  <span>Overall progress: {completionPercentage}% completed</span>
                  <button
                    onClick={() => setActiveTab('roadmap')}
                    className="text-brand-600 hover:underline"
                  >
                    Open Roadmap Checklist
                  </button>
                </div>
              </div>

              {/* Skills Overview Preview */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Skills Overview & Gap Summary</h3>
                    <p className="text-xs text-slate-500">
                      Comparison between your current skills and target domain requirements
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('skills')}
                    className="text-xs text-brand-600 font-semibold hover:text-brand-800 flex items-center gap-1 cursor-pointer"
                  >
                    <span>View all skills</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="font-bold text-emerald-800 block mb-1">
                      Your Strengths ({profile.skills.length})
                    </span>
                    <p className="text-slate-600 line-clamp-2">
                      {profile.skills.map((s) => s.name).join(', ') || 'No skills selected'}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="font-bold text-amber-800 block mb-1">
                      Recommended Next ({activeDomain.missingSkills.length})
                    </span>
                    <p className="text-slate-600 line-clamp-2">
                      {activeDomain.missingSkills.slice(0, 4).map((s) => s.name).join(', ')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Multi-Dimensional Radar Comparison */}
            <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Domain Compatibility Dimensions
                  </h3>
                  <p className="text-xs text-slate-500">
                    Radar evaluation across skills, interest, and curriculum
                  </p>
                </div>
                <button
                  onClick={() => setShowMethodologyModal(true)}
                  className="text-slate-400 hover:text-slate-600"
                  title="Methodology notes"
                >
                  <HelpCircle className="w-4 h-4" />
                </button>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                    <PolarGrid stroke="#f1f5f9" />
                    <PolarAngleAxis dataKey="metric" tick={{ fill: '#64748b', fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#e2e8f0" tick={false} />
                    <Radar
                      name={topThree[0]?.domainName}
                      dataKey="Domain1"
                      stroke="#2563eb"
                      fill="#3b82f6"
                      fillOpacity={0.35}
                    />
                    <Radar
                      name={topThree[1]?.domainName}
                      dataKey="Domain2"
                      stroke="#0d9488"
                      fill="#14b8a6"
                      fillOpacity={0.25}
                    />
                    <Radar
                      name={topThree[2]?.domainName}
                      dataKey="Domain3"
                      stroke="#d97706"
                      fill="#f59e0b"
                      fillOpacity={0.2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 text-xs pt-1 border-t border-slate-100">
                <span className="flex items-center gap-1 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-600" />
                  <span className="truncate max-w-[100px]">{topThree[0]?.domainName}</span>
                </span>
                <span className="flex items-center gap-1 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-accent-teal" />
                  <span className="truncate max-w-[100px]">{topThree[1]?.domainName}</span>
                </span>
                <span className="flex items-center gap-1 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-accent-amber" />
                  <span className="truncate max-w-[100px]">{topThree[2]?.domainName}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB 2: ADAPTIVE ROADMAP VIEW */}
      {activeTab === 'roadmap' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-6 animate-in fade-in duration-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                  LEARNING ROADMAP
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-slate-500">
                  Paced for {profile.weeklyHours || 12} hrs/week
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                {activeDomain.domainName}
              </h2>
            </div>

            {/* Domain Switcher */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
              {topThree.map((d, idx) => (
                <button
                  key={d.domainName}
                  onClick={() => setSelectedDomainIndex(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    selectedDomainIndex === idx
                      ? 'bg-white text-brand-700 font-semibold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  #{idx + 1} {d.domainName.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-slate-600">
              <span className="font-semibold text-slate-800">
                {completedCount} of {totalTasks} milestones completed ({completionPercentage}%)
              </span>
              <span>{inProgressCount} in progress</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-brand-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          {/* Step-by-Step Phases */}
          <div className="space-y-5 pt-2">
            {activeDomain.learningRoadmap.map((phase) => (
              <div
                key={phase.phaseNumber}
                className="p-5 rounded-xl border border-slate-200/80 bg-white space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-800 text-xs font-bold flex items-center justify-center">
                      P{phase.phaseNumber}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">{phase.title}</h4>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">
                    {phase.estimatedDuration}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{phase.objective}</p>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  {phase.tasks.map((task, tIdx) => {
                    const key = `p${phase.phaseNumber - 1}_t${tIdx}`;
                    const currentStatus = profile.roadmapProgress?.[key] || task.status;

                    return (
                      <div
                        key={tIdx}
                        className={`p-3 rounded-lg border text-xs flex items-center justify-between gap-3 ${
                          currentStatus === 'completed'
                            ? 'bg-emerald-50/50 border-emerald-100 text-emerald-900'
                            : currentStatus === 'in_progress'
                            ? 'bg-brand-50/50 border-brand-100 text-brand-900'
                            : 'bg-slate-50/50 border-slate-100 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <button
                            onClick={() => {
                              const next = currentStatus === 'completed' ? 'not_started' : 'completed';
                              onUpdateTaskStatus(phase.phaseNumber - 1, tIdx, next);
                            }}
                            className="cursor-pointer text-slate-400 hover:text-emerald-600"
                          >
                            {currentStatus === 'completed' ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <div className="w-4 h-4 rounded border border-slate-300 bg-white" />
                            )}
                          </button>
                          <span className={currentStatus === 'completed' ? 'line-through text-slate-400' : ''}>
                            {task.title}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onUpdateTaskStatus(phase.phaseNumber - 1, tIdx, 'in_progress')}
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors cursor-pointer ${
                              currentStatus === 'in_progress'
                                ? 'bg-brand-600 text-white'
                                : 'text-slate-400 hover:text-slate-600'
                            }`}
                          >
                            In Progress
                          </button>
                          <button
                            onClick={() => onUpdateTaskStatus(phase.phaseNumber - 1, tIdx, 'completed')}
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors cursor-pointer ${
                              currentStatus === 'completed'
                                ? 'bg-emerald-600 text-white'
                                : 'text-slate-400 hover:text-slate-600'
                            }`}
                          >
                            Done
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="text-[11px] text-slate-500 pt-1">
                  <strong>Deliverable:</strong> {phase.deliverable}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. TAB 3: SKILLS & GAP MATRIX VIEW */}
      {activeTab === 'skills' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-6 animate-in fade-in duration-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Skills Overview & Gap Matrix</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Detailed breakdown of your current technical abilities versus skills required for {activeDomain.domainName}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Skills You Have */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block">
                Skills You Have ({profile.skills.length})
              </span>
              <div className="space-y-2">
                {profile.skills.map((s) => (
                  <div
                    key={s.name}
                    className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs flex items-center justify-between"
                  >
                    <span className="font-medium text-slate-800">{s.name}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600 font-medium">
                      {s.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills to Reinforce */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800 block">
                Skills to Improve ({activeDomain.skillsToImprove.length})
              </span>
              <div className="space-y-2">
                {activeDomain.skillsToImprove.length > 0 ? (
                  activeDomain.skillsToImprove.map((s) => (
                    <div
                      key={s.name}
                      className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs flex items-center justify-between"
                    >
                      <span className="font-medium text-slate-800">{s.name}</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-50 text-amber-800 font-medium">
                        Practice
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">No skills flagged for improvement.</p>
                )}
              </div>
            </div>

            {/* Recommended Skills */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-800 block">
                Recommended Next Skills ({activeDomain.missingSkills.length})
              </span>
              <div className="space-y-2">
                {activeDomain.missingSkills.map((s) => (
                  <div
                    key={s.name}
                    className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs flex items-center justify-between"
                  >
                    <span className="font-medium text-slate-800">{s.name}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-brand-50 text-brand-700 font-medium">
                      Target Next
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. TAB 4: SAVED ITEMS & BOOKMARKS */}
      {activeTab === 'saved' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-6 animate-in fade-in duration-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Saved Career Domains & Bookmarks</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Quick access to career domains you have bookmarked for future reference
            </p>
          </div>

          {savedDomainNames.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-100">
              <Bookmark className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-600">No career domains saved yet</p>
              <p className="text-xs text-slate-400 mt-1">
                Click the bookmark icon on any career domain card to save it here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {savedDomainNames.map((name) => (
                <div
                  key={name}
                  className="p-4 rounded-xl border border-slate-200 bg-white flex items-center justify-between"
                >
                  <span className="font-semibold text-xs text-slate-900">{name}</span>
                  <button
                    onClick={() => onViewDomainDetail(name)}
                    className="text-xs text-brand-600 font-semibold hover:underline cursor-pointer"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* COMPARISON MODAL */}
      {showComparisonModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Compare Top 3 Career Matches
                </h3>
                <p className="text-xs text-slate-500">
                  Side-by-side evaluation of requirements and potential roles
                </p>
              </div>
              <button
                onClick={() => setShowComparisonModal(false)}
                className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topThree.map((d, idx) => (
                <div key={d.domainName} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">#{idx + 1} {d.domainName}</span>
                    <span className="text-xs font-bold text-brand-700">{d.matchScore}% Match</span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2">{d.description}</p>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="font-semibold text-slate-700 block text-[11px] uppercase">
                        Matching Skills:
                      </span>
                      <p className="text-slate-600">
                        {d.matchedSkills.map((s) => s.name).join(', ') || 'Foundations to develop'}
                      </p>
                    </div>

                    <div>
                      <span className="font-semibold text-slate-700 block text-[11px] uppercase">
                        Gaps to Learn:
                      </span>
                      <p className="text-amber-800">
                        {d.missingSkills.slice(0, 3).map((s) => s.name).join(', ')}
                      </p>
                    </div>

                    <div>
                      <span className="font-semibold text-slate-700 block text-[11px] uppercase">
                        Roles:
                      </span>
                      <p className="text-slate-600">{d.potentialRoles.slice(0, 2).join(' • ')}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedDomainIndex(idx);
                      setShowComparisonModal(false);
                      setActiveTab('roadmap');
                    }}
                    className="w-full py-1.5 rounded-lg bg-brand-600 text-white font-semibold text-xs hover:bg-brand-700 transition-colors cursor-pointer"
                  >
                    Select Roadmap
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* METHODOLOGY & ML EXPLANATION MODAL */}
      {showMethodologyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-xl w-full shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-brand-600" />
                <h3 className="text-base font-bold text-slate-900">
                  How Recommendations Are Generated
                </h3>
              </div>
              <button
                onClick={() => setShowMethodologyModal(false)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <p>
                <strong>1. Machine Learning Inference:</strong> We train an ensemble <code>RandomForestClassifier</code> (200 trees) on engineering student skill vectors, branching profiles, and interests to estimate domain class probabilities.
              </p>
              <p>
                <strong>2. Five-Factor Curriculum Compatibility:</strong> Raw ML probabilities are merged with a transparent heuristic model evaluating:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Technical Skill Overlap (35%)</li>
                <li>Interest & Problem Alignment (25%)</li>
                <li>Preferred Working Style (15%)</li>
                <li>Branch Curriculum Synergy (15%)</li>
                <li>Career Goal & Timeline (10%)</li>
              </ul>
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px]">
                <strong>Notice:</strong> Match scores represent algorithmic profile compatibility indices, not a guaranteed probability of landing a job.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
