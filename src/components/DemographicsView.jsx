import React, { useState } from 'react';

export default function DemographicsView({ data, userDetails, onRetake, onNext }) {
  const sortPredictions = (values) => 
    Object.entries(values || {})
      .map(([key, value]) => ({ key, value: Number(value) || 0 }))
      .sort((a, b) => b.value - a.value);

  // Safely extract predictions with fallback empty objects
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

  // SVG dash calculation for radius 42 (Circumference ~264)
  const circumference = 264;
  const strokeDashoffset = circumference - (circumference * (activePrediction.value || 0));

  const choosePrediction = (item) => {
    setSelected((current) => ({ ...current, [activeType]: item }));
  };

  return (
    <div className="demographics-reference">
      {/* Sidebar navigation for switching metrics */}
      <div className="demographics-sidebar">
        {Object.keys(labels).map((type) => {
          const item = selected[type] || predictions[type][0] || { key: 'Unknown' };
          return (
            <button 
              className={activeType === type ? 'active' : ''} 
              type="button" 
              key={type} 
              onClick={() => setActiveType(type)}
            >
              <strong>{formatLabel(item.key)}</strong>
              <span>{labels[type]}</span>
            </button>
          );
        })}
      </div>

      {/* Main active display with SVG Ring */}
      <div className="demographics-main flex flex-col items-center justify-center">
        <h2>{formatLabel(activePrediction.key)}</h2>
        
        <div className="relative flex items-center justify-center w-64 h-64 my-2">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background Track */}
            <circle 
              cx="50" cy="50" r="42" 
              className="stroke-zinc-200" 
              strokeWidth="3" 
              fill="transparent" 
            />
            {/* Dynamic Progress Arc with rounded ends */}
            <circle 
              cx="50" cy="50" r="42" 
              className="stroke-zinc-900 transition-all duration-700 ease-out" 
              strokeWidth="3" 
              strokeLinecap="round" 
              fill="transparent" 
              strokeDasharray={circumference} 
              strokeDashoffset={strokeDashoffset} 
            />
          </svg>
          
          {/* Centered Label */}
          <div className="absolute flex items-center justify-center text-center">
            <span className="text-5xl font-light tracking-tight text-zinc-900">{percentage}</span>
          </div>
        </div>
      </div>

      {/* Breakdown list for current metric */}
      <div className="demographics-list">
        <div className="demographics-list-header">
          <span>{labels[activeType]}</span>
          <span>A.I. CONFIDENCE</span>
        </div>
        {activeList.map((item) => (
          <button 
            className={activePrediction.key === item.key ? 'selected' : ''} 
            type="button" 
            key={item.key} 
            onClick={() => choosePrediction(item)}
          >
            <span className="demographics-bullet">◇</span>
            <span>{formatLabel(item.key)}</span>
            <strong>{Math.round(item.value * 100)}%</strong>
          </button>
        ))}
      </div>

      <p className="demographics-note">If A.I. estimate is wrong, select the correct one.</p>
      <button className="demographics-retake" type="button" onClick={onRetake}>
        TEST ANOTHER PORTRAIT
      </button>
    </div>
  );
}