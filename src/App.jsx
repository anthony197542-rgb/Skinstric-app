import { useState } from 'react';
import { submitPhaseOne } from './api/skinstric.js';
import Phase3Selfie from './components/Phase3Selfie.jsx';
import Phase2Upload from './components/Phase2Upload.jsx';
import SkincareReveal from './components/SkincareReveal.jsx';

export default function App() {
  const [screen, setScreen] = useState('intro');
  const [entryStep, setEntryStep] = useState('name');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [skincareData, setSkincareData] = useState(null);
  const [entryError, setEntryError] = useState('');
  const [entryLoading, setEntryLoading] = useState(false);
  const [entryOffline, setEntryOffline] = useState(false);

  const beginTesting = () => {
    setEntryStep('name');
    setEntryError('');
    setEntryOffline(false);
    setScreen('testing');
  };

  const submitEntry = async (event) => {
    event.preventDefault();
    setEntryError('');

    if (entryStep === 'name' && !name.trim()) {
      setEntryError('Your name is required.');
      return;
    }

    if (entryStep === 'name' && /\d/.test(name)) {
      setEntryError('Name must not contain numbers.');
      return;
    }

    if (entryStep === 'name') {
      setEntryStep('location');
      return;
    }

    if (!location.trim()) {
      setEntryError('Your location is required.');
      return;
    }

    if (/\d/.test(location)) {
      setEntryError('Location must not contain numbers.');
      return;
    }

    setEntryLoading(true);
    try {
      await submitPhaseOne(name.trim(), location.trim());
      localStorage.setItem('skinstric_user', JSON.stringify({ name: name.trim(), location: location.trim() }));
      setScreen('processing');
      window.setTimeout(() => setScreen('thank-you'), 900);
    } catch (error) {
      localStorage.setItem('skinstric_user', JSON.stringify({ name: name.trim(), location: location.trim() }));
      setEntryOffline(true);
      setScreen('processing');
      window.setTimeout(() => setScreen('thank-you'), 900);
    } finally {
      setEntryLoading(false);
    }
  };

  const goHome = () => setScreen('intro');

  return (
    <div className="skinstric-app">
      <main>
        {(screen === 'testing' || screen === 'processing' || screen === 'thank-you') && (
          <ReferenceHeader onHome={goHome} onEnter={beginTesting} />
        )}
        {screen === 'intro' && (
          <section className="intro-screen" aria-labelledby="intro-title">
            <div className="intro-frame">
              <ReferenceHeader onHome={goHome} onEnter={beginTesting} />
              <div className="intro-diamond intro-diamond-outer" aria-hidden="true" />
              <div className="intro-diamond intro-diamond-inner" aria-hidden="true" />

              <button className="intro-side-action intro-discover" type="button">
                <span className="intro-mark" aria-hidden="true"><span>‹</span></span>
                <span>DISCOVER A.I.</span>
              </button>

              <button className="intro-side-action intro-test" type="button" onClick={beginTesting}>
                <span>TAKE TEST</span>
                <span className="intro-mark" aria-hidden="true"><span>›</span></span>
              </button>

              <div className="intro-content">
                <h1 id="intro-title">Sophisticated<br />skincare</h1>
                <p>Skinstric developed an A.I. that creates a highly-personalized routine tailored to what your skin needs.</p>
              </div>
            </div>
          </section>
        )}
        {screen === 'testing' && (
          <section className="testing-screen" aria-labelledby="testing-title">
            <p id="testing-title" className="testing-heading">TO START ANALYSIS</p>
            <div className="testing-stage">
              <p className="testing-prompt">CLICK TO TYPE</p>
              <form className="testing-form" onSubmit={submitEntry}>
                <input
                  aria-label={entryStep === 'name' ? 'Introduce Yourself' : 'your city name'}
                  autoFocus
                  placeholder={entryStep === 'name' ? 'Introduce Yourself' : 'your city name'}
                  value={entryStep === 'name' ? name : location}
                  onChange={(event) => entryStep === 'name' ? setName(event.target.value) : setLocation(event.target.value)}
                />
                <button type="submit" disabled={entryLoading}>{entryLoading ? 'Submitting...' : 'Submit'}</button>
              </form>
              {entryError && <p className="testing-error" role="alert">{entryError}</p>}
              <ReferenceDiamonds />
            </div>
            <button className="testing-back-control" type="button" onClick={goHome}>
              <span className="testing-back-diamond" aria-hidden="true"><span className="testing-back-arrow" /></span>
              <span>BACK</span>
            </button>
          </section>
        )}
        {screen === 'processing' && <StatusScreen message={entryOffline ? 'Saved locally' : 'Processing submission'} onBack={goHome} />}
        {screen === 'thank-you' && <StatusScreen message="Thank you!" submessage={entryOffline ? 'Backend unavailable. Continue in local mode.' : 'Proceed for the next step'} onBack={goHome} onNext={() => setScreen('result')} />}
        {screen === 'result' && <ResultScreen onBack={() => setScreen('thank-you')} onCamera={() => setScreen('camera')} onGallery={() => setScreen('gallery')} onNext={() => setScreen('select')} />}
        {screen === 'camera' && <Phase3Selfie userDetails={{ name, location }} onBack={() => setScreen('result')} onNext={(data) => { setSkincareData(data); setScreen('skincare'); }} />}
        {screen === 'gallery' && <Phase2Upload userDetails={{ name, location }} onBack={() => setScreen('result')} onNext={(data) => { setSkincareData(data); setScreen('skincare'); }} />}
        {screen === 'skincare' && <SkincareReveal data={skincareData} userDetails={{ name, location }} onBack={() => setScreen('camera')} onHome={goHome} />}
        {screen === 'select' && <SelectScreen onBack={() => setScreen('result')} onNext={() => setScreen('summary')} />}
        {screen === 'summary' && <SummaryScreen onBack={() => setScreen('select')} onHome={goHome} />}
      </main>
    </div>
  );
}

