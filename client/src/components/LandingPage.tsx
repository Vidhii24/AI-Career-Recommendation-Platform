import React, { useState } from 'react';
import {
  Compass,
  ArrowRight,
  Sparkles,
  BookOpen,
  Target,
  CheckCircle2,
  ChevronRight,
  Code2,
  Cpu,
  Layers,
  Shield,
  Activity,
  Zap,
  Bot,
  Wrench,
  Building,
  GraduationCap,
  Users,
  Search,
  ExternalLink
} from 'lucide-react';
import { CareerDomainCatalogItem } from '../types';

interface LandingPageProps {
  onStartAssessment: () => void;
  onExploreDomains: () => void;
  domains: CareerDomainCatalogItem[];
  onSelectDomainForModal: (domain: CareerDomainCatalogItem) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartAssessment,
  onExploreDomains,
  domains,
  onSelectDomainForModal
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = [
    'All',
    'Software & Computing',
    'AI & Data Science',
    'Hardware & IoT',
    'Mechanical & Production',
    'Civil & Infrastructure',
    'Electrical & Clean Tech'
  ];

  const filteredDomains = domains.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.relevantSkills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
      d.potentialRoles.some((r) => r.toLowerCase().includes(searchTerm.toLowerCase()));

    if (activeCategory === 'All') return matchesSearch;
    return matchesSearch && d.category.toLowerCase().includes(activeCategory.toLowerCase().split(' ')[0]);
  });

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-linear-to-b from-brand-50/60 via-white to-slate-50">
        {/* Subtle grid background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left text column */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100/80 border border-brand-200 text-brand-800 text-xs font-semibold shadow-2xs">
                <Sparkles className="w-4 h-4 text-brand-600" />
                <span>Next-Gen Engineering Career Discovery Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
                Your Skills Have a Future.{' '}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-600 via-brand-700 to-accent-teal">
                  Discover Where They Belong.
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 font-normal max-w-2xl leading-relaxed">
                Discover career domains that match your skills, explore personalized learning roadmaps, and turn your potential into an actionable career plan.
              </p>

              {/* CTA Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button
                  onClick={onStartAssessment}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-base shadow-lg shadow-brand-500/25 hover:shadow-xl hover:shadow-brand-500/30 transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>Discover My Career Path</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={onExploreDomains}
                  className="w-full sm:w-auto px-7 py-4 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-semibold text-base border border-slate-300 shadow-2xs hover:border-slate-400 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Compass className="w-5 h-5 text-brand-600" />
                  <span>Explore Career Domains</span>
                </button>
              </div>

              {/* Supported engineering branches pill list */}
              <div className="pt-4 border-t border-slate-200/80">
                <p className="text-xs uppercase font-bold tracking-wider text-slate-600 mb-2.5">
                  Designed for Engineering Disciplines
                </p>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                  {[
                    'Computer & CSE',
                    'Information Tech',
                    'ECE & VLSI',
                    'Electrical & Energy',
                    'Mechanical & CAD',
                    'Civil & BIM',
                    'Chemical & Process'
                  ].map((b) => (
                    <span
                      key={b}
                      className="px-2.5 py-1 text-xs font-semibold rounded-md bg-white text-slate-700 border border-slate-200 shadow-2xs"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Interactive Node Graphic */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none bg-linear-to-b from-white to-slate-50/90 rounded-2xl p-6 shadow-xl border border-slate-200/90">
                {/* Header of graphic */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-[11px] font-mono text-slate-600 uppercase">
                    Machine Learning Topology
                  </span>
                </div>

                {/* Candidate node */}
                <div className="p-4 rounded-xl bg-brand-50 border border-brand-200 shadow-2xs text-center space-y-1 mb-5">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-600 text-white text-[11px] font-bold">
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Candidate Profile Model</span>
                  </div>
                  <p className="font-bold text-slate-800 text-sm">Engineering Student Baseline</p>
                  <div className="flex items-center justify-center gap-1.5 text-xs text-brand-700 font-mono">
                    <span className="bg-white px-2 py-0.5 rounded border border-brand-200">Skills</span>
                    <span className="bg-white px-2 py-0.5 rounded border border-brand-200">Interests</span>
                    <span className="bg-white px-2 py-0.5 rounded border border-brand-200">Discipline</span>
                    <span className="bg-white px-2 py-0.5 rounded border border-brand-200">Aspirations</span>
                  </div>
                </div>

                {/* Connecting branch visual matches */}
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-white border border-emerald-200 shadow-2xs flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                        94%
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-xs">Software Development</h4>
                        <p className="text-[11px] text-slate-500">Frontend, APIs, Full-Stack Architecture</p>
                      </div>
                    </div>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                      High Overlap
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-brand-200 shadow-2xs flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs">
                        88%
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-xs">Data Analytics & BI</h4>
                        <p className="text-[11px] text-slate-500">SQL, Power BI, Statistics</p>
                      </div>
                    </div>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200 font-medium">
                      Interest Aligned
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-purple-200 shadow-2xs flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                        81%
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-xs">AI & Machine Learning</h4>
                        <p className="text-[11px] text-slate-500">pandas, scikit-learn, Modeling</p>
                      </div>
                    </div>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 font-medium">
                      Growth Runway
                    </span>
                  </div>
                </div>

                {/* Authenticated flow note */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">Personalized to your unique engineering profile</span>
                  <button
                    onClick={onStartAssessment}
                    className="text-brand-600 font-bold hover:text-brand-800 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Get Started</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS SECTION */}
      <section className="py-18 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs uppercase tracking-widest font-extrabold text-brand-600">
              Clear & Systematic Student Journey
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              How CareerCompass AI Works
            </h3>
            <p className="text-slate-600 text-base">
              A transparent, four-step methodology tailored to engineering college students at any academic stage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Tell Us About Yourself',
                desc: 'Select your engineering branch, current study year, existing technical skills with proficiency levels, interests, and work preferences.',
                icon: GraduationCap,
                color: 'from-blue-500 to-brand-600'
              },
              {
                step: '02',
                title: 'Discover Your Career Matches',
                desc: 'Our Random Forest classifier and explainable engine evaluate multi-dimensional compatibility and rank the top three most suitable domains.',
                icon: Target,
                color: 'from-brand-600 to-indigo-600'
              },
              {
                step: '03',
                title: 'Build Your Personalized Roadmap',
                desc: 'Receive an adaptive, phased curriculum identifying skills you already own versus skills to develop, with curated project ideas and tutorials.',
                icon: BookOpen,
                color: 'from-indigo-600 to-accent-teal'
              },
              {
                step: '04',
                title: 'Track Milestones & Portfolio Projects',
                desc: 'Execute recommended project ideas and track your skill development milestones across each learning phase with interactive checklists.',
                icon: Sparkles,
                color: 'from-accent-teal to-emerald-600'
              }
            ].map((s) => (
              <div
                key={s.step}
                className="relative bg-slate-50/80 rounded-2xl p-6 border border-slate-200 hover:border-brand-300 hover:shadow-lg transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-linear-to-tr ${s.color} text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}
                  >
                    <s.icon className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-black font-mono text-slate-300 group-hover:text-brand-500 transition-colors">
                    {s.step}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">{s.title}</h4>
                <p className="text-slate-600 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CAREER DOMAINS SECTION */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-xs uppercase tracking-widest font-extrabold text-brand-600">
                Comprehensive Engineering Catalog
              </span>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
                Explore Career Domains
              </h3>
              <p className="text-slate-600 text-base mt-2 max-w-2xl">
                Covering software, artificial intelligence, silicon semiconductors, robotics, civil infrastructure, and clean energy.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative min-w-[280px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search domain, skill, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:border-brand-500 shadow-2xs"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Domain Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDomains.map((domain) => (
              <div
                key={domain.name}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md hover:border-brand-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-semibold tracking-wide">
                      {domain.category}
                    </span>
                    <button
                      onClick={() => onSelectDomainForModal(domain)}
                      className="text-xs text-brand-600 font-semibold hover:text-brand-800 flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h4 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors mb-2">
                    {domain.name}
                  </h4>

                  <p className="text-slate-600 text-xs leading-relaxed line-clamp-2 mb-4">
                    {domain.description}
                  </p>

                  {/* Relevant skills pills */}
                  <div className="space-y-1.5 mb-4">
                    <span className="text-[11px] uppercase font-bold tracking-wider text-slate-600">
                      Relevant Skills:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {domain.relevantSkills.slice(0, 5).map((s) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 rounded bg-brand-50 text-brand-700 text-[11px] font-medium border border-brand-100"
                        >
                          {s}
                        </span>
                      ))}
                      {domain.relevantSkills.length > 5 && (
                        <span className="px-1.5 py-0.5 text-[10px] text-slate-500 font-mono">
                          +{domain.relevantSkills.length - 5}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Potential roles snippet */}
                  <div className="space-y-1">
                    <span className="text-[11px] uppercase font-bold tracking-wider text-slate-600">
                      Example Roles:
                    </span>
                    <p className="text-xs text-slate-700 line-clamp-1">
                      {domain.potentialRoles.slice(0, 3).join(' • ')}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-600 font-medium">Curated Phased Roadmap</span>
                  <button
                    onClick={() => onSelectDomainForModal(domain)}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-brand-50 hover:text-brand-700 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Explore Domain
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredDomains.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
              <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h4 className="font-bold text-slate-800 text-base">No career domains found</h4>
              <p className="text-xs text-slate-500 mt-1">Try refining your search keyword or selected category filter.</p>
            </div>
          )}
        </div>
      </section>

      {/* 4. WHY CAREERCOMPASS AI SECTION */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs uppercase tracking-widest font-extrabold text-brand-600">
              Built for Engineering Students
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Why CareerCompass AI?
            </h3>
            <p className="text-slate-600 text-base">
              Moving beyond generic advice into explainable, ML-powered career trajectory modeling.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Skill-Based Career Discovery',
                desc: 'Identifies domains aligned with what you can actually do right now, rather than relying strictly on test scores or branch limitations.',
                icon: Code2
              },
              {
                title: 'Personalized Learning Roadmaps',
                desc: 'Generates progressive, milestone-driven phases so beginners start with fundamentals while intermediates skip the basics.',
                icon: BookOpen
              },
              {
                title: 'Clear Skill-Gap Identification',
                desc: 'Pinpoints exactly which libraries, frameworks, or theoretical concepts stand between your current resume and domain mastery.',
                icon: Target
              },
              {
                title: 'Phased Project Milestones',
                desc: 'Realize domain capabilities through industry-aligned capstone ideas, interactive checklists, and curated resources.',
                icon: Sparkles
              },
              {
                title: 'Beginner-Friendly Guidance',
                desc: 'Clear, encouraging explanations without overwhelming jargon, allowing students to assess their skills at their own comfort level.',
                icon: Users
              },
              {
                title: 'Extensible Branch Support',
                desc: 'Built to embrace Computer Science, Electronics, Electrical, Mechanical, Civil, and Chemical disciplines with seamless cross-branch pivots.',
                icon: Layers
              }
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-50/70 border border-slate-200 hover:border-slate-300 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-base mb-2">{item.title}</h4>
                <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Bottom Banner CTA */}
          <div className="mt-16 bg-linear-to-r from-navy-900 via-brand-950 to-navy-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px] opacity-20 pointer-events-none" />
            <div className="relative z-10 max-w-2xl space-y-4">
              <span className="px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-semibold">
                Takes only 3 minutes
              </span>
              <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Ready to find where your engineering skills belong?
              </h3>
              <p className="text-slate-300 text-base">
                Discover your top 3 matching career domains, skill gap analysis, and personalized roadmap steps.
              </p>
              <div className="pt-2">
                <button
                  onClick={onStartAssessment}
                  className="px-8 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-bold text-base shadow-lg shadow-brand-500/30 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Start Career Assessment</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="bg-navy-950 text-slate-400 text-xs border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                  <Compass className="w-4 h-4" />
                </div>
                <span>CareerCompass AI</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Smart career discovery, explainable compatibility matching, and adaptive learning roadmaps for engineering students.
              </p>
            </div>

            <div>
              <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Navigation</h5>
              <ul className="space-y-2">
                <li>
                  <button onClick={onStartAssessment} className="hover:text-white transition-colors cursor-pointer">
                    Start Assessment
                  </button>
                </li>
                <li>
                  <button onClick={onExploreDomains} className="hover:text-white transition-colors cursor-pointer">
                    Explore Career Domains
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Engineering Disciplines</h5>
              <ul className="space-y-2">
                <li><span>Computer & Information Technology</span></li>
                <li><span>Electronics & Communication</span></li>
                <li><span>Electrical & Clean Energy</span></li>
                <li><span>Mechanical, Civil & Chemical</span></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Privacy & Trust</h5>
              <p className="text-slate-400 text-xs leading-relaxed">
                We store individual student profiles securely with encrypted passwords. No sensitive identity tracking or data monetization.
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <p>© {new Date().getFullYear()} CareerCompass AI. All rights reserved.</p>
            <p className="max-w-md text-center sm:text-right">
              Disclaimer: Recommendations represent algorithmic compatibility guidance, not guaranteed employment or professional certifications.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
