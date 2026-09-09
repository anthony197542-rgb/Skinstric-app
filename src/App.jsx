import { useState } from 'react';

export default function App() {
  const [screen, setScreen] = useState('intro');
  const [entryStep, setEntryStep] = useState('name');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');

  const beginTesting = () => {
    setEntryStep('name');
    setScreen('testing');
  };

  const submitEntry = (event) => {
    event.preventDefault();
    if (entryStep === 'name' && name.trim()) {
      setEntryStep('location');
    } else if (entryStep === 'location' && location.trim()) {
      setScreen('processing');
      window.setTimeout(() => setScreen('thank-you'), 900);
    }
  };

  const goHome = () => setScreen('intro');

  return (
    <div className="skinstric-app">
      <main>
        {(screen === 'intro' || screen === 'testing' || screen === 'processing' || screen === 'thank-you') && (
          <ReferenceHeader onHome={goHome} onEnter={beginTesting} />
        )}
        {screen === 'intro' && (
          <section className="intro-screen" aria-labelledby="intro-title">
            <div className="intro-diamond intro-diamond-outer" aria-hidden="true" />
            <div className="intro-diamond intro-diamond-inner" aria-hidden="true" />

            <div className="intro-content">
              <h1 id="intro-title">Sophisticated<br />skincare</h1>
              <p>Skinstric developed an A.I. that creates a highly-personalized routine tailored to what your skin needs.</p>
              <button className="intro-experience" type="button" onClick={beginTesting}>
                <span>ENTER EXPERIENCE</span>
                <span className="intro-mark" aria-hidden="true"><span>›</span></span>
              </button>
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
                <button type="submit">Submit</button>
              </form>
              <ReferenceDiamonds />
            </div>
            <button className="reference-diamond-button reference-back" type="button" onClick={goHome}>BACK</button>
          </section>
        )}
        {screen === 'processing' && <StatusScreen message="Processing submission" onBack={goHome} />}
        {screen === 'thank-you' && <StatusScreen message="Thank you!" submessage="Proceed for the next step" onBack={goHome} onNext={() => setScreen('result')} />}
        {screen === 'result' && <ResultScreen onBack={() => setScreen('thank-you')} onNext={() => setScreen('select')} />}
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

function ResultScreen({ onBack, onNext }) {
  return <section className="result-screen"><div><p className="testing-heading">TO START ANALYSIS</p><h1>Preview</h1></div><div className="result-options"><button type="button"><span className="result-icon">◉</span><b>ALLOW A.I.<br />TO SCAN YOUR FACE</b></button><button type="button"><span className="result-icon">▧</span><b>ALLOW A.I.<br />ACCESS GALLERY</b></button></div><div className="status-actions"><button className="reference-diamond-button" type="button" onClick={onBack}>BACK</button><button className="reference-diamond-button" type="button" onClick={onNext}>›</button></div></section>;
}

function SelectScreen({ onBack, onNext }) {
  return <section className="select-screen"><div><p className="testing-heading">A.I. ANALYSIS</p><p className="select-copy">A.I. has estimated the following.<br />Fix estimated information if needed.</p></div><div className="select-options">{['Demographics', 'Cosmetic Concerns', 'Skin Type Details', 'Weather'].map((label, index) => <button type="button" key={label} onClick={index === 0 ? onNext : undefined}>{label}</button>)}</div><div className="status-actions"><button className="reference-diamond-button" type="button" onClick={onBack}>BACK</button><button className="reference-diamond-button" type="button" onClick={onNext}>SUM</button></div></section>;
}

function SummaryScreen({ onBack, onHome }) {
  return <section className="summary-screen"><div><p className="testing-heading">A.I. ANALYSIS</p><h1>DEMOGRAPHICS</h1><h2>PREDICTED RACE &amp; AGE</h2></div><p className="summary-empty">No analysis data found. Please upload an image first.</p><div className="status-actions"><button className="reference-diamond-button" type="button" onClick={onBack}>BACK</button><button className="reference-diamond-button" type="button" onClick={onHome}>HOME</button></div></section>;
}