function ReferenceHeader({ onHome, onEnter }) {
  return <header className="reference-header">
    <button className="reference-brand" type="button" onClick={onHome}>SKINSTRIC</button>
    <span className="reference-intro"><i>[</i> INTRO <i>]</i></span>
    <button className="reference-code" type="button" onClick={onEnter}>ENTER CODE</button>
  </header>;
}

function ReferenceDiamonds() {
  return <div className="reference-diamonds" aria-hidden="true"><span /><span /><span /></div>;
}

function StatusScreen({ message, submessage, onBack, onNext }) {
  return <section className="status-screen"><p className="testing-heading">TO START ANALYSIS</p><div className="status-stage"><div className="status-copy"><p>{message}</p>{submessage && <small>{submessage}</small>}{!submessage && <div className="status-dots">● ● ●</div>}</div><ReferenceDiamonds /></div><div className="status-actions"><button className="reference-diamond-button" type="button" onClick={onBack}>BACK</button>{onNext && <button className="reference-diamond-button" type="button" onClick={onNext}>PROCEED</button>}</div></section>;
}

function ResultScreen({ onBack, onCamera, onGallery, onNext }) {
  return <section className="result-screen"><div><p className="testing-heading">TO START ANALYSIS</p><h1>Preview</h1></div><div className="result-options"><button type="button" onClick={onCamera}><span className="result-icon">◉</span><b>ALLOW A.I.<br />TO SCAN YOUR FACE</b></button><button type="button" onClick={onGallery}><span className="result-icon">▧</span><b>ALLOW A.I.<br />ACCESS GALLERY</b></button></div><div className="status-actions"><button className="reference-diamond-button" type="button" onClick={onBack}>BACK</button><button className="reference-diamond-button" type="button" onClick={onNext}>›</button></div></section>;
}

function SelectScreen({ onBack, onNext }) {
  return <section className="select-screen"><div><p className="testing-heading">A.I. ANALYSIS</p><p className="select-copy">A.I. has estimated the following.<br />Fix estimated information if needed.</p></div><div className="select-options">{['Demographics', 'Cosmetic Concerns', 'Skin Type Details', 'Weather'].map((label, index) => <button type="button" key={label} onClick={index === 0 ? onNext : undefined}>{label}</button>)}</div><div className="status-actions"><button className="reference-diamond-button" type="button" onClick={onBack}>BACK</button><button className="reference-diamond-button" type="button" onClick={onNext}>SUM</button></div></section>;
}

function SummaryScreen({ onBack, onHome }) {
  return <section className="summary-screen"><div><p className="testing-heading">A.I. ANALYSIS</p><h1>DEMOGRAPHICS</h1><h2>PREDICTED RACE &amp; AGE</h2></div><p className="summary-empty">Choose a portrait source to generate individual analysis.</p><div className="status-actions"><button className="reference-diamond-button" type="button" onClick={onBack}>BACK</button><button className="reference-diamond-button" type="button" onClick={onHome}>HOME</button></div></section>;
}
