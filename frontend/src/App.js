import React, { useState, useEffect } from 'react';
import RepCounter from './RepCounter';
import QREntry from './QREntry';
import FaceEntry from './FaceEntry';
import Onboarding from './Onboarding';

function App() {
  const savedUser = localStorage.getItem('fitsense_user');
  const [user, setUser] = useState(savedUser ? JSON.parse(savedUser) : null);
  const [showCamera, setShowCamera] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [angle, setAngle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [dietPlan, setDietPlan] = useState(null);
  const [planLoading, setPlanLoading] = useState(false);
  const videoRef = React.useRef(null);
  const canvasRef = React.useRef(null);

  useEffect(() => {
    if (user) fetchPlans();
  }, [user]);

  const fetchPlans = async () => {
    setPlanLoading(true);
    try {
      const [workoutRes, dietRes] = await Promise.all([
        fetch('http://127.0.0.1:8000/workout-plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(user)
        }),
        fetch('http://127.0.0.1:8000/diet-plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(user)
        })
      ]);
      const workout = await workoutRes.json();
      const diet = await dietRes.json();
      setWorkoutPlan(workout);
      setDietPlan(diet);
    } catch (e) {
      console.error(e);
    }
    setPlanLoading(false);
  };

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
    setShowCamera(true);
  };

  const analyzePose = async () => {
    setLoading(true);
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append('file', blob, 'pose.jpg');
      const res = await fetch('http://127.0.0.1:8000/analyze-pose', {
        method: 'POST', body: formData,
      });
      const data = await res.json();
      setLoading(false);
      if (data.detected) { setFeedback(data.feedback); setAngle(data.knee_angle); }
      else { setFeedback(data.feedback); setAngle(null); }
    }, 'image/jpeg');
  };

  if (!user) return <Onboarding onComplete={(data) => setUser(data)} />;

  return (
    <div style={{ fontFamily: 'Arial', background: '#f0f4f0', minHeight: '100vh', padding: '0 0 40px' }}>

      {/* Header */}
      <div style={{ background: '#2d6a4f', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold' }}>FitSense AI</div>
          <div style={{ color: '#b7e4c7', fontSize: '13px' }}>Welcome back, {user.name}!</div>
        </div>
        <div style={{ background: '#1b4332', padding: '6px 14px', borderRadius: '20px', color: '#b7e4c7', fontSize: '12px' }}>
          {user.goal} • {user.level}
        </div>
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px 16px' }}>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {[
            { label: 'Weight', value: user.weight + ' kg' },
            { label: 'Height', value: user.height + ' cm' },
            { label: 'Diet', value: user.diet },
            { label: 'Age', value: user.age + ' yrs' },
          ].map(({ label, value }) => (
            <div key={label} style={{ background: '#fff', padding: '12px 16px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', flex: '1', textAlign: 'center', minWidth: '80px' }}>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#2d6a4f' }}>{value}</div>
              <div style={{ fontSize: '11px', color: '#888' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Workout Plan */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h2 style={{ color: '#2d6a4f', margin: 0, fontSize: '18px' }}>Today's Workout</h2>
            <button onClick={fetchPlans} style={{ background: '#f0f4f0', border: 'none', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', fontSize: '12px', color: '#2d6a4f' }}>
              Refresh
            </button>
          </div>

          {planLoading ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#888' }}>AI plan generate kar raha hai...</div>
          ) : workoutPlan ? (
            <div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
                <span style={{ background: '#d8f3dc', color: '#1b4332', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>{workoutPlan.day}</span>
                <span style={{ background: '#f0f4f0', color: '#555', padding: '4px 12px', borderRadius: '20px', fontSize: '13px' }}>{workoutPlan.duration}</span>
                <span style={{ background: '#fff3cd', color: '#856404', padding: '4px 12px', borderRadius: '20px', fontSize: '13px' }}>{workoutPlan.calories}</span>
              </div>
              {workoutPlan.exercises && workoutPlan.exercises.map((ex, i) => (
                <div key={i} style={{ background: '#f8f8f8', borderRadius: '10px', padding: '12px 14px', marginBottom: '8px', borderLeft: '3px solid #2d6a4f' }}>
                  <div style={{ fontWeight: 'bold', color: '#1b4332', fontSize: '14px' }}>{ex.name}</div>
                  <div style={{ color: '#555', fontSize: '13px', marginTop: '2px' }}>
                    {ex.sets} sets × {ex.reps} reps • Rest: {ex.rest}
                  </div>
                  <div style={{ color: '#888', fontSize: '12px', marginTop: '2px', fontStyle: 'italic' }}>Tip: {ex.tip}</div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: '#aaa' }}>Plan load nahi hua — Refresh karo</div>
          )}
        </div>

        {/* Diet Plan */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', marginBottom: '20px' }}>
          <h2 style={{ color: '#2d6a4f', margin: '0 0 14px', fontSize: '18px' }}>Today's Indian Diet Plan</h2>

          {planLoading ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#888' }}>AI diet plan bana raha hai...</div>
          ) : dietPlan ? (
            <div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
                <span style={{ background: '#fff3cd', color: '#856404', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>{dietPlan.calories}</span>
                <span style={{ background: '#d8f3dc', color: '#1b4332', padding: '4px 12px', borderRadius: '20px', fontSize: '13px' }}>Protein: {dietPlan.protein}</span>
              </div>
              {dietPlan.meals && dietPlan.meals.map((meal, i) => (
                <div key={i} style={{ background: '#f8f8f8', borderRadius: '10px', padding: '12px 14px', marginBottom: '8px', borderLeft: '3px solid #f4a261' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ fontWeight: 'bold', color: '#1b4332', fontSize: '14px' }}>{meal.meal}</div>
                    <div style={{ color: '#888', fontSize: '12px' }}>{meal.time}</div>
                  </div>
                  <div style={{ color: '#555', fontSize: '13px', marginTop: '4px' }}>{meal.food}</div>
                  <div style={{ color: '#f4a261', fontSize: '12px', marginTop: '2px', fontWeight: 'bold' }}>{meal.calories}</div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: '#aaa' }}>Plan load nahi hua — Refresh karo</div>
          )}
        </div>

{/* Rep Counter */}
<RepCounter user={user} />
{/* QR Entry */}
<QREntry user={user} />
{/* Face Entry */}
<FaceEntry user={user} />
        {/* Form Checker */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', marginBottom: '20px' }}>
          <h2 style={{ color: '#2d6a4f', margin: '0 0 4px', fontSize: '18px' }}>AI Form Checker</h2>
          <p style={{ color: '#888', marginBottom: '14px', fontSize: '13px' }}>Check your squat form in real time</p>

          <video ref={videoRef} autoPlay style={{ width: '100%', borderRadius: '10px', border: '2px solid #b7e4c7' }} />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          <br /><br />

          {!showCamera ? (
            <button onClick={startCamera} style={{ background: '#2d6a4f', color: '#fff', padding: '12px 28px', borderRadius: '8px', border: 'none', fontSize: '15px', cursor: 'pointer', width: '100%' }}>
              Camera On Karo
            </button>
          ) : (
            <button onClick={analyzePose} disabled={loading} style={{ background: '#1b4332', color: '#fff', padding: '12px 28px', borderRadius: '8px', border: 'none', fontSize: '15px', cursor: 'pointer', width: '100%' }}>
              {loading ? 'Analyzing...' : 'Squat Analyze Karo'}
            </button>
          )}

          {feedback && (
            <div style={{ marginTop: '16px', padding: '16px', borderRadius: '12px', background: feedback.includes('Perfect') ? '#d8f3dc' : '#fff3cd', border: `2px solid ${feedback.includes('Perfect') ? '#2d6a4f' : '#ffc107'}` }}>
              <div style={{ fontSize: '17px', fontWeight: 'bold', color: '#1b4332' }}>{feedback}</div>
              {angle && <div style={{ color: '#555', marginTop: '4px', fontSize: '14px' }}>Knee Angle: {angle}°</div>}
            </div>
          )}
        </div>

        {/* Reset */}
        <button onClick={() => { localStorage.removeItem('fitsense_user'); setUser(null); }}
          style={{ background: 'transparent', border: '1px solid #ccc', color: '#aaa', padding: '8px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', width: '100%' }}>
          Reset Profile
        </button>

      </div>
    </div>
  );
}

export default App;