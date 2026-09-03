import React, { useState, useEffect } from 'react';
import { User, MapPin, ArrowRight, AlertCircle, CheckCircle2, Loader2, RefreshCw } from 'lucide-react';
import { submitPhaseOne } from '../api/skinstric.js';

export default function Phase1Form({ onNext, onSaveUser, initialUser }) {
  const [name, setName] = useState(initialUser?.name || '');
  const [location, setLocation] = useState(initialUser?.location || '');
  const [nameError, setNameError] = useState('');
  const [locationError, setLocationError] = useState('');
  const [apiResponse, setApiResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  // Regex to validate strings (letters, spaces, hyphens, apostrophes only; no numbers or special chars)
  const isValidString = (val) => {
    if (!val || val.trim() === '') return false;
    // Disallow numbers and weird symbols
    const nameRegex = /^[a-zA-Z\s'-]+$/;
    return nameRegex.test(val.trim());
  };

  const validateName = (val) => {
    if (!val.trim()) {
      setNameError('Name is required');
      return false;
    }
    if (/\d/.test(val)) {
      setNameError('Name cannot contain numbers');
      return false;
    }
    if (!isValidString(val)) {
      setNameError('Name contains invalid characters (letters only)');
      return false;
    }
    setNameError('');
    return true;
  };

  const validateLocation = (val) => {
    if (!val.trim()) {
      setLocationError('Location is required');
      return false;
    }
    if (/\d/.test(val)) {
      setLocationError('Location cannot contain numbers');
      return false;
    }
    if (!isValidString(val)) {
      setLocationError('Location contains invalid characters (letters only)');
      return false;
    }
    setLocationError('');
    return true;
  };

  const handleNameChange = (e) => {
    const val = e.target.value;
    setName(val);
    if (val) validateName(val);
    else setNameError('');
  };

  const handleLocationChange = (e) => {
    const val = e.target.value;
    setLocation(val);
    if (val) validateLocation(val);
    else setLocationError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isNameValid = validateName(name);
    const isLocValid = validateLocation(location);

    if (!isNameValid || !isLocValid) return;

    setLoading(true);
    setApiError('');
    setApiResponse(null);

    try {
      const res = await submitPhaseOne(name.trim(), location.trim());
      setApiResponse(res);

      const userData = { name: name.trim(), location: location.trim() };
      localStorage.setItem('skinstric_user', JSON.stringify(userData));
      onSaveUser(userData);
    } catch (err) {
      setApiError(err.message || 'Error submitting data to Level 1 API.');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    name.trim() &&
    location.trim() &&
    !nameError &&
    !locationError &&
    isValidString(name) &&
    isValidString(location);

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="border border-[#222222] bg-[#080808] p-8 sm:p-12 relative">
        <div className="mb-10 text-left">
          <div className="inline-block px-2.5 py-1 bg-[#151515] border border-[#282828] text-[10px] font-mono tracking-[0.2em] text-[#888888] uppercase mb-4">
            LEVEL 1 • INITIAL SETUP
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight uppercase">
            Customer Profile
          </h1>
          <p className="text-xs font-mono text-[#777777] mt-2 tracking-wide uppercase">
            Input personal details to generate AI demographics profile
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-[11px] font-mono font-bold uppercase tracking-widest text-[#888888] mb-3">
              01. FULL NAME <span className="text-white">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#555555]">
                <User className="w-4 h-4" />
              </div>
              <input
                id="name"
                type="text"
                value={name}
                onChange={handleNameChange}
                placeholder="ENTER YOUR FULL NAME"
                className={`w-full pl-11 pr-4 py-4 bg-black border text-white font-mono text-xs tracking-wider placeholder-[#444444] focus:outline-none transition-all uppercase ${nameError
                    ? 'border-red-500/80 focus:border-red-500'
                    : 'border-[#222222] focus:border-white'
                  }`}
              />
            </div>
            {nameError && (
              <p className="flex items-center gap-1.5 text-[11px] font-mono text-red-400 mt-2 uppercase tracking-wide">
                <AlertCircle className="w-3.5 h-3.5" />
                {nameError}
              </p>
            )}
          </div>

          {/* Location Field */}
          <div>
            <label htmlFor="location" className="block text-[11px] font-mono font-bold uppercase tracking-widest text-[#888888] mb-3">
              02. LOCATION / CITY <span className="text-white">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#555555]">
                <MapPin className="w-4 h-4" />
              </div>
              <input
                id="location"
                type="text"
                value={location}
                onChange={handleLocationChange}
                placeholder="ENTER YOUR LOCATION"
                className={`w-full pl-11 pr-4 py-4 bg-black border text-white font-mono text-xs tracking-wider placeholder-[#444444] focus:outline-none transition-all uppercase ${locationError
                    ? 'border-red-500/80 focus:border-red-500'
                    : 'border-[#222222] focus:border-white'
                  }`}
              />
            </div>
            {locationError && (
              <p className="flex items-center gap-1.5 text-[11px] font-mono text-red-400 mt-2 uppercase tracking-wide">
                <AlertCircle className="w-3.5 h-3.5" />
                {locationError}
              </p>
            )}
          </div>

          {/* API Error Box */}
          {apiError && (
            <div className="p-4 border border-red-500/40 bg-red-950/20 text-red-400 font-mono text-xs flex items-start gap-3 uppercase">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{apiError}</span>
            </div>
          )}

          {/* API Success Box */}
          {apiResponse && (
            <div className="p-4 border border-[#333333] bg-[#111111] text-white font-mono text-xs flex items-start gap-3 uppercase">
              <Check className="w-4 h-4 text-white shrink-0 mt-0.5 stroke-[3]" />
              <div>
                <p className="font-bold text-white mb-1">STATUS: SUCCESS</p>
                <p className="text-[#888888]">{apiResponse.SUCCUSS || JSON.stringify(apiResponse)}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="pt-6 border-t border-[#1e1e1e] flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => {
                setName('');
                setLocation('');
                setNameError('');
                setLocationError('');
                setApiResponse(null);
              }}
              className="w-full sm:w-auto px-5 py-3 border border-[#222222] text-[11px] font-mono tracking-widest text-[#777777] hover:text-white hover:border-[#444444] transition-all flex items-center justify-center gap-2 uppercase cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {!apiResponse ? (
                <button
                  type="submit"
                  disabled={!isFormValid || loading}
                  className="w-full sm:w-auto px-8 py-4 bg-white text-black hover:bg-[#e0e0e0] disabled:bg-[#222222] disabled:text-[#555555] disabled:cursor-not-allowed text-xs font-mono font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-3 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      PROCESSING...
                    </>
                  ) : (
                    <>
                      SUBMIT DATA
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onNext}
                  className="w-full sm:w-auto px-8 py-4 bg-white text-black hover:bg-[#e0e0e0] text-xs font-mono font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-3 cursor-pointer"
                >
                  PROCEED TO LEVEL 2
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
