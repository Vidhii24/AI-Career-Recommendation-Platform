import React, { useState } from 'react';
import {
  GraduationCap,
  Wrench,
  Sparkles,
  Briefcase,
  Layers,
  ChevronRight,
  ChevronLeft,
  Save,
  CheckCircle2,
  Plus,
  Trash2,
  HelpCircle,
  Clock,
  Target,
  ArrowRight
} from 'lucide-react';
import {
  ENGINEERING_BRANCHES,
  STUDY_YEARS,
  GRADUATION_YEARS,
  ACADEMIC_PERFORMANCE_OPTIONS,
  SKILL_CATEGORIES,
  INTEREST_OPTIONS,
  WORK_STYLE_OPTIONS,
  CAREER_ASPIRATION_OPTIONS
} from '../data/constants';
import { StudentProfile, SkillItem, SkillLevel } from '../types';

interface AssessmentWizardProps {
  initialProfile: StudentProfile;
  onSubmit: (profile: StudentProfile) => void;
  onSaveProgress: (profile: StudentProfile) => void;
}

export const AssessmentWizard: React.FC<AssessmentWizardProps> = ({
  initialProfile,
  onSubmit,
  onSaveProgress
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const [branch, setBranch] = useState(initialProfile.branch || 'Computer Engineering');
  const [year, setYear] = useState(initialProfile.year || '2nd Year');
  const [graduationYear, setGraduationYear] = useState(initialProfile.graduationYear || '2027');
  const [academicPerformance, setAcademicPerformance] = useState(
    initialProfile.academicPerformance || 'Intermediate'
  );
  const [academicInterestInput, setAcademicInterestInput] = useState('');
  const [academicInterests, setAcademicInterests] = useState<string[]>(
    initialProfile.academicInterests || ['Applied Engineering Projects']
  );

  // Step 2: Skills
  const [skills, setSkills] = useState<SkillItem[]>(initialProfile.skills || []);
  const [selectedCategoryTab, setSelectedCategoryTab] = useState(0);
  const [customSkillName, setCustomSkillName] = useState('');
  const [customSkillLevel, setCustomSkillLevel] = useState<SkillLevel>('Intermediate');

  // Step 3: Interests
  const [interests, setInterests] = useState<string[]>(initialProfile.interests || []);

  // Step 4: Work Preferences
  const [workStyles, setWorkStyles] = useState<string[]>(initialProfile.workStyles || []);

  // Step 5: Goals
  const [aspiration, setAspiration] = useState(initialProfile.aspiration || 'internship first');
  const [domainPreference, setDomainPreference] = useState(
    initialProfile.domainPreference || 'Open to all domain recommendations'
  );
  const [weeklyHours, setWeeklyHours] = useState<number>(initialProfile.weeklyHours || 12);

  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Build current profile state
  const getCurrentProfile = (): StudentProfile => ({
    ...initialProfile,
    branch,
    year,
    graduationYear,
    academicPerformance,
    academicInterests,
    skills,
    interests,
    workStyles,
    aspiration,
    domainPreference,
    weeklyHours
  });

  // Handle Skill toggling
  const toggleSkill = (skillName: string) => {
    const exists = skills.find((s) => s.name.toLowerCase() === skillName.toLowerCase());
    if (exists) {
      setSkills(skills.filter((s) => s.name.toLowerCase() !== skillName.toLowerCase()));
    } else {
      setSkills([...skills, { name: skillName, level: 'Intermediate' }]);
    }
  };

  const updateSkillLevel = (skillName: string, level: SkillLevel) => {
    setSkills(
      skills.map((s) =>
        s.name.toLowerCase() === skillName.toLowerCase() ? { ...s, level } : s
      )
    );
  };

  const addCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSkillName.trim()) return;
    const exists = skills.find(
      (s) => s.name.toLowerCase() === customSkillName.trim().toLowerCase()
    );
    if (!exists) {
      setSkills([...skills, { name: customSkillName.trim(), level: customSkillLevel }]);
      setCustomSkillName('');
      showNotification(`Added custom skill: ${customSkillName.trim()}`);
    }
  };

  const removeSkill = (skillName: string) => {
    setSkills(skills.filter((s) => s.name.toLowerCase() !== skillName.toLowerCase()));
  };

  // Handle interest toggle
  const toggleInterest = (id: string) => {
    if (interests.includes(id)) {
      setInterests(interests.filter((i) => i !== id));
    } else {
      setInterests([...interests, id]);
    }
  };

  // Handle work style toggle
  const toggleWorkStyle = (id: string) => {
    if (workStyles.includes(id)) {
      setWorkStyles(workStyles.filter((w) => w !== id));
    } else {
      setWorkStyles([...workStyles, id]);
    }
  };

  const handleSaveProgress = () => {
    const profile = getCurrentProfile();
    onSaveProgress(profile);
    showNotification('Progress saved to your browser and backend!');
  };

  const handleNext = () => {
    if (currentStep === 1 && !branch) {
      alert('Please select your engineering branch.');
      return;
    }
    if (currentStep === 2 && skills.length === 0) {
      const proceed = confirm(
        'You have not selected any technical skills yet. Career recommendations will be more accurate if you select at least 1-2 skills. Would you like to proceed anyway?'
      );
      if (!proceed) return;
    }
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const profile = getCurrentProfile();
    onSubmit(profile);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl border border-slate-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Progress Header */}
      <div className="mb-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-brand-100 text-brand-700 text-xs font-extrabold uppercase tracking-wide">
              Step {currentStep} of {totalSteps}
            </span>
            <h2 className="text-base font-bold text-slate-800">
              {currentStep === 1 && 'Academic Background & Stage'}
              {currentStep === 2 && 'Technical Skills & Proficiency'}
              {currentStep === 3 && 'Interests & Activities'}
              {currentStep === 4 && 'Preferred Working Style'}
              {currentStep === 5 && 'Career Goals & Learning Time'}
            </h2>
          </div>
          <button
            type="button"
            onClick={handleSaveProgress}
            className="text-xs text-slate-500 hover:text-brand-600 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Save Progress</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-linear-to-r from-brand-600 to-accent-teal h-full rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>

        {/* Step Indicator Nodes */}
        <div className="flex justify-between items-center mt-3 text-[11px] font-semibold text-slate-400">
          <span className={currentStep >= 1 ? 'text-brand-600 font-bold' : ''}>1. Academic</span>
          <span className={currentStep >= 2 ? 'text-brand-600 font-bold' : ''}>2. Skills</span>
          <span className={currentStep >= 3 ? 'text-brand-600 font-bold' : ''}>3. Interests</span>
          <span className={currentStep >= 4 ? 'text-brand-600 font-bold' : ''}>4. Work Style</span>
          <span className={currentStep >= 5 ? 'text-brand-600 font-bold' : ''}>5. Goals</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* STEP 1: Academic Background */}
        {currentStep === 1 && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Academic Background</h3>
              <p className="text-xs text-slate-500 mt-1">
                Tell us about your engineering discipline and graduation timeline. We do not use CGPA to exclude any career opportunities.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Branch */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Engineering Branch *
                </label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 font-medium"
                >
                  {ENGINEERING_BRANCHES.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              {/* Study Year */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Current Academic Year *
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 font-medium"
                >
                  {STUDY_YEARS.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              {/* Graduation Year */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Expected Graduation Year
                </label>
                <select
                  value={graduationYear}
                  onChange={(e) => setGraduationYear(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 font-medium"
                >
                  {GRADUATION_YEARS.map((gy) => (
                    <option key={gy} value={gy}>
                      {gy}
                    </option>
                  ))}
                </select>
              </div>

              {/* Academic Performance Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Academic Performance Category
                </label>
                <select
                  value={academicPerformance}
                  onChange={(e) => setAcademicPerformance(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 font-medium"
                >
                  {ACADEMIC_PERFORMANCE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Note on CGPA */}
            <div className="p-3.5 rounded-xl bg-brand-50/60 border border-brand-100 flex items-start gap-3 text-xs text-brand-800">
              <HelpCircle className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
              <span>
                <strong>Merit & Exploration Principle:</strong> We prioritize your hands-on technical abilities, projects, and genuine interests over grades alone.
              </span>
            </div>
          </div>
        )}

        {/* STEP 2: Technical Skills Assessment */}
        {currentStep === 2 && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Existing Technical Skills</h3>
              <p className="text-xs text-slate-500 mt-1">
                Select the tools, languages, and technical frameworks you are familiar with. For each skill, specify your proficiency level.
              </p>
            </div>

            {/* Selected Skills Summary Chip Bar */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Selected Skills ({skills.length})
                </span>
                {skills.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSkills([])}
                    className="text-[11px] text-red-600 hover:underline"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {skills.length === 0 ? (
                <p className="text-xs text-slate-400 italic">
                  No skills selected yet. Click skills below to add them to your profile.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
                  {skills.map((skill) => (
                    <div
                      key={skill.name}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs shadow-2xs"
                    >
                      <span className="font-semibold text-slate-800">{skill.name}</span>
                      <select
                        value={skill.level}
                        onChange={(e) => updateSkillLevel(skill.name, e.target.value as SkillLevel)}
                        className="text-[11px] py-0.5 px-1.5 rounded bg-brand-50 text-brand-700 border border-brand-200 font-semibold focus:outline-hidden"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Not sure">Not sure</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => removeSkill(skill.name)}
                        className="text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Skill Category Tabs */}
            <div>
              <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
                {SKILL_CATEGORIES.map((cat, idx) => (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => setSelectedCategoryTab(idx)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      selectedCategoryTab === idx
                        ? 'bg-brand-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Skills in current category */}
              <div className="mt-4 flex flex-wrap gap-2">
                {SKILL_CATEGORIES[selectedCategoryTab].skills.map((skillName) => {
                  const isSelected = skills.some(
                    (s) => s.name.toLowerCase() === skillName.toLowerCase()
                  );
                  return (
                    <button
                      key={skillName}
                      type="button"
                      onClick={() => toggleSkill(skillName)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border flex items-center gap-2 cursor-pointer ${
                        isSelected
                          ? 'bg-brand-50 border-brand-500 text-brand-800 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {isSelected ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-600" />
                      ) : (
                        <Plus className="w-3.5 h-3.5 text-slate-400" />
                      )}
                      <span>{skillName}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Add Custom Skill Form */}
            <div className="pt-4 border-t border-slate-200">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
                Can't find a skill? Add a custom skill:
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <input
                  type="text"
                  placeholder="e.g. Next.js, PyTorch, GraphQL, ANSYS, ROS..."
                  value={customSkillName}
                  onChange={(e) => setCustomSkillName(e.target.value)}
                  className="w-full sm:flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500"
                />
                <select
                  value={customSkillLevel}
                  onChange={(e) => setCustomSkillLevel(e.target.value as SkillLevel)}
                  className="w-full sm:w-auto px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-medium"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Not sure">Not sure</option>
                </select>
                <button
                  type="button"
                  onClick={addCustomSkill}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Add Skill
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Interests & Activities */}
        {currentStep === 3 && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Interests & Preferred Activities</h3>
              <p className="text-xs text-slate-500 mt-1">
                Select the types of engineering challenges and problems you genuinely enjoy working on (select all that appeal to you).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {INTEREST_OPTIONS.map((item) => {
                const isSelected = interests.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleInterest(item.id)}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-3 select-none ${
                      isSelected
                        ? 'bg-brand-50/70 border-brand-500 shadow-xs ring-1 ring-brand-500'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md mt-0.5 flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-brand-600 text-white' : 'border border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{item.label}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: Preferred Working Style */}
        {currentStep === 4 && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Preferred Working Style</h3>
              <p className="text-xs text-slate-500 mt-1">
                How do you prefer approaching engineering tasks in labs, team projects, and individual development?
              </p>
            </div>

            <div className="space-y-3">
              {WORK_STYLE_OPTIONS.map((ws) => {
                const isSelected = workStyles.includes(ws.id);
                return (
                  <div
                    key={ws.id}
                    onClick={() => toggleWorkStyle(ws.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between select-none ${
                      isSelected
                        ? 'bg-brand-50 border-brand-500 shadow-xs ring-1 ring-brand-500'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-slate-900">{ws.label}</h4>
                      <p className="text-[11px] text-slate-500">{ws.desc}</p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-brand-600 text-white' : 'border border-slate-300'
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 5: Career Goals & Timeline */}
        {currentStep === 5 && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Career Goals & Timeline</h3>
              <p className="text-xs text-slate-500 mt-1">
                Define your immediate milestones and how many hours you can dedicate each week toward your roadmap.
              </p>
            </div>

            {/* Aspiration */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Primary Goal Stage
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CAREER_ASPIRATION_OPTIONS.map((asp) => {
                  const isSelected = aspiration === asp.id;
                  return (
                    <div
                      key={asp.id}
                      onClick={() => setAspiration(asp.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 select-none ${
                        isSelected
                          ? 'bg-brand-50 border-brand-500 shadow-xs ring-1 ring-brand-500'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        checked={isSelected}
                        onChange={() => setAspiration(asp.id)}
                        className="mt-0.5 text-brand-600 focus:ring-brand-500"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{asp.label}</h4>
                        <p className="text-[11px] text-slate-500 leading-tight mt-0.5">{asp.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Weekly Learning Commitment */}
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Weekly Learning Time Commitment
                </label>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-brand-50 text-brand-700 border border-brand-200">
                  {weeklyHours} Hours / Week
                </span>
              </div>
              <input
                type="range"
                min="4"
                max="30"
                step="2"
                value={weeklyHours}
                onChange={(e) => setWeeklyHours(parseInt(e.target.value, 10))}
                className="w-full accent-brand-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                <span>4 hrs (Light)</span>
                <span>12 hrs (Standard College Pace)</span>
                <span>30 hrs (Intensive)</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons Bar */}
        <div className="mt-8 flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handlePrev}
              className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSaveProgress}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4 text-slate-400" />
              <span className="hidden sm:inline">Save Progress</span>
            </button>

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold shadow-md shadow-brand-500/20 hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                className="px-8 py-3 rounded-xl bg-linear-to-r from-brand-600 via-brand-700 to-accent-teal hover:opacity-95 text-white text-sm font-bold shadow-lg shadow-brand-500/25 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Calculate Career Recommendations</span>
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};
