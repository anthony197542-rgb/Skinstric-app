import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, Loader2, AlertCircle, Sparkles, SwitchCamera } from 'lucide-react';
import { submitPhaseTwo } from '../api/skinstric.js';
import DemographicsView from './DemographicsView.jsx';

export default function Phase3Selfie({ onBack, onResultsBack, onData, onNext, userDetails }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // 'menu' starts at the diamond selection view; switches to 'setup', 'live', or 'preview' when active
  const [step, setStep] = useState('menu');
  const [facingMode, setFacingMode] = useState('user');
  const [capturedImage, setCapturedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [apiError, setApiError] = useState('');
  const [demographicsData, setDemographicsData] = useState(null);

  // Automatically start camera after entering setup state
  useEffect(() => {
    let timer;
    if (step === 'setup') {
      timer = setTimeout(() => {
        startCamera(facingMode);
      }, 1500);
    }
    return () => clearTimeout(timer);
  }, [step]);

  const startCamera = async (mode = facingMode) => {
    setCameraError('');
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('CAMERA_UNSUPPORTED');
      }

      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });

      streamRef.current = newStream;
      setStep('live');

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = newStream;
          videoRef.current.play().catch(e => console.log("Auto-play prevented:", e));
        }
      }, 50);

    } catch (err) {
      console.error('Webcam error:', err);
      setCameraError('Camera access error: ' + err.message);
      setStep('setup');
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  const toggleFacingMode = () => {
    const nextMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  const takeSelfie = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const ctx = canvas.getContext('2d');

    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(dataUrl);
    stopCamera();
    setStep('preview');
  };

  const handleRetakeSelfie = () => {
    setCapturedImage(null);
    setDemographicsData(null);
    setStep('setup');
  };

  const handleSubmitSelfie = async () => {
    if (!capturedImage) return;
    setLoading(true);
    setApiError('');
    try {
      const res = await submitPhaseTwo(capturedImage);
      if (res && res.data) {
        setDemographicsData(res.data);
        onData?.(res.data);
      } else {
        throw new Error('Invalid response received from API.');
      }
    } catch (err) {
      setApiError(err.message || 'Error processing selfie.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  return (
    <div className="skinstric-app">
      <main className="camera-screen-container">
        <canvas ref={canvasRef} className="hidden" />

        {/* STEP 1: Diamond Menu / Selection View */}
        {step === 'menu' && !demographicsData && (
          <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
            <div className="camera-rotating-diamonds mb-8" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <h2 className="text-xl font-mono tracking-widest uppercase mb-6">SELECT ANALYSIS MODULE</h2>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setStep('setup')}
                className="camera-action-btn primary px-8 py-4 font-mono uppercase tracking-widest"
              >
                STARTING CAMERA / DEMOGRAPHICS
              </button>
            </div>
            {/* Bottom Back Button for the Menu */}
            <div className="absolute bottom-8 left-8">
              <button className="diamond-control-btn flex items-center gap-2" type="button" onClick={onBack}>
                <span className="reference-diamond-button" aria-hidden="true">
                  <span className="result-back-arrow" />
                </span>
                <span>BACK</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Camera & Preview Flow */}
        {step !== 'menu' && !demographicsData && (
          <>
            <div className="camera-rotating-diamonds" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>

            {step === 'setup' && (
              <div className="camera-center-content">
                <div className="camera-aperture-icon" aria-hidden="true">
                  <span />
                </div>
                <p className="camera-setup-status-text">SETTING UP CAMERA ...</p>
              </div>
            )}

            <div className={`camera-video-wrapper ${step === 'live' ? 'block' : 'hidden'}`}>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
              />
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
                <div className="w-56 h-72 border border-dashed border-white/60 rounded-full" />
              </div>
            </div>

            {step === 'preview' && capturedImage && (
              <div className="camera-video-wrapper">
                <img src={capturedImage} alt="Captured Selfie" className="w-full h-full object-cover" />
              </div>
            )}

            {cameraError && (
              <div className="absolute top-24 left-6 right-6 p-4 border border-red-500/40 bg-red-950/20 text-red-400 font-mono text-xs flex items-center gap-3 uppercase z-30" role="alert">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{cameraError}</span>
              </div>
            )}

            {apiError && (
              <div className="absolute top-24 left-6 right-6 p-4 border border-red-500/40 bg-red-950/20 text-red-400 font-mono text-xs flex items-center gap-3 uppercase z-30" role="alert">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{apiError}</span>
              </div>
            )}

            <div className="camera-bottom-guide">
              <p className="camera-tips-heading">TO GET BETTER RESULTS MAKE SURE TO HAVE</p>
              <div className="camera-tips-row">
                <span>◇ NEUTRAL EXPRESSION</span>
                <span>◇ FRONTAL POSE</span>
                <span>◇ ADEQUATE LIGHTING</span>
              </div>

              <div className="camera-progress-container">
                <span className="camera-progress-arrow-left">◀</span>
                <div className="camera-progress-track">
                  <div className="camera-progress-thumb" />
                </div>
                <span className="camera-progress-arrow-right">▶</span>
              </div>
            </div>

            <div className="camera-footer-actions">
              <button className="diamond-control-btn" type="button" onClick={() => setStep('menu')}>
                <span className="reference-diamond-button" aria-hidden="true">
                  <span className="result-back-arrow" />
                </span>
                <span>BACK</span>
              </button>

              {step === 'live' && (
                <div className="flex items-center gap-4">
                  <button type="button" onClick={toggleFacingMode} className="camera-action-btn">
                    <SwitchCamera className="w-4 h-4" /> TOGGLE CAMERA
                  </button>
                  <button type="button" onClick={takeSelfie} className="camera-action-btn primary">
                    <Camera className="w-4 h-4" /> CAPTURE
                  </button>
                </div>
              )}

              {step === 'preview' && (
                <div className="flex items-center gap-4">
                  <button type="button" onClick={handleRetakeSelfie} className="camera-action-btn">
                    <RefreshCw className="w-3.5 h-3.5" /> RETAKE
                  </button>
                  <button type="button" onClick={handleSubmitSelfie} disabled={loading} className="camera-action-btn primary">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    {loading ? 'PROCESSING...' : 'ANALYZE'}
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* STEP 3: Demographics Results View */}
        {demographicsData && (
          <DemographicsView
            data={demographicsData}
            userDetails={userDetails}
            onRetake={handleRetakeSelfie}
            onBack={onResultsBack || onBack}
            onHome={() => {
              window.location.reload();
            }}
          />
        )}

      </main>
    </div>
  );
}