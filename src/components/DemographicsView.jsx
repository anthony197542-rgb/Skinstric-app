import React, { useState } from 'react';
import { Sparkles, Check, UserCheck, RefreshCcw } from 'lucide-react';

export default function DemographicsView({ data, userDetails, onRetake }) {
  // Extract AI prediction objects
  const rawRace = data?.race || {};
  const rawAge = data?.age || {};
  const rawGender = data?.gender || {};

  // Sort categories in descending order of confidence score
  const sortDescending = (obj) => {
    return Object.entries(obj)
      .map(([key, value]) => ({
        key,
        value: Number(value) || 0,
        formattedPercent: (Number(value) * 100).toFixed(2) + '%',
      }))
      .sort((a, b) => b.value - a.value);
  };

  const sortedRace = sortDescending(rawRace);
  const sortedAge = sortDescending(rawAge);
  const sortedGender = sortDescending(rawGender);

  // Top predicted defaults
  const defaultTopRace = sortedRace[0]?.key || 'Unknown';
  const defaultTopAge = sortedAge[0]?.key || 'Unknown';
  const defaultTopGender = sortedGender[0]?.key || 'Unknown';

  // Actual User Attributes (initialized with top AI prediction, customizable by user click)
  const [actualRace, setActualRace] = useState(defaultTopRace);
  const [actualAge, setActualAge] = useState(defaultTopAge);
  const [actualGender, setActualGender] = useState(defaultTopGender);

  // Capitalize strings
  const formatLabel = (str) => {
    if (!str) return '';
    return str
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* LEFT SIDEBAR BLOCK: Actual Attributes (Updated interactively when user clicks any score) */}
      <div className="lg:col-span-4 border border-[#222222] bg-[#080808] p-6 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-[#222222]">
          <div className="p-2 border border-[#333333] bg-[#111111] text-white">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-white">VERIFIED ATTRIBUTES</h2>
            <p className="text-[10px] font-mono text-[#666666] uppercase mt-0.5">CLICK ANY VALUE TO OVERRIDE</p>
          </div>
        </div>

        {/* User Card */}
        {userDetails && (
          <div className="p-3 border border-[#1f1f1f] bg-[#0c0c0c] font-mono text-[11px] space-y-1 uppercase">
            <p className="text-white font-bold">{userDetails.name}</p>
            <p className="text-[#666666]">{userDetails.location}</p>
          </div>
        )}

        <div className="space-y-4 font-mono text-xs">
          {/* Race Block */}
          <div className="p-4 border border-[#222222] bg-black">
            <div className="flex items-center justify-between text-[#777777] mb-1">
              <span className="font-bold uppercase text-[10px] tracking-widest">RACE</span>
              {actualRace !== defaultTopRace && (
                <span className="text-[9px] text-white font-bold bg-[#222222] px-2 py-0.5 border border-[#444444] uppercase">
                  USER OVERRIDE
                </span>
              )}
            </div>
            <p className="text-base font-bold text-white uppercase">{formatLabel(actualRace)}</p>
            <p className="text-[10px] text-[#555555] mt-1 uppercase">
              AI PREDICTED: <span className="text-[#999999]">{formatLabel(defaultTopRace)}</span>
            </p>
          </div>

          {/* Age Block */}
          <div className="p-4 border border-[#222222] bg-black">
            <div className="flex items-center justify-between text-[#777777] mb-1">
              <span className="font-bold uppercase text-[10px] tracking-widest">AGE BRACKET</span>
              {actualAge !== defaultTopAge && (
                <span className="text-[9px] text-white font-bold bg-[#222222] px-2 py-0.5 border border-[#444444] uppercase">
                  USER OVERRIDE
                </span>
              )}
            </div>
            <p className="text-base font-bold text-white uppercase">{actualAge} YEARS</p>
            <p className="text-[10px] text-[#555555] mt-1 uppercase">
              AI PREDICTED: <span className="text-[#999999]">{defaultTopAge}</span>
            </p>
          </div>

          {/* Gender Block */}
          <div className="p-4 border border-[#222222] bg-black">
            <div className="flex items-center justify-between text-[#777777] mb-1">
              <span className="font-bold uppercase text-[10px] tracking-widest">GENDER</span>
              {actualGender !== defaultTopGender && (
                <span className="text-[9px] text-white font-bold bg-[#222222] px-2 py-0.5 border border-[#444444] uppercase">
                  USER OVERRIDE
                </span>
              )}
            </div>
            <p className="text-base font-bold text-white uppercase">{formatLabel(actualGender)}</p>
            <p className="text-[10px] text-[#555555] mt-1 uppercase">
              AI PREDICTED: <span className="text-[#999999]">{formatLabel(defaultTopGender)}</span>
            </p>
          </div>
        </div>

        <button
          onClick={onRetake}
          className="w-full py-3 border border-[#222222] font-mono text-[11px] tracking-widest text-[#888888] hover:text-white hover:border-[#444444] transition-all flex items-center justify-center gap-2 uppercase cursor-pointer"
        >
          <RefreshCcw className="w-3.5 h-3.5" />
          TEST ANOTHER PORTRAIT
        </button>
      </div>

      {/* RIGHT MAIN BLOCK: Sorted AI Predicted Demographics (Descending order, 2 Decimal Places) */}
      <div className="lg:col-span-8 space-y-8">
        {/* Race Category */}
        <div className="border border-[#222222] bg-[#080808] p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#222222]">
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-white" />
              01. PREDICTED RACE DISTRIBUTION
            </h3>
            <span className="text-[10px] font-mono text-[#666666] uppercase">DESCENDING</span>
          </div>

          <div className="space-y-3 font-mono">
            {sortedRace.map((item) => {
              const isSelected = actualRace === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setActualRace(item.key)}
                  className={`w-full p-3.5 border text-left transition-all flex items-center justify-between group cursor-pointer ${isSelected
                    ? 'border-white bg-[#151515] text-white'
                    : 'border-[#1a1a1a] bg-black text-[#777777] hover:border-[#333333] hover:text-white'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3.5 h-3.5 flex items-center justify-center border text-[9px] ${isSelected
                        ? 'border-white bg-white text-black'
                        : 'border-[#333333] group-hover:border-white'
                        }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider">{formatLabel(item.key)}</span>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Progress bar */}
                    <div className="w-24 sm:w-40 h-1.5 bg-[#1a1a1a] overflow-hidden">
                      <div
                        className="h-full bg-white transition-all duration-500"
                        style={{ width: item.formattedPercent }}
                      />
                    </div>
                    <span className="text-xs font-bold w-16 text-right text-white">
                      {item.formattedPercent}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Age Category */}
        <div className="border border-[#222222] bg-[#080808] p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#222222]">
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-white" />
              02. PREDICTED AGE BRACKET
            </h3>
            <span className="text-[10px] font-mono text-[#666666] uppercase">DESCENDING</span>
          </div>

          <div className="space-y-3 font-mono">
            {sortedAge.map((item) => {
              const isSelected = actualAge === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setActualAge(item.key)}
                  className={`w-full p-3.5 border text-left transition-all flex items-center justify-between group cursor-pointer ${isSelected
                    ? 'border-white bg-[#151515] text-white'
                    : 'border-[#1a1a1a] bg-black text-[#777777] hover:border-[#333333] hover:text-white'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3.5 h-3.5 flex items-center justify-center border text-[9px] ${isSelected
                        ? 'border-white bg-white text-black'
                        : 'border-[#333333] group-hover:border-white'
                        }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider">{item.key} YEARS</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-24 sm:w-40 h-1.5 bg-[#1a1a1a] overflow-hidden">
                      <div
                        className="h-full bg-white transition-all duration-500"
                        style={{ width: item.formattedPercent }}
                      />
                    </div>
                    <span className="text-xs font-bold w-16 text-right text-white">
                      {item.formattedPercent}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Gender Category */}
        <div className="border border-[#222222] bg-[#080808] p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#222222]">
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-white" />
              03. PREDICTED GENDER
            </h3>
            <span className="text-[10px] font-mono text-[#666666] uppercase">DESCENDING</span>
          </div>

          <div className="space-y-3 font-mono">
            {sortedGender.map((item) => {
              const isSelected = actualGender === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setActualGender(item.key)}
                  className={`w-full p-3.5 border text-left transition-all flex items-center justify-between group cursor-pointer ${isSelected
                    ? 'border-white bg-[#151515] text-white'
                    : 'border-[#1a1a1a] bg-black text-[#777777] hover:border-[#333333] hover:text-white'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3.5 h-3.5 flex items-center justify-center border text-[9px] ${isSelected
                        ? 'border-white bg-white text-black'
                        : 'border-[#333333] group-hover:border-white'
                        }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider">{formatLabel(item.key)}</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-24 sm:w-40 h-1.5 bg-[#1a1a1a] overflow-hidden">
                      <div
                        className="h-full bg-white transition-all duration-500"
                        style={{ width: item.formattedPercent }}
                      />
                    </div>
                    <span className="text-xs font-bold w-16 text-right text-white">
                      {item.formattedPercent}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
