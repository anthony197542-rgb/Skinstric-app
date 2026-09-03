import React from 'react';
import { Sparkles, User, MapPin, CheckCircle2 } from 'lucide-react';

export default function Navbar({ currentPhase, userDetails, onReset }) {
  const steps = [
    { id: 1, label: 'User Info', phase: 'Phase 1' },
    { id: 2, label: 'Upload Image', phase: 'Phase 2' },
    { id: 3, label: 'Take Selfie', phase: 'Phase 3' },
  ];

  return (
    <header className="border-b border-[#1e2330] bg-[#0b0c10]/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Logo */}
        <div
          onClick={onReset}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-white">SKINSTRIC</span>
            <span className="text-xs ml-2 px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-semibold border border-indigo-500/20">
              AI DEMOGRAPHICS
            </span>
          </div>
        </div>

        {/* Steps */}
        <nav aria-label="Progress Steps" className="flex items-center gap-2 sm:gap-4">
          {steps.map((step) => {
            const isActive = currentPhase === step.id;
            const isCompleted = currentPhase > step.id;

            return (
              <div key={step.id} className="flex items-center gap-2">
                <div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${isActive
                      ? 'bg-indigo-600/15 border-indigo-500 text-indigo-300 shadow-sm shadow-indigo-500/20'
                      : isCompleted
                        ? 'bg-[#151922] border-emerald-500/30 text-emerald-400'
                        : 'bg-[#12151f] border-[#1e2330] text-[#6b7280]'
                    }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${isActive
                        ? 'bg-indigo-500 text-white'
                        : isCompleted
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-[#1e2330] text-[#9ca3af]'
                      }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : step.id}
                  </span>
                  <span className="hidden md:inline">{step.label}</span>
                </div>
                {step.id < steps.length && (
                  <div className="w-4 sm:w-8 h-[1px] bg-[#1e2330]" />
                )}
              </div>
            );
          })}
        </nav>

        {/* Saved User Badge */}
        {userDetails && (
          <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-[#141722] border border-[#232938] text-xs">
            <div className="flex items-center gap-1.5 text-slate-300 font-medium">
              <User className="w-3.5 h-3.5 text-indigo-400" />
              <span>{userDetails.name}</span>
            </div>
            <span className="text-[#3b4254]">|</span>
            <div className="flex items-center gap-1.5 text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-purple-400" />
              <span>{userDetails.location}</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
