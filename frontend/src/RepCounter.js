import React, { useRef, useState, useEffect } from 'react';

function RepCounter({ user }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [reps, setReps] = useState(0);
  const [stage, setStage] = useState('');
  const [cameraOn, setCameraOn] = useState(false);
  const [exercise, setExercise] = useState('squat');
  const [feedback, setFeedback] = useState('');
  const intervalRef = useRef(null);
  const repsRef = useRef(0);
  const stageRef = useRef('');

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
    setCameraOn(true);
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(t => t.stop());
    }
    if (intervalRef.current) clearInterval(intervalRef.current);
    setCameraOn(false);
    setStage('');
    setFeedback('');
  };

  const resetReps = () => {
    repsRef.current = 0;
    setReps(0);
    stageRef.current = '';
    setStage('');
  };

  useEffect(() => {
    if (cameraOn) {
      intervalRef.current = setInterval(async () => {
        if (!videoRef.current || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const video = videoRef.current;
        if (video.readyState < 2) return;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);

        canvas.toBlob(async (blob) => {
          if (!blob) return;
          const formData = new FormData();
          formData.append('file', blob, 'frame.jpg');
          formData.append('exercise', exercise);

          try {
            const res = await fetch('http://127.0.0.1:8000/count-rep', {
              method: 'POST',
              body: formData,
            });
            const data = await res.json();
            if (!data.detected) {
              setFeedback('Body detect nahi hui — camera ke saamne aao');
              return;
            }

            const newStage = data.stage;
            const prevStage = stageRef.current;

            if (prevStage === 'down' && newStage === 'up') {
              repsRef.current += 1;
              setReps(repsRef.current);
            }

            stageRef.current = newStage;
            setStage(newStage);
            setFeedback(data.feedback);
          } catch (e) {
            console.error(e);
          }
        }, 'image/jpeg');
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [cameraOn, exercise]);

  const exercises = [
    { id: 'squat', label: 'Squat' },
    { id: 'pushup', label: 'Push Up' },
    { id: 'curl', label: 'Bicep Curl' },
  ];

  return (
    <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', marginBottom: '20px' }}>
      <h2 style={{ color: '#2d6a4f', margin: '0 0 4px', fontSize: '18px' }}>Rep Counter</h2>
      <p style={{ color: '#888', marginBottom: '16px', fontSize: '13px' }}>Camera se automatic reps count hoge</p>

      {/* Exercise selector */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {exercises.map(ex => (
          <button key={ex.id}
            onClick={() => { setExercise(ex.id); resetReps(); }}
            style={{
              padding: '8px 16px', borderRadius: '20px', border: 'none',
              background: exercise === ex.id ? '#2d6a4f' : '#f0f4f0',
              color: exercise === ex.id ? '#fff' : '#555',
              cursor: 'pointer', fontSize: '13px', fontWeight: exercise === ex.id ? 'bold' : 'normal'
            }}>
            {ex.label}
          </button>
        ))}
      </div>

      {/* Rep count display */}
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <div style={{ fontSize: '72px', fontWeight: 'bold', color: '#2d6a4f', lineHeight: 1 }}>{reps}</div>
        <div style={{ fontSize: '14px', color: '#888', marginTop: '4px' }}>REPS</div>
        {stage && (
          <div style={{ marginTop: '8px', padding: '4px 16px', borderRadius: '20px', display: 'inline-block', background: stage === 'up' ? '#d8f3dc' : '#fff3cd', color: stage === 'up' ? '#1b4332' : '#856404', fontSize: '13px', fontWeight: 'bold' }}>
            {stage === 'up' ? 'UP' : 'DOWN'}
          </div>
        )}
      </div>

      {/* Camera */}
      <video ref={videoRef} autoPlay style={{ width: '100%', borderRadius: '10px', border: '2px solid #b7e4c7', display: cameraOn ? 'block' : 'none' }} />
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Feedback */}
      {feedback && (
        <div style={{ margin: '12px 0', padding: '10px 14px', borderRadius: '8px', background: '#f0f4f0', fontSize: '13px', color: '#555' }}>
          {feedback}
        </div>
      )}

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
        {!cameraOn ? (
          <button onClick={startCamera} style={{ flex: 1, background: '#2d6a4f', color: '#fff', padding: '12px', borderRadius: '8px', border: 'none', fontSize: '14px', cursor: 'pointer' }}>
            Start Counting
          </button>
        ) : (
          <button onClick={stopCamera} style={{ flex: 1, background: '#e63946', color: '#fff', padding: '12px', borderRadius: '8px', border: 'none', fontSize: '14px', cursor: 'pointer' }}>
            Stop
          </button>
        )}
        <button onClick={resetReps} style={{ padding: '12px 20px', borderRadius: '8px', border: '1px solid #ddd', background: '#fff', color: '#555', cursor: 'pointer', fontSize: '14px' }}>
          Reset
        </button>
      </div>
    </div>
  );
}

export default RepCounter;