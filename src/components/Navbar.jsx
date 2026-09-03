import React from 'react';
import { User, MapPin, Check } from 'lucide-react';

export default function Navbar({ currentPhase, userDetails, onReset }) {
  const steps = [
    { id: 1, label: '01. INPUT DATA' },
    { id: 2, label: '02. UPLOAD' },
    { id: 3, label: '03. CAMERA' },
  ];

  return (
    <header className="border-b border-[#222222] bg-black/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Minimalist Logo */}
        <div
          onClick={onReset}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-8 h-8 bg-white text-black font-black text-sm flex items-center justify-center tracking-tighter">
            SK
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-[0.2em] text-white uppercase leading-none">SKINSTRIC</span>
            <span className="text-[10px] font-mono tracking-widest text-[#777777] uppercase mt-1">AI DEMOGRAPHICS</span>
          </div>
        </div>

        {/* Minimal Stepper Navigation */}
        <nav aria-label="Progress Steps" className="flex items-center gap-1 sm:gap-3">
          {steps.map((step) => {
            const isActive = currentPhase === step.id;
            const isCompleted = currentPhase > step.id;

            return (
              <div key={step.id} className="flex items-center gap-2">
                <div
                  className={`px-3 py-1.5 border text-[11px] font-mono tracking-wider uppercase transition-all ${isActive
                      ? 'border-white bg-white text-black font-bold'
                      : isCompleted
                        ? 'border-[#333333] bg-[#111111] text-white'
                        : 'border-[#1f1f1f] bg-transparent text-[#555555]'
                    }`}
                >
                  <span className="flex items-center gap-1.5">
                    {isCompleted && <Check className="w-3 h-3 stroke-[3]" />}
                    {step.label}
                  </span>
                </div>
                {step.id < steps.length && (
                  <div className="w-2 sm:w-4 h-[1px] bg-[#222222]" />
                )}
              </div>
            );
          })}
        </nav>

        {/* User Info Badge */}
        {userDetails ? (
          <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 border border-[#222222] bg-[#0d0d0d] font-mono text-[11px] tracking-wider text-[#aaaaaa]">
            <div className="flex items-center gap-1.5 text-white">
              <User className="w-3 h-3 text-[#888888]" />
              <span className="uppercase">{userDetails.name}</span>
            </div>
            <span className="text-[#333333]">/</span>
            <div className="flex items-center gap-1.5 text-[#aaaaaa]">
              <MapPin className="w-3 h-3 text-[#888888]" />
              <span className="uppercase">{userDetails.location}</span>
            </div>
          </div>
        ) : (
          <div className="hidden lg:block w-32" />
        )}
      </div>
    </header>
  );
}
