import React, { useState } from 'react';

function Onboarding({ onComplete }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    weight: '',
    height: '',
    goal: '',
    level: '',
    diet: ''
  });

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep(prev => prev + 1);

  const finish = () => {
    localStorage.setItem('fitsense_user', JSON.stringify(formData));
    onComplete(formData);
  };

  const cardStyle = (selected, color) => ({
    padding: '14px 20px',
    borderRadius: '10px',
    border: `2px solid ${selected ? color : '#ddd'}`,
    background: selected ? color + '22' : '#fff',
    cursor: 'pointer',
    margin: '6px',
    fontWeight: selected ? 'bold' : 'normal',
    color: selected ? color : '#333',
    transition: 'all 0.2s',
    fontSize: '14px',
  });

  const containerStyle = {
    maxWidth: '480px',
    margin: '40px auto',
    padding: '30px',
    fontFamily: 'Arial',
    borderRadius: '16px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
    background: '#fff',
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1.5px solid #ddd',
    fontSize: '15px',
    marginTop: '6px',
    outline: 'none',
  };

  const btnStyle = {
    background: '#2d6a4f',
    color: '#fff',
    padding: '13px 32px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '15px',
    cursor: 'pointer',
    marginTop: '20px',
    width: '100%',
  };

  const progressStyle = {
    display: 'flex',
    gap: '8px',
    justifyContent: 'center',
    marginBottom: '24px',
  };

  return (
    <div style={containerStyle}>

      {/* Progress dots */}
      <div style={progressStyle}>
        {[1,2,3,4].map(s => (
          <div key={s} style={{
            width: '10px', height: '10px', borderRadius: '50%',
            background: s <= step ? '#2d6a4f' : '#ddd',
            transition: 'background 0.3s'
          }} />
        ))}
      </div>

      {/* Step 1 - Basic Info */}
      {step === 1 && (
        <div>
          <h2 style={{ color: '#2d6a4f', marginBottom: '4px' }}>Welcome to FitSense AI</h2>
          <p style={{ color: '#777', marginBottom: '20px' }}>Your personal AI gym coach. Let's set up your profile.</p>

          <label style={{ fontSize: '13px', color: '#555' }}>Your Name</label>
          <input style={inputStyle} placeholder="e.g. Rahul Sharma"
            value={formData.name}
            onChange={e => updateField('name', e.target.value)} />

          <label style={{ fontSize: '13px', color: '#555', marginTop: '14px', display: 'block' }}>Age</label>
          <input style={inputStyle} placeholder="e.g. 22" type="number"
            value={formData.age}
            onChange={e => updateField('age', e.target.value)} />

          <label style={{ fontSize: '13px', color: '#555', marginTop: '14px', display: 'block' }}>Weight (kg)</label>
          <input style={inputStyle} placeholder="e.g. 75" type="number"
            value={formData.weight}
            onChange={e => updateField('weight', e.target.value)} />

          <label style={{ fontSize: '13px', color: '#555', marginTop: '14px', display: 'block' }}>Height (cm)</label>
          <input style={inputStyle} placeholder="e.g. 175" type="number"
            value={formData.height}
            onChange={e => updateField('height', e.target.value)} />

          <button style={btnStyle}
            onClick={() => formData.name && formData.age ? nextStep() : alert('Please fill all fields')}
          >Continue →</button>
        </div>
      )}

      {/* Step 2 - Goal */}
      {step === 2 && (
        <div>
          <h2 style={{ color: '#2d6a4f', marginBottom: '4px' }}>What is your goal?</h2>
          <p style={{ color: '#777', marginBottom: '16px' }}>AI will create your plan based on this.</p>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { label: 'Weight Loss', emoji: '🔥', color: '#e63946' },
              { label: 'Muscle Gain', emoji: '💪', color: '#2d6a4f' },
              { label: 'Strength', emoji: '🏋️', color: '#533483' },
              { label: 'Maintain Fitness', emoji: '⚡', color: '#f4a261' },
            ].map(({ label, emoji, color }) => (
              <div key={label} style={cardStyle(formData.goal === label, color)}
                onClick={() => updateField('goal', label)}>
                {emoji} {label}
              </div>
            ))}
          </div>

          <button style={btnStyle}
            onClick={() => formData.goal ? nextStep() : alert('Please select a goal')}
          >Continue →</button>
        </div>
      )}

      {/* Step 3 - Level */}
      {step === 3 && (
        <div>
          <h2 style={{ color: '#2d6a4f', marginBottom: '4px' }}>Your fitness level?</h2>
          <p style={{ color: '#777', marginBottom: '16px' }}>This helps AI set the right difficulty.</p>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { label: 'Beginner', desc: 'New to gym (0-6 months)', color: '#2d6a4f' },
              { label: 'Intermediate', desc: 'Training for 6+ months', color: '#185FA5' },
              { label: 'Advanced', desc: 'Training for 2+ years', color: '#533483' },
            ].map(({ label, desc, color }) => (
              <div key={label} style={{ ...cardStyle(formData.level === label, color), width: '100%', textAlign: 'left' }}
                onClick={() => updateField('level', label)}>
                <div>{label}</div>
                <div style={{ fontSize: '12px', fontWeight: 'normal', color: '#888', marginTop: '2px' }}>{desc}</div>
              </div>
            ))}
          </div>

          <button style={btnStyle}
            onClick={() => formData.level ? nextStep() : alert('Please select your level')}
          >Continue →</button>
        </div>
      )}

      {/* Step 4 - Diet */}
      {step === 4 && (
        <div>
          <h2 style={{ color: '#2d6a4f', marginBottom: '4px' }}>Diet preference?</h2>
          <p style={{ color: '#777', marginBottom: '16px' }}>For your personalized Indian meal plan.</p>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { label: 'Vegetarian', emoji: '🥦', color: '#2d6a4f' },
              { label: 'Non-Vegetarian', emoji: '🍗', color: '#e63946' },
            ].map(({ label, emoji, color }) => (
              <div key={label} style={{ ...cardStyle(formData.diet === label, color), width: '160px', textAlign: 'center' }}
                onClick={() => updateField('diet', label)}>
                <div style={{ fontSize: '28px' }}>{emoji}</div>
                <div>{label}</div>
              </div>
            ))}
          </div>

          <button style={{ ...btnStyle, background: '#2d6a4f' }}
            onClick={() => formData.diet ? finish() : alert('Please select diet preference')}
          >Start My AI Journey 🚀</button>
        </div>
      )}

    </div>
  );
}

export default Onboarding;