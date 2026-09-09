import React from 'react';
import { ArrowLeft, Check, Home, Sparkles } from 'lucide-react';

const fallbackConcerns = [
  { name: 'Hydration', detail: 'Support the skin barrier and reduce tightness.' },
  { name: 'Texture', detail: 'Use gentle exfoliation to smooth uneven surface.' },
  { name: 'Tone', detail: 'Choose brightening care with daily sun protection.' },
];

function ageRoutine(ageBracket) {
  const age = String(ageBracket || '').toLowerCase();
  if (age.includes('50') || age.includes('60') || age.includes('70')) {
    return {
      am: 'Cleanse + protect',
      amDetail: 'Gentle cleanser, barrier-support serum, moisturizer, and broad-spectrum SPF 30+.',
      pm: 'Restore + renew',
      pmDetail: 'Cleanse, moisturize, and introduce a gentle retinoid slowly if tolerated.',
    };
  }
  if (age.includes('3') || age.includes('4')) {
    return {
      am: 'Cleanse + protect',
      amDetail: 'Gentle cleanser, antioxidant serum, moisturizer, and broad-spectrum SPF 30+.',
      pm: 'Smooth + restore',
      pmDetail: 'Cleanse, moisturize, and use one gentle exfoliant or retinoid at a time.',
    };
  }
  return {
    am: 'Cleanse + protect',
    amDetail: 'Gentle cleanser, lightweight moisturizer, and broad-spectrum SPF 30+.',
    pm: 'Cleanse + hydrate',
    pmDetail: 'Remove sunscreen, cleanse gently, and moisturize consistently.',
  };
}

function topEntries(value) {
  if (!value || typeof value !== 'object') return [];
  return Object.entries(value)
    .map(([name, score]) => ({ name, score: Number(score) || 0 }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

function label(value) {
  return value.replace(/[-_]/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function SkincareReveal({ data, userDetails, onBack, onHome }) {
  const concerns = topEntries(data?.skin_concerns || data?.concerns);
  const predictedAge = topEntries(data?.age || data?.age_bracket || data?.ageBracket)[0]?.name;
  const predictedGender = topEntries(data?.gender || data?.sex)[0]?.name;
  const predictedRace = topEntries(data?.race || data?.skin_tone || data?.skinTone)[0]?.name;
  const routine = ageRoutine(predictedAge);
  const hasConcernData = concerns.length > 0;
  const visibleConcerns = hasConcernData
    ? concerns.map((item) => ({ name: label(item.name), detail: `${(item.score * 100).toFixed(0)}% signal detected in your analysis.` }))
    : fallbackConcerns;

  return (
    <section className="skincare-screen">
      <header className="skincare-header">
        <div>
          <p className="skincare-kicker">PERSONALIZED SKIN ANALYSIS</p>
          <h1>Your skin routine</h1>
          <p className="skincare-subtitle">{hasConcernData ? 'Built from this portrait analysis.' : 'A gentle starter routine while your skin concerns are being confirmed.'}</p>
        </div>
        <div className="skincare-profile">{label(predictedGender || 'Unknown gender')} / {label(predictedAge || 'Unknown age')}<small>{label(predictedRace || 'Skin profile pending')} · {hasConcernData ? 'AI CONCERNS FOUND' : 'STARTER GUIDANCE'}</small></div>
      </header>

      <div className="skincare-grid">
        <section className="skincare-focus">
          <div className="skincare-section-title"><Sparkles size={16} /> {hasConcernData ? 'TOP AI PRIORITIES' : 'FOUNDATION PRIORITIES'}</div>
          {visibleConcerns.map((concern) => (
            <article className="concern-row" key={concern.name}>
              <div className="concern-check"><Check size={15} /></div>
              <div><h2>{concern.name}</h2><p>{concern.detail}</p></div>
            </article>
          ))}
        </section>

        <section className="routine-card">
          <div className="skincare-section-title">DAILY ROUTINE</div>
          <div className="routine-step"><span>AM</span><div><strong>{routine.am}</strong><p>{routine.amDetail}</p></div></div>
          <div className="routine-step"><span>PM</span><div><strong>{routine.pm}</strong><p>{routine.pmDetail}</p></div></div>
          <div className="routine-step"><span>WK</span><div><strong>Keep it consistent</strong><p>Patch test new products and change only one product at a time.</p></div></div>
        </section>
      </div>

      <div className="skincare-actions">
        <button type="button" onClick={onBack}><ArrowLeft size={16} /> BACK TO RESULTS</button>
        <button type="button" onClick={onHome}><Home size={16} /> HOME</button>
      </div>
    </section>
  );
}
