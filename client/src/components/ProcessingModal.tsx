import React, { useEffect, useState } from 'react';
import { Compass, Sparkles, CheckCircle2, ShieldCheck, Cpu, Code2 } from 'lucide-react';

interface ProcessingModalProps {
  onComplete: () => void;
}

export const ProcessingModal: React.FC<ProcessingModalProps> = ({ onComplete }) => {
  const steps = [
    { text: 'Parsing existing technical skills and proficiency tiers...', icon: Code2 },
    { text: 'Evaluating branch synergy and cross-disciplinary potential...', icon: Cpu },
    { text: 'Analyzing work preferences against daily engineering workflows...', icon: Sparkles },
    { text: 'Executing Scikit-Learn RandomForestClassifier across 11 domain estimators...', icon: Compass },
    { text: 'Synthesizing adaptive phased roadmap and verified opportunities...', icon: ShieldCheck }
  ];

  const [activeStepIndex, setActiveStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStepIndex((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(onComplete, 600);
          return prev;
        }
      });
    }, 550);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-8 sm:p-10 max-w-md w-full shadow-2xl border border-slate-200 text-center space-y-6">
        <div className="relative mx-auto w-20 h-20">
          <div className="absolute inset-0 rounded-2xl bg-brand-500/20 animate-ping" />
          <div className="relative w-20 h-20 rounded-2xl bg-linear-to-tr from-brand-600 to-accent-teal flex items-center justify-center text-white shadow-xl">
            <Compass className="w-10 h-10 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
        </div>

        <div>
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Analyzing Your Profile
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Running explainable recommendation algorithms across 13 engineering domains.
          </p>
        </div>

        <div className="space-y-3 text-left">
          {steps.map((s, idx) => {
            const isDone = idx < activeStepIndex;
            const isCurrent = idx === activeStepIndex;
            return (
              <div
                key={idx}
                className={`p-3 rounded-xl border transition-all flex items-center gap-3 text-xs ${
                  isCurrent
                    ? 'bg-brand-50 border-brand-300 text-brand-900 font-bold shadow-2xs'
                    : isDone
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-800 font-medium'
                    : 'bg-slate-50 border-slate-100 text-slate-400 opacity-60'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : isCurrent ? (
                  <s.icon className="w-4 h-4 text-brand-600 shrink-0 animate-pulse" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                )}
                <span>{s.text}</span>
              </div>
            );
          })}
        </div>

        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-brand-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${((activeStepIndex + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
