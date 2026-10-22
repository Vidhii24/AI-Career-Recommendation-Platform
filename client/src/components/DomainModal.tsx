import React from 'react';
import { X, BookOpen, CheckCircle2, ExternalLink, ArrowRight } from 'lucide-react';
import { CareerDomainCatalogItem } from '../types';

interface DomainModalProps {
  domain: CareerDomainCatalogItem | null;
  onClose: () => void;
  onStartAssessmentWithDomain: (domainName: string) => void;
}

export const DomainModal: React.FC<DomainModalProps> = ({
  domain,
  onClose,
  onStartAssessmentWithDomain
}) => {
  if (!domain) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 sm:p-7 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-100">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-semibold text-brand-700 uppercase tracking-wide">
              {domain.category}
            </span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
              {domain.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Overview */}
        <div className="space-y-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Domain Overview</h3>
          <p className="text-xs text-slate-600 leading-relaxed">{domain.description}</p>
        </div>

        {/* Required & Recommended Skills */}
        <div className="space-y-1.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Relevant & Core Technical Skills
          </h3>
          <div className="flex flex-wrap gap-1">
            {domain.relevantSkills.map((s) => (
              <span
                key={s}
                className="px-2 py-0.5 rounded bg-slate-50 text-slate-700 border border-slate-200 text-xs font-medium"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Potential Roles */}
        <div className="space-y-1.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Example Roles & Designations
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {domain.potentialRoles.map((role) => (
              <span
                key={role}
                className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-medium"
              >
                {role}
              </span>
            ))}
          </div>
        </div>

        {/* Roadmap Summary */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1 text-xs">
          <h3 className="font-bold text-slate-700 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-brand-600" />
            <span>Phased Learning Summary</span>
          </h3>
          <p className="text-slate-600 leading-relaxed">
            {domain.roadmapSummary}
          </p>
        </div>

        {/* Portfolio Projects */}
        <div className="space-y-1.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Demonstration Portfolio Projects
          </h3>
          <ul className="text-xs text-slate-600 space-y-1">
            {domain.projectIdeas.map((idea, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{idea}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-2.5">
          <button
            onClick={() => {
              onClose();
              onStartAssessmentWithDomain(domain.name);
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <span>Assess Fit For This Domain</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
