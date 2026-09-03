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
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-block px-2.5 py-1 bg-[#151515] border border-[#282828] text-[10px] font-mono tracking-[0.2em] text-[#888888] uppercase mb-2">
            LEVEL 3 • LIVE STREAM
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight uppercase">
            Capture Selfie
          </h1>
          <p className="text-xs font-mono text-[#777777] mt-1 tracking-wide uppercase">
            Use your camera to capture a portrait frame for AI demographics scan
          </p>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="self-start sm:self-auto px-4 py-2.5 border border-[#222222] text-[11px] font-mono tracking-widest text-[#777777] hover:text-white hover:border-[#444444] transition-all flex items-center gap-2 uppercase cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Phase 2
        </button>
      </div>

      {/* Main Container */}
      {!demographicsData ? (
        <div className="border border-[#222222] bg-[#080808] p-8 sm:p-12">
          <div className="max-w-xl mx-auto space-y-8">
            {/* Camera Viewport */}
            <div className="relative border border-[#282828] bg-black overflow-hidden min-h-[320px] flex items-center justify-center">
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
                  {/* Minimalist Facial Alignment Overlay */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="w-48 h-64 border border-dashed border-white/60 rounded-full" />
                  </div>
                </div>
              )}

              {capturedImage && (
                <div className="relative w-full aspect-video bg-black flex items-center justify-center">
                  <img
                    src={capturedImage}
                    alt="Captured Selfie"
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all"
                  />
                </div>
              )}

              {!cameraActive && !capturedImage && (
                <div className="p-10 text-center space-y-4">
                  <div className="w-14 h-14 border border-[#333333] bg-[#111111] flex items-center justify-center text-white mx-auto">
                    <Camera className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-xs font-mono font-bold text-white uppercase tracking-widest mb-1">
                      CAMERA FEED DISCONNECTED
                    </p>
                    <p className="text-[11px] font-mono text-[#777777] uppercase">
                      CLICK BELOW TO REQUEST WEBCAM ACCESS
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => startCamera(facingMode)}
                    className="px-8 py-3.5 bg-white text-black hover:bg-[#e0e0e0] text-xs font-mono font-bold uppercase tracking-widest transition-all inline-flex items-center gap-3 cursor-pointer"
                  >
                    <Camera className="w-4 h-4" />
                    ENABLE CAMERA
                  </button>
                </div>
              )}
            </div>

            {/* Error alerts */}
            {cameraError && (
              <div className="p-4 border border-red-500/40 bg-red-950/20 text-red-400 font-mono text-xs flex items-start gap-3 uppercase">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{cameraError}</span>
              </div>
            )}

            {apiError && (
              <div className="p-4 border border-red-500/40 bg-red-950/20 text-red-400 font-mono text-xs flex items-start gap-3 uppercase">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{apiError}</span>
              </div>
            )}

            {/* Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              {cameraActive && !capturedImage && (
                <>
                  <button
                    type="button"
                    onClick={toggleFacingMode}
                    className="px-5 py-3 border border-[#222222] text-[11px] font-mono tracking-widest text-[#777777] hover:text-white hover:border-[#444444] transition-all flex items-center gap-2 uppercase cursor-pointer"
                  >
                    <SwitchCamera className="w-4 h-4" />
                    TOGGLE CAMERA
                  </button>

                  <button
                    type="button"
                    onClick={takeSelfie}
                    className="px-8 py-4 bg-white text-black hover:bg-[#e0e0e0] text-xs font-mono font-bold uppercase tracking-widest transition-all flex items-center gap-3 cursor-pointer"
                  >
                    <Camera className="w-4 h-4" />
                    CAPTURE SNAPSHOT
                  </button>
                </>
              )}

              {capturedImage && (
                <>
                  <button
                    type="button"
                    onClick={handleRetakeSelfie}
                    className="px-5 py-3 border border-[#222222] text-[11px] font-mono tracking-widest text-[#777777] hover:text-white hover:border-[#444444] transition-all flex items-center gap-2 uppercase cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    RETAKE
                  </button>

                  <button
                    type="button"
                    onClick={handleSubmitSelfie}
                    disabled={loading}
                    className="px-8 py-4 bg-white text-black hover:bg-[#e0e0e0] disabled:bg-[#222222] disabled:text-[#555555] disabled:cursor-not-allowed text-xs font-mono font-bold uppercase tracking-widest transition-all flex items-center gap-3 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        PROCESSING...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        ANALYZE SNAPSHOT
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
