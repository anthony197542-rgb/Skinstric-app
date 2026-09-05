import { useState } from 'react';
import Navbar from './components/Navbar.jsx';
import Phase1Form from './components/Phase1Form.jsx';
import Phase2Upload from './components/Phase2Upload.jsx';
import Phase3Selfie from './components/Phase3Selfie.jsx';

function loadSavedUser() {
  try {
    const savedUser = localStorage.getItem('skinstric_user');
    return savedUser ? JSON.parse(savedUser) : null;
  } catch {
    return null;
  }
}

export default function App() {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [userDetails, setUserDetails] = useState(loadSavedUser);

  const resetWorkflow = () => {
    localStorage.removeItem('skinstric_user');
    setUserDetails(null);
    setCurrentPhase(1);
  };

  return (
    <div className="skinstric-app">
      {currentPhase > 0 && (
        <Navbar
          currentPhase={currentPhase}
          userDetails={userDetails}
          onReset={resetWorkflow}
        />
      )}
      <main>
        {currentPhase === 0 && (
          <section className="intro-screen" aria-labelledby="intro-title">
            <button className="intro-side-action intro-discover" type="button">
              <span className="intro-mark" aria-hidden="true">◇</span>
              <span>Discover all</span>
            </button>

            <div className="intro-content">
              <h1 id="intro-title">Sophisticated<br />skincare</h1>
              <p>Skinstric developed an AI that creates a highly personalized solution tailored to what your skin needs.</p>
            </div>

            <button
              className="intro-side-action intro-test"
              type="button"
              onClick={() => setCurrentPhase(1)}
            >
              <span>Take test</span>
              <span className="intro-mark" aria-hidden="true">◇</span>
            </button>
          </section>
        )}
        {currentPhase === 1 && (
          <Phase1Form
            initialUser={userDetails}
            onSaveUser={setUserDetails}
            onNext={() => setCurrentPhase(2)}
          />
        )}
        {currentPhase === 2 && (
          <Phase2Upload
            userDetails={userDetails}
            onBack={() => setCurrentPhase(1)}
            onNext={() => setCurrentPhase(3)}
          />
        )}
        {currentPhase === 3 && (
          <Phase3Selfie
            userDetails={userDetails}
            onBack={() => setCurrentPhase(2)}
          />
        )}
      </main>
    </div>
  );
}
