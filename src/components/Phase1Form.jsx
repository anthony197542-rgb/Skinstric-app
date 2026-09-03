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
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
      <div className="bg-[#12151f] border border-[#1e2330] rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="mb-8 text-center sm:text-left">
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            Phase 1 • Level 1
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-3 mb-2 tracking-tight">
            Customer Information
          </h1>
          <p className="text-sm text-[#9ca3af]">
            Please enter your name and location to initialize your skin analysis profile.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-xs font-bold uppercase text-[#9ca3af] mb-2 tracking-wider">
              Full Name <span className="text-indigo-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6b7280]">
                <User className="w-5 h-5" />
              </div>
              <input
                id="name"
                type="text"
                value={name}
                onChange={handleNameChange}
                placeholder="e.g. John Doe"
                className={`w-full pl-11 pr-4 py-3 bg-[#0d0f17] border rounded-xl text-white text-sm placeholder-[#4b5563] focus:outline-none transition-all ${nameError
                    ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                    : 'border-[#232938] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                  }`}
              />
            </div>
            {nameError && (
              <p className="flex items-center gap-1.5 text-xs text-rose-400 mt-2 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {nameError}
              </p>
            )}
          </div>

          {/* Location Field */}
          <div>
            <label htmlFor="location" className="block text-xs font-bold uppercase text-[#9ca3af] mb-2 tracking-wider">
              Location <span className="text-indigo-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6b7280]">
                <MapPin className="w-5 h-5" />
              </div>
              <input
                id="location"
                type="text"
                value={location}
                onChange={handleLocationChange}
                placeholder="e.g. New York"
                className={`w-full pl-11 pr-4 py-3 bg-[#0d0f17] border rounded-xl text-white text-sm placeholder-[#4b5563] focus:outline-none transition-all ${locationError
                    ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                    : 'border-[#232938] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                  }`}
              />
            </div>
            {locationError && (
              <p className="flex items-center gap-1.5 text-xs text-rose-400 mt-2 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {locationError}
              </p>
            )}
          </div>

          {/* API Error Box */}
          {apiError && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{apiError}</span>
            </div>
          )}

          {/* API Success Box */}
          {apiResponse && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-emerald-200 mb-0.5">Success Response:</p>
                <p className="font-mono text-emerald-300">{apiResponse.SUCCUSS || JSON.stringify(apiResponse)}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="pt-4 border-t border-[#1e2330] flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                setName('');
                setLocation('');
                setNameError('');
                setLocationError('');
                setApiResponse(null);
              }}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-[#232938] text-xs font-semibold text-[#9ca3af] hover:text-white hover:bg-[#181c29] transition-all flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Clear Form
            </button>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {!apiResponse ? (
                <button
                  type="submit"
                  disabled={!isFormValid || loading}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      Submit Details
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onNext}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
                >
                  Proceed to Phase 2
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
