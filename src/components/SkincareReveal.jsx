import React from 'react';
import { ArrowLeft, Check, Home, Sparkles } from 'lucide-react';

const fallbackConcerns = [
  { name: 'Hydration', detail: 'Support the skin barrier and reduce tightness.' },
  { name: 'Texture', detail: 'Use gentle exfoliation to smooth uneven surface.' },
  { name: 'Tone', detail: 'Choose brightening care with daily sun protection.' },
];

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
  const visibleConcerns = concerns.length
    ? concerns.map((item) => ({ name: label(item.name), detail: `${(item.score * 100).toFixed(0)}% signal detected in your analysis.` }))
    : fallbackConcerns;

  return (
    <section className="skincare-screen">
      <header className="skincare-header">
        <div>
          <p className="skincare-kicker">PERSONALIZED SKIN ANALYSIS</p>
          <h1>Your skin routine</h1>
          <p className="skincare-subtitle">Built from your portrait analysis and confirmed profile.</p>
        </div>
        <div className="skincare-profile">{userDetails?.gender}, {userDetails?.age}</div>
      </header>

      <div className="skincare-grid">
        <section className="skincare-focus">
          <div className="skincare-section-title"><Sparkles size={16} /> TOP PRIORITIES</div>
          {visibleConcerns.map((concern) => (
            <article className="concern-row" key={concern.name}>
              <div className="concern-check"><Check size={15} /></div>
              <div><h2>{concern.name}</h2><p>{concern.detail}</p></div>
            </article>
          ))}
        </section>

        <section className="routine-card">
          <div className="skincare-section-title">DAILY ROUTINE</div>
          <div className="routine-step"><span>AM</span><div><strong>Cleanse + protect</strong><p>Gentle cleanser, hydrating serum, then broad-spectrum SPF 30+.</p></div></div>
          <div className="routine-step"><span>PM</span><div><strong>Restore + renew</strong><p>Cleanse, moisturize, and introduce one active slowly at night.</p></div></div>
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
