import React, { useState } from 'react';
import { Search, ChevronRight, BookOpen, Layers } from 'lucide-react';
import { CareerDomainCatalogItem } from '../types';

interface DomainExplorerProps {
  domains: CareerDomainCatalogItem[];
  onSelectDomain: (domain: CareerDomainCatalogItem) => void;
  onStartAssessment?: () => void;
}

export const DomainExplorer: React.FC<DomainExplorerProps> = ({
  domains,
  onSelectDomain
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

  const filtered = domains.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.relevantSkills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
      d.potentialRoles.some((r) => r.toLowerCase().includes(searchTerm.toLowerCase()));

    if (activeCategory === 'All') return matchesSearch;
    return matchesSearch && d.category.toLowerCase().includes(activeCategory.toLowerCase().split(' ')[0]);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header and Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Explore Career Domains
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Browse structured engineering domains, required core skill sets, and entry-level career roles.
          </p>
        </div>

        {/* Search */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search domain, skill, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:border-brand-500 shadow-2xs"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-1.5 pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeCategory === cat
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Domain Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((d) => (
          <div
            key={d.name}
            onClick={() => onSelectDomain(d)}
            className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all flex flex-col justify-between group cursor-pointer"
          >
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                  {d.category}
                </span>
                <span className="text-xs text-brand-600 font-semibold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                  Details <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition-colors mb-1.5">
                {d.name}
              </h3>

              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                {d.description}
              </p>

              {/* Core Skills */}
              <div className="space-y-1 mb-3.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  Important Skills
                </span>
                <div className="flex flex-wrap gap-1">
                  {d.relevantSkills.slice(0, 4).map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded bg-slate-50 text-slate-700 border border-slate-100 text-[11px] font-medium"
                    >
                      {s}
                    </span>
                  ))}
                  {d.relevantSkills.length > 4 && (
                    <span className="text-[10px] text-slate-400 font-mono self-center">
                      +{d.relevantSkills.length - 4}
                    </span>
                  )}
                </div>
              </div>

              {/* Roles */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  Example Roles
                </span>
                <p className="text-xs text-slate-600 line-clamp-1">{d.potentialRoles.slice(0, 3).join(' · ')}</p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400">Curated Roadmap</span>
              <button
                type="button"
                className="px-3 py-1 rounded-lg bg-slate-50 group-hover:bg-brand-50 group-hover:text-brand-700 text-slate-700 text-xs font-semibold transition-colors"
              >
                Explore
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
          <p className="text-xs font-semibold text-slate-700">No career domains found</p>
          <p className="text-xs text-slate-400 mt-1">Try refining your search keyword or selected category filter.</p>
        </div>
      )}
    </div>
  );
};
