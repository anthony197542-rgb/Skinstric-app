import { useState } from 'react';
import { submitPhaseOne } from './api/skinstric.js';
import Phase3Selfie from './components/Phase3Selfie.jsx';
import Phase2Upload from './components/Phase2Upload.jsx';
import SkincareReveal from './components/SkincareReveal.jsx';
import DemographicsView from './components/DemographicsView.jsx';

export default function App() {
  const [screen, setScreen] = useState('intro');
  const [entryStep, setEntryStep] = useState('name');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [skincareData, setSkincareData] = useState(null);
  const [analysisCategory, setAnalysisCategory] = useState('Demographics');
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
        {(screen === 'testing' || screen === 'processing' || screen === 'thank-you' || screen === 'result' || screen === 'select' || screen === 'summary' || screen === 'camera' || screen === 'gallery') && (
          <ReferenceHeader onHome={goHome} onEnter={beginTesting} />
        )}
        {screen === 'intro' && (
          <section className="intro-screen" aria-labelledby="intro-title">
            <div className="intro-frame">
              <ReferenceHeader onHome={goHome} onEnter={beginTesting} />
              <div className="intro-diamond intro-diamond-outer" aria-hidden="true" />
              <div className="intro-diamond intro-diamond-inner" aria-hidden="true" />

              <button className="intro-side-action intro-discover" type="button">
                <span className="intro-mark" aria-hidden="true"><span /></span>
                <span>DISCOVER A.I.</span>
              </button>

              <button className="intro-side-action intro-test" type="button" onClick={beginTesting}>
                <span>TAKE TEST</span>
                <span className="intro-mark" aria-hidden="true"><span /></span>
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
        {screen === 'camera' && <Phase3Selfie userDetails={{ name, location }} onBack={() => setScreen('result')} onNext={(data) => { setSkincareData(data); setScreen('select'); }} />}
        {screen === 'gallery' && <Phase2Upload userDetails={{ name, location }} onBack={() => setScreen('result')} onNext={(data) => { setSkincareData(data); setScreen('select'); }} />}
        {screen === 'skincare' && <SkincareReveal data={skincareData} userDetails={{ name, location }} onBack={() => setScreen('camera')} onHome={goHome} />}
        {screen === 'select' && <SelectScreen onBack={() => setScreen('result')} onSelectCategory={(category) => { setAnalysisCategory(category); setScreen('summary'); }} />}
        {screen === 'summary' && <SummaryScreen category={analysisCategory} data={skincareData} userDetails={{ name, location }} onBack={() => setScreen('select')} onRetake={() => setScreen('result')} onHome={goHome} />}
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
  return (
    <section className="status-screen">
      <p className="testing-heading">TO START ANALYSIS</p>
      <div className="status-stage">
        <div className="status-copy">
          <p>{message}</p>
          {submessage && <small>{submessage}</small>}
          {!submessage && <div className="status-dots">● ● ●</div>}
        </div>
        <ReferenceDiamonds />
      </div>
      <div className="status-actions">
        <button className="diamond-control-btn" type="button" onClick={onBack}>
          <span className="reference-diamond-button" aria-hidden="true">
            <span className="result-back-arrow" />
          </span>
          <span>BACK</span>
        </button>
        {onNext && (
          <button className="diamond-control-btn" type="button" onClick={onNext}>
            <span>PROCEED</span>
            <span className="reference-diamond-button" aria-hidden="true">
              <span className="result-forward-arrow" />
            </span>
          </button>
        )}
      </div>
    </section>
  );
}
function ResultScreen({ onBack, onCamera, onGallery }) {
  return (
    <section className="result-screen">
      <p className="testing-heading">START ANALYSIS</p>
      
      <div className="result-preview">
        <span>Preview</span>
        <div className="result-preview-box" aria-hidden="true" />
      </div>

      <div className="result-options">
        <button className="result-option result-camera-option" type="button" onClick={onCamera}>
          <div className="result-icon result-camera-icon" aria-hidden="true">
            <span />
          </div>
          <b>ALLOW A.I.<br />TO SCAN YOUR FACE</b>
        </button>

        <button className="result-option result-gallery-option" type="button" onClick={onGallery}>
          <div className="result-icon result-gallery-icon" aria-hidden="true">
            <span />
          </div>
          <b>ALLOW A.I.<br />ACCESS GALLERY</b>
        </button>
      </div>

      <div className="result-back-control">
        <button className="diamond-control-btn" type="button" onClick={onBack}>
          <span className="reference-diamond-button" aria-hidden="true">
            <span className="result-back-arrow" />
          </span>
          <span>BACK</span>
        </button>
      </div>
    </section>
  );
}



function SelectScreen({ onBack, onSelectCategory }) {
  const [selectedCategory, setSelectedCategory] = useState('Demographics');
  const categoryDetails = {
    Demographics: 'Review the estimated age, gender, and skin profile from the portrait.',
    'Cosmetic Concerns': 'Review visible concern signals and prioritize the routine around them.',
    'Skin Type Details': 'Review the skin profile used to guide cleansing, hydration, and active care.',
    Weather: 'Adjust hydration and protection for the conditions around your location.',
  };

  const selectCategory = (label) => {
    setSelectedCategory(label);
    if (label === 'Demographics') onSelectCategory(label);
  };

  return (
    <section className="select-screen">
      <div>
        <p className="testing-heading">A.I. ANALYSIS</p>
        <p className="select-copy">A.I. HAS ESTIMATED THE FOLLOWING.<br />FIX ESTIMATED INFORMATION IF NEEDED.</p>
      </div>
      <div className="select-options">
        {Object.keys(categoryDetails).map((label) => (
          <button className={selectedCategory === label ? 'selected' : ''} type="button" key={label} onClick={() => selectCategory(label)}>
            <span>{label}</span>
          </button>
        ))}
      </div>
      <p className="select-detail">{categoryDetails[selectedCategory]}</p>
      <div className="select-actions">
        <button className="diamond-control-btn" type="button" onClick={onBack}>
          <span className="reference-diamond-button" aria-hidden="true">
            <span className="result-back-arrow" />
          </span>
          <span>BACK</span>
        </button>
        <button className="diamond-control-btn" type="button" onClick={() => onSelectCategory(selectedCategory)}>
          <span>PROCEED</span>
          <span className="reference-diamond-button" aria-hidden="true">
            <span className="result-forward-arrow" />
          </span>
        </button>
      </div>
    </section>
  );
}

function SummaryScreen({ category, data, userDetails, onBack, onHome }) {
  return <section className="summary-screen">
    <div className="summary-heading"><p className="testing-heading">A.I. ANALYSIS</p><h1>{category.toUpperCase()}</h1><h2>{category === 'Demographics' ? 'PREDICTED RACE & AGE' : 'PERSONALIZED INSIGHTS'}</h2></div>
    {category === 'Demographics' ? <DemographicsView data={data} userDetails={userDetails} onRetake={onBack} onNext={null} /> : <AnalysisDetail category={category} data={data} userDetails={userDetails} />}
    <div className="summary-footer">
      <button className="summary-footer-control" type="button" onClick={onBack}>
        <span className="summary-footer-diamond" aria-hidden="true"><span className="result-back-arrow" /></span>
        <span>BACK</span>
      </button>
      <button className="summary-footer-control summary-footer-home" type="button" onClick={onHome}>
        <span>HOME</span>
        <span className="summary-footer-diamond" aria-hidden="true"><span className="result-forward-arrow" /></span>
      </button>
    </div>
  </section>;
}

function AnalysisDetail({ category, userDetails }) {
  const details = {
    'Cosmetic Concerns': {
      title: 'VISIBLE CONCERNS',
      copy: 'Review the areas that may need the most attention in your routine.',
      items: ['Texture and unevenness', 'Tone and visible discoloration', 'Hydration and sensitivity'],
    },
    'Skin Type Details': {
      title: 'SKIN PROFILE',
      copy: 'Use this profile to guide cleansing, hydration, and active care.',
      items: ['Daily hydration balance', 'Barrier support', 'Gentle active ingredients'],
    },
    Weather: {
      title: `ROUTINE FOR ${userDetails.location.toUpperCase() || 'YOUR LOCATION'}`,
      copy: 'Weather-aware guidance will adjust protection and hydration for your location.',
      items: ['Hydration level', 'Sun protection', 'Environmental exposure'],
    },
  };
  const detail = details[category];

  return <div className="analysis-detail">
    <div className="analysis-detail-intro"><h3>{detail.title}</h3><p>{detail.copy}</p></div>
    <div className="analysis-detail-items">{detail.items.map((item, index) => <div className="analysis-detail-item" key={item}><span>0{index + 1}</span><strong>{item}</strong><b>REVIEW</b></div>)}</div>
    <p className="analysis-detail-note">Your portrait analysis is saved for the next skincare recommendation step.</p>
  </div>;
}