import React, { useState } from 'react';
import { ShieldCheck, Sparkles, Check, Edit3, UserCheck, RefreshCcw } from 'lucide-react';

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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* LEFT SIDEBAR BLOCK: Actual Attributes (Updated interactively when user clicks any score) */}
      <div className="lg:col-span-4 bg-[#12151f] border border-[#1e2330] rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[#1e2330]">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Verified Attributes</h2>
            <p className="text-xs text-[#9ca3af]">Click any score on the right to override</p>
          </div>
        </div>

        {/* User Card */}
        {userDetails && (
          <div className="mb-6 p-3.5 rounded-xl bg-[#0d0f17] border border-[#1e2330] text-xs space-y-1">
            <p className="text-indigo-400 font-bold">{userDetails.name}</p>
            <p className="text-[#6b7280]">{userDetails.location}</p>
          </div>
        )}

        <div className="space-y-4 text-xs">
          {/* Race Block */}
          <div className="p-4 rounded-xl bg-[#0d0f17] border border-[#1e2330]">
            <div className="flex items-center justify-between text-[#9ca3af] mb-1">
              <span className="font-semibold uppercase text-[10px] tracking-wider">Demographic Race</span>
              {actualRace !== defaultTopRace && (
                <span className="text-[10px] text-amber-400 font-bold bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                  User Corrected
                </span>
              )}
            </div>
            <p className="text-lg font-extrabold text-white capitalize">{formatLabel(actualRace)}</p>
            <p className="text-[11px] text-[#6b7280] mt-1">
              AI Predicted: <span className="text-indigo-300 font-medium">{formatLabel(defaultTopRace)}</span>
            </p>
          </div>

          {/* Age Block */}
          <div className="p-4 rounded-xl bg-[#0d0f17] border border-[#1e2330]">
            <div className="flex items-center justify-between text-[#9ca3af] mb-1">
              <span className="font-semibold uppercase text-[10px] tracking-wider">Age Group</span>
              {actualAge !== defaultTopAge && (
                <span className="text-[10px] text-amber-400 font-bold bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                  User Corrected
                </span>
              )}
            </div>
            <p className="text-lg font-extrabold text-white">{actualAge} years</p>
            <p className="text-[11px] text-[#6b7280] mt-1">
              AI Predicted: <span className="text-indigo-300 font-medium">{defaultTopAge}</span>
            </p>
          </div>

          {/* Gender Block */}
          <div className="p-4 rounded-xl bg-[#0d0f17] border border-[#1e2330]">
            <div className="flex items-center justify-between text-[#9ca3af] mb-1">
              <span className="font-semibold uppercase text-[10px] tracking-wider">Gender</span>
              {actualGender !== defaultTopGender && (
                <span className="text-[10px] text-amber-400 font-bold bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                  User Corrected
                </span>
              )}
            </div>
            <p className="text-lg font-extrabold text-white capitalize">{formatLabel(actualGender)}</p>
            <p className="text-[11px] text-[#6b7280] mt-1">
              AI Predicted: <span className="text-indigo-300 font-medium">{formatLabel(defaultTopGender)}</span>
            </p>
          </div>
        </div>

        <button
          onClick={onRetake}
          className="w-full mt-6 py-2.5 rounded-xl border border-[#232938] text-xs font-semibold text-[#9ca3af] hover:text-white hover:bg-[#181c29] transition-all flex items-center justify-center gap-2"
        >
          <RefreshCcw className="w-3.5 h-3.5" />
          Test Another Image
        </button>
      </div>

      {/* RIGHT MAIN BLOCK: Sorted AI Predicted Demographics (Descending order, 2 Decimal Places) */}
      <div className="lg:col-span-8 space-y-6">
        {/* Race Category */}
        <div className="bg-[#12151f] border border-[#1e2330] rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#1e2330]">
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Predicted Race Distribution
            </h3>
            <span className="text-[11px] text-[#6b7280] font-medium">Sorted Descending</span>
          </div>

          <div className="space-y-2.5">
            {sortedRace.map((item) => {
              const isSelected = actualRace === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setActualRace(item.key)}
                  className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between group cursor-pointer ${isSelected
                      ? 'bg-indigo-600/15 border-indigo-500/80 text-white shadow-sm shadow-indigo-500/20'
                      : 'bg-[#0d0f17] border-[#1e2330] text-[#9ca3af] hover:border-[#2d3448] hover:text-white'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center border text-[10px] ${isSelected
                          ? 'bg-indigo-500 border-indigo-400 text-white'
                          : 'border-[#374151] group-hover:border-indigo-400'
                        }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className="text-xs font-semibold capitalize">{formatLabel(item.key)}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Progress bar */}
                    <div className="w-24 sm:w-36 h-2 rounded-full bg-[#1b1f2b] overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                        style={{ width: item.formattedPercent }}
                      />
                    </div>
                    <span className="text-xs font-mono font-bold w-16 text-right text-indigo-300">
                      {item.formattedPercent}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Age Category */}
        <div className="bg-[#12151f] border border-[#1e2330] rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#1e2330]">
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              Predicted Age Bracket
            </h3>
            <span className="text-[11px] text-[#6b7280] font-medium">Sorted Descending</span>
          </div>

          <div className="space-y-2.5">
            {sortedAge.map((item) => {
              const isSelected = actualAge === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setActualAge(item.key)}
                  className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between group cursor-pointer ${isSelected
                      ? 'bg-purple-600/15 border-purple-500/80 text-white shadow-sm shadow-purple-500/20'
                      : 'bg-[#0d0f17] border-[#1e2330] text-[#9ca3af] hover:border-[#2d3448] hover:text-white'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center border text-[10px] ${isSelected
                          ? 'bg-purple-500 border-purple-400 text-white'
                          : 'border-[#374151] group-hover:border-purple-400'
                        }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className="text-xs font-semibold">{item.key} years</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-24 sm:w-36 h-2 rounded-full bg-[#1b1f2b] overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-500"
                        style={{ width: item.formattedPercent }}
                      />
                    </div>
                    <span className="text-xs font-mono font-bold w-16 text-right text-purple-300">
                      {item.formattedPercent}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Gender Category */}
        <div className="bg-[#12151f] border border-[#1e2330] rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#1e2330]">
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Predicted Gender
            </h3>
            <span className="text-[11px] text-[#6b7280] font-medium">Sorted Descending</span>
          </div>

          <div className="space-y-2.5">
            {sortedGender.map((item) => {
              const isSelected = actualGender === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setActualGender(item.key)}
                  className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between group cursor-pointer ${isSelected
                      ? 'bg-emerald-600/15 border-emerald-500/80 text-white shadow-sm shadow-emerald-500/20'
                      : 'bg-[#0d0f17] border-[#1e2330] text-[#9ca3af] hover:border-[#2d3448] hover:text-white'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center border text-[10px] ${isSelected
                          ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                          : 'border-[#374151] group-hover:border-emerald-400'
                        }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className="text-xs font-semibold capitalize">{formatLabel(item.key)}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-24 sm:w-36 h-2 rounded-full bg-[#1b1f2b] overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                        style={{ width: item.formattedPercent }}
                      />
                    </div>
                    <span className="text-xs font-mono font-bold w-16 text-right text-emerald-300">
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
