import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import Phase1Form from './components/Phase1Form.jsx';
import Phase2Upload from './components/Phase2Upload.jsx';
import Phase3Selfie from './components/Phase3Selfie.jsx';

export default function App() {
  const [currentPhase, setCurrentPhase] = useState(1);
  const [userDetails, setUserDetails] = useState(null);

  // Load stored user from localStorage on initial render
  useEffect(() => {
    try {
      const saved = localStorage.getItem('skinstric_user');
      if (saved) {
        setUserDetails(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to parse saved user from localStorage:', e);
    }
  }, []);

  const handleSaveUser = (userData) => {
    setUserDetails(userData);
  };

  const handleResetApp = () => {
    setCurrentPhase(1);
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-[#e0e2ec] flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Navbar */}
      <Navbar
        currentPhase={currentPhase}
        userDetails={userDetails}
        onReset={handleResetApp}
      />

      {/* Main View Container */}
      <main className="flex-1 py-8">
        {currentPhase === 1 && (
          <Phase1Form
            onNext={() => setCurrentPhase(2)}
            onSaveUser={handleSaveUser}
            initialUser={userDetails}
          />
        )}

        {currentPhase === 2 && (
          <Phase2Upload
            onNext={() => setCurrentPhase(3)}
            onBack={() => setCurrentPhase(1)}
            userDetails={userDetails}
          />
        )}

        {currentPhase === 3 && (
          <Phase3Selfie
            onBack={() => setCurrentPhase(2)}
            userDetails={userDetails}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1e2330] py-6 text-center text-xs text-[#6b7280]">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Skinstric AI. Built for Frontend Internship.</p>
          <div className="flex items-center gap-4">
            <span className="text-[#9ca3af]">Level 1: Customer Data</span>
            <span>•</span>
            <span className="text-[#9ca3af]">Level 2: Base64 Upload</span>
            <span>•</span>
            <span className="text-[#9ca3af]">Level 3: Live Selfie</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
