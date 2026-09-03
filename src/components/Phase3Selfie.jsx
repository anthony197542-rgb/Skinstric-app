import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, Loader2, AlertCircle, ArrowLeft, Sparkles, SwitchCamera } from 'lucide-react';
import { submitPhaseTwo } from '../api/skinstric.js';
import DemographicsView from './DemographicsView.jsx';

export default function Phase3Selfie({ onBack, userDetails }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState('user'); // 'user' or 'environment'
  const [capturedImage, setCapturedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [apiError, setApiError] = useState('');
  const [demographicsData, setDemographicsData] = useState(null);

  // Start video stream
  const startCamera = async (mode = facingMode) => {
    setCameraError('');
    setCapturedImage(null);

    // Stop existing stream if any
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      setStream(newStream);
      setCameraActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
    } catch (err) {
      console.error('Webcam error:', err);
      setCameraError(
        'Unable to access camera. Please allow camera permissions in your browser or try uploading an image in Phase 2.'
      );
      setCameraActive(false);
    }
  };

  // Stop video stream
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  };

  // Switch between front and back camera
  const toggleFacingMode = () => {
    const nextMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  // Capture snapshot frame to canvas
  const takeSelfie = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');

    // If front camera, mirror horizontally for natural selfie feel
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(dataUrl);
    stopCamera();
  };

  // Retake selfie
  const handleRetakeSelfie = () => {
    setCapturedImage(null);
    setDemographicsData(null);
    startCamera(facingMode);
  };

  // Submit snapshot to Level 2 API
  const handleSubmitSelfie = async () => {
    if (!capturedImage) return;

    setLoading(true);
    setApiError('');

    try {
      const res = await submitPhaseTwo(capturedImage);
      if (res && res.data) {
        setDemographicsData(res.data);
      } else {
        throw new Error('Invalid response received from API.');
      }
    } catch (err) {
      setApiError(err.message || 'Error processing selfie with Level 2 API.');
    } finally {
      setLoading(false);
    }
  };

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
            Phase 3 • Level 3
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-3 mb-1 tracking-tight">
            Take a Live Selfie
          </h1>
          <p className="text-sm text-[#9ca3af]">
            Use your device camera to capture a live snapshot and analyze AI demographics.
          </p>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl border border-[#232938] text-xs font-semibold text-[#9ca3af] hover:text-white hover:bg-[#181c29] transition-all flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Phase 2
        </button>
      </div>

      {/* Main Container */}
      {!demographicsData ? (
        <div className="bg-[#12151f] border border-[#1e2330] rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="max-w-xl mx-auto space-y-6">
            {/* Camera Viewport */}
            <div className="relative rounded-2xl bg-[#0d0f17] border border-[#232938] overflow-hidden min-h-[300px] flex items-center justify-center">
              {/* Hidden Canvas used for raster capture */}
              <canvas ref={canvasRef} className="hidden" />

              {cameraActive && !capturedImage && (
                <div className="relative w-full aspect-video bg-black flex items-center justify-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''
                      }`}
                  />
                  {/* Facial Alignment Oval Overlay */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="w-48 h-64 border-2 border-dashed border-purple-400/60 rounded-full shadow-[0_0_50px_rgba(168,85,247,0.2)]" />
                  </div>
                </div>
              )}

              {capturedImage && (
                <div className="relative w-full aspect-video bg-black flex items-center justify-center">
                  <img
                    src={capturedImage}
                    alt="Captured Selfie"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {!cameraActive && !capturedImage && (
                <div className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mx-auto">
                    <Camera className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white mb-1">
                      Webcam / Camera Stream
                    </p>
                    <p className="text-xs text-[#9ca3af]">
                      Click below to enable your browser camera.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => startCamera(facingMode)}
                    className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-purple-600/20 inline-flex items-center gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    Start Camera
                  </button>
                </div>
              )}
            </div>

            {/* Error alerts */}
            {cameraError && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{cameraError}</span>
              </div>
            )}

            {apiError && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{apiError}</span>
              </div>
            )}

            {/* Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              {cameraActive && !capturedImage && (
                <>
                  <button
                    type="button"
                    onClick={toggleFacingMode}
                    className="px-4 py-2.5 rounded-xl border border-[#232938] text-xs font-semibold text-[#9ca3af] hover:text-white hover:bg-[#181c29] transition-all flex items-center gap-1.5"
                  >
                    <SwitchCamera className="w-4 h-4" />
                    Switch Camera
                  </button>

                  <button
                    type="button"
                    onClick={takeSelfie}
                    className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-purple-600/20 flex items-center gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    Capture Snapshot
                  </button>
                </>
              )}

              {capturedImage && (
                <>
                  <button
                    type="button"
                    onClick={handleRetakeSelfie}
                    className="px-4 py-2.5 rounded-xl border border-[#232938] text-xs font-semibold text-[#9ca3af] hover:text-white hover:bg-[#181c29] transition-all flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Retake Selfie
                  </button>

                  <button
                    type="button"
                    onClick={handleSubmitSelfie}
                    disabled={loading}
                    className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-purple-600/20 flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Scanning Demographics...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Analyze Selfie (Level 2 API)
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        <DemographicsView
          data={demographicsData}
          userDetails={userDetails}
          onRetake={handleRetakeSelfie}
        />
      )}
    </div>
  );
}
