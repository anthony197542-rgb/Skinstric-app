import React, { useState } from 'react';

export default function DemographicsView({ data, userDetails, onRetake, onBack, onHome }) {
  const sortPredictions = (values) =>
    Object.entries(values || {})
      .map(([key, value]) => ({ key, value: Number(value) || 0 }))
      .sort((a, b) => b.value - a.value);

  const predictions = {
    race: sortPredictions(data?.race || data?.skin_tone || data?.skinTone || {}),
    age: sortPredictions(data?.age || data?.age_bracket || data?.ageBracket || {}),
    gender: sortPredictions(data?.gender || data?.sex || {}),
  };

  const labels = { race: 'RACE', age: 'AGE', gender: 'SEX' };

  const [activeType, setActiveType] = useState('race');
  const [selected, setSelected] = useState({
    race: predictions.race[0] || { key: 'Unknown', value: 0 },
    age: predictions.age[0] || { key: 'Unknown', value: 0 },
    gender: predictions.gender[0] || { key: 'Unknown', value: 0 },
  });

  const activePrediction = selected[activeType] || predictions[activeType][0] || { key: 'Unknown', value: 0 };
  const activeList = predictions[activeType] || [];

  const formatLabel = (value) =>
    String(value || '').replace(/[-_]/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());

  const rawPercentage = Math.round((activePrediction.value || 0) * 100);
  const percentage = `${rawPercentage}%`;

  const circumference = 264;
  const strokeDashoffset = circumference - (circumference * (activePrediction.value || 0));

  const choosePrediction = (item) => {
    setSelected((current) => ({ ...current, [activeType]: item }));
  };

  return (
    <div className="demographics-page">
      <div>
        <div className="demographics-layout">

          <div className="demographics-sidebar">
            {Object.keys(labels).map((type) => {
              const item = selected[type] || predictions[type][0] || { key: 'Unknown' };
              const isActive = activeType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setActiveType(type)}
                  className={`demographics-tab ${isActive ? 'active' : ''}`}
                >
                  <strong>{formatLabel(item.key)}</strong>
                  <span>{labels[type]}</span>
                </button>
              );
            })}
          </div>

          <div className="demographics-main">
            <span className="demographics-eyebrow">{labels[activeType]} / A.I. ESTIMATE</span>
            <h2>{formatLabel(activePrediction.key)}</h2>

            <div className="demographics-score">
              <svg viewBox="0 0 100 100" aria-label={`${percentage} confidence`}>
                <circle cx="50" cy="50" r="42" className="score-track" />
                <circle
                  cx="50" cy="50" r="42"
                  className="score-value"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                />
              </svg>
              <span className="demographics-percentage">{percentage}</span>
            </div>
            <p className="demographics-caption">Confidence in the selected prediction</p>
          </div>

          <div className="demographics-list">
            <div className="demographics-list-header">
              <span>{labels[activeType]}</span>
              <span>A.I. CONFIDENCE</span>
            </div>

            {activeList.map((item) => {
              const isSelected = activePrediction.key === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => choosePrediction(item)}
                  className={`demographics-prediction ${isSelected ? 'selected' : ''}`}
                >
                  <span><i aria-hidden="true">◇</i>{formatLabel(item.key)}</span>
                  <strong>{Math.round(item.value * 100)}%</strong>
                </button>
              );
            })}
          </div>

        </div>

        <div className="demographics-retake">
          <p>If A.I. estimate is wrong, select the correct one.</p>
          <button
            type="button"
            onClick={onRetake}
            className="demographics-retake-button"
          >
            TEST ANOTHER PORTRAIT
          </button>
        </div>
      </div>

      <div className="demographics-footer">
        <button type="button" onClick={onBack}>
          ◄ Back
        </button>

        <button type="button" onClick={onHome}>
          Home ►
        </button>
      </div>

    </div>
  );
}