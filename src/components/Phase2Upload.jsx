import React, { useState } from 'react';
import { UploadCloud, Image as ImageIcon, Loader2, AlertCircle, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { submitPhaseTwo } from '../api/skinstric.js';
import DemographicsView from './DemographicsView.jsx';

export default function Phase2Upload({ onNext, onBack, userDetails }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [base64String, setBase64String] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [demographicsData, setDemographicsData] = useState(null);

  const processFile = (selectedFile) => {
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith('image/')) {
      setApiError('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }

    setApiError('');
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      setPreview(result);
      setBase64String(result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    processFile(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleSubmit = async () => {
    if (!base64String) return;

    setLoading(true);
    setApiError('');

    try {
      const res = await submitPhaseTwo(base64String);
      if (res && res.data) {
        setDemographicsData(res.data);
      } else {
        throw new Error('Invalid API response shape.');
      }
    } catch (err) {
      setApiError(err.message || 'Error uploading Base64 image to Level 2 API.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetImage = () => {
    setFile(null);
    setPreview(null);
    setBase64String(null);
    setDemographicsData(null);
    setApiError('');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            Phase 2 • Level 2
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-3 mb-1 tracking-tight">
            Upload Your Face Image
          </h1>
          <p className="text-sm text-[#9ca3af]">
            Convert image to Base64 and run AI demographics prediction (Race, Age, Gender).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2.5 rounded-xl border border-[#232938] text-xs font-semibold text-[#9ca3af] hover:text-white hover:bg-[#181c29] transition-all flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Phase 1
          </button>
          <button
            type="button"
            onClick={onNext}
            className="px-4 py-2.5 rounded-xl bg-purple-600/20 border border-purple-500/40 text-purple-300 hover:bg-purple-600/30 text-xs font-semibold transition-all flex items-center gap-2"
          >
            Phase 3: Take Selfie
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Container */}
      {!demographicsData ? (
        <div className="bg-[#12151f] border border-[#1e2330] rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="max-w-xl mx-auto space-y-6">
            {/* Drag & Drop Box */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all flex flex-col items-center justify-center min-h-[260px] cursor-pointer relative overflow-hidden ${preview
                  ? 'border-indigo-500/50 bg-[#0d0f17]'
                  : 'border-[#232938] hover:border-indigo-500/40 bg-[#0d0f17]/60 hover:bg-[#0d0f17]'
                }`}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
              />

              {preview ? (
                <div className="space-y-4">
                  <img
                    src={preview}
                    alt="Uploaded Preview"
                    className="w-40 h-40 object-cover rounded-2xl mx-auto shadow-xl border-2 border-indigo-500/30"
                  />
                  <div>
                    <p className="text-xs font-semibold text-indigo-300">{file?.name}</p>
                    <p className="text-[11px] text-[#6b7280]">Click or drag to replace image</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mx-auto">
                    <UploadCloud className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white mb-1">
                      Drag & Drop your face photo here
                    </p>
                    <p className="text-xs text-[#9ca3af]">
                      or <span className="text-indigo-400 font-semibold underline">browse files</span> from your computer
                    </p>
                  </div>
                  <p className="text-[11px] text-[#6b7280]">Supports PNG, JPG, WEBP formats</p>
                </div>
              )}
            </div>

            {apiError && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{apiError}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              {preview && (
                <button
                  type="button"
                  onClick={handleResetImage}
                  className="px-4 py-2.5 rounded-xl border border-[#232938] text-xs font-semibold text-[#9ca3af] hover:text-white hover:bg-[#181c29] transition-all"
                >
                  Clear Image
                </button>
              )}

              <button
                type="button"
                onClick={handleSubmit}
                disabled={!base64String || loading}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Scanning Demographics...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Analyze Image (Level 2 API)
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <DemographicsView
          data={demographicsData}
          userDetails={userDetails}
          onRetake={handleResetImage}
        />
      )}
    </div>
  );
}
