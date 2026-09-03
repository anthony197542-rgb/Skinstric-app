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
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-block px-2.5 py-1 bg-[#151515] border border-[#282828] text-[10px] font-mono tracking-[0.2em] text-[#888888] uppercase mb-2">
            LEVEL 2 • FILE SCAN
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight uppercase">
            Upload Portrait
          </h1>
          <p className="text-xs font-mono text-[#777777] mt-1 tracking-wide uppercase">
            Convert image to Base64 and run AI demographics analysis
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2.5 border border-[#222222] text-[11px] font-mono tracking-widest text-[#777777] hover:text-white hover:border-[#444444] transition-all flex items-center gap-2 uppercase cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Phase 1
          </button>
          <button
            type="button"
            onClick={onNext}
            className="px-4 py-2.5 border border-white/20 bg-white/5 text-white hover:bg-white/10 text-[11px] font-mono tracking-widest transition-all flex items-center gap-2 uppercase cursor-pointer"
          >
            Phase 3: Camera
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Container */}
      {!demographicsData ? (
        <div className="border border-[#222222] bg-[#080808] p-8 sm:p-12">
          <div className="max-w-xl mx-auto space-y-8">
            {/* Drag & Drop Box */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className={`border border-dashed p-10 text-center transition-all flex flex-col items-center justify-center min-h-[280px] cursor-pointer relative ${preview
                  ? 'border-white bg-black'
                  : 'border-[#282828] hover:border-[#555555] bg-black/60'
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
                    className="w-44 h-44 object-cover border border-[#333333] mx-auto grayscale hover:grayscale-0 transition-all"
                  />
                  <div>
                    <p className="text-xs font-mono text-white tracking-wider uppercase">{file?.name}</p>
                    <p className="text-[10px] font-mono text-[#666666] uppercase mt-1">CLICK OR DRAG TO REPLACE</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-14 h-14 border border-[#333333] bg-[#111111] flex items-center justify-center text-white mx-auto">
                    <UploadCloud className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-xs font-mono font-bold text-white uppercase tracking-widest mb-1">
                      DRAG & DROP PORTRAIT HERE
                    </p>
                    <p className="text-[11px] font-mono text-[#777777] uppercase">
                      OR <span className="text-white underline">BROWSE LOCAL FILES</span>
                    </p>
                  </div>
                  <p className="text-[10px] font-mono text-[#555555] uppercase">FORMATS: PNG, JPG, WEBP</p>
                </div>
              )}
            </div>

            {apiError && (
              <div className="p-4 border border-red-500/40 bg-red-950/20 text-red-400 font-mono text-xs flex items-start gap-3 uppercase">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{apiError}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-4 pt-2">
              {preview && (
                <button
                  type="button"
                  onClick={handleResetImage}
                  className="px-5 py-3 border border-[#222222] text-[11px] font-mono tracking-widest text-[#777777] hover:text-white hover:border-[#444444] transition-all uppercase cursor-pointer"
                >
                  CLEAR FILE
                </button>
              )}

              <button
                type="button"
                onClick={handleSubmit}
                disabled={!base64String || loading}
                className="px-8 py-4 bg-white text-black hover:bg-[#e0e0e0] disabled:bg-[#222222] disabled:text-[#555555] disabled:cursor-not-allowed text-xs font-mono font-bold uppercase tracking-widest transition-all flex items-center gap-3 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    ANALYZING...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    ANALYZE DEMOGRAPHICS
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
