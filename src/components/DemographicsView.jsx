import React, { useState } from 'react';

export default function DemographicsView({ data, onRetake }) {
  const sortPredictions = (values) => Object.entries(values || {})
    .map(([key, value]) => ({ key, value: Number(value) || 0 }))
    .sort((a, b) => b.value - a.value);

  const predictions = {
    race: sortPredictions(data?.race || data?.skin_tone || data?.skinTone),
    age: sortPredictions(data?.age || data?.age_bracket || data?.ageBracket),
    gender: sortPredictions(data?.gender || data?.sex),
  };
  const labels = { race: 'RACE', age: 'AGE', gender: 'SEX' };
  const [activeType, setActiveType] = useState('race');
  const [selected, setSelected] = useState({
    race: predictions.race[0],
    age: predictions.age[0],
    gender: predictions.gender[0],
  });
  const activePrediction = selected[activeType] || predictions[activeType][0] || { key: 'Unknown', value: 0 };
  const activeList = predictions[activeType];
  const formatLabel = (value) => value.replace(/[-_]/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
  const percentage = (value) => `${Math.round(value * 100)}%`;

  const choosePrediction = (item) => {
    setSelected((current) => ({ ...current, [activeType]: item }));
  };

  return <div className="demographics-reference">
    <div className="demographics-sidebar">
      {Object.keys(labels).map((type) => {
        const item = selected[type] || predictions[type][0] || { key: 'Unknown' };
        return <button className={activeType === type ? 'active' : ''} type="button" key={type} onClick={() => setActiveType(type)}>
          <strong>{formatLabel(item.key)}</strong>
          <span>{labels[type]}</span>
        </button>;
      })}
    </div>

    <div className="demographics-main">
      <h2>{formatLabel(activePrediction.key)}</h2>
      <div className="confidence-ring" style={{ '--confidence': `${activePrediction.value * 360}deg` }}>
        <span>{percentage(activePrediction.value)}</span>
      </div>
    </div>

    <div className="demographics-list">
      <div className="demographics-list-header"><span>{labels[activeType]}</span><span>A.I. CONFIDENCE</span></div>
      {activeList.map((item) => <button className={activePrediction.key === item.key ? 'selected' : ''} type="button" key={item.key} onClick={() => choosePrediction(item)}>
        <span className="demographics-bullet">◇</span>
        <span>{formatLabel(item.key)}</span>
        <strong>{percentage(item.value)}</strong>
      </button>)}
    </div>

    <p className="demographics-note">If A.I. estimate is wrong, select the correct one.</p>
    <button className="demographics-retake" type="button" onClick={onRetake}>TEST ANOTHER PORTRAIT</button>
  </div>;
}
