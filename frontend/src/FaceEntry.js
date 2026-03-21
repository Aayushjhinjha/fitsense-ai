import React, { useRef, useState, useEffect } from 'react';
import * as faceapi from 'face-api.js';

function FaceEntry({ user }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef(null);

  const members = [
    { id: 'M001', name: 'Rahul Sharma', membership: 'active' },
    { id: 'M002', name: 'Priya Singh', membership: 'active' },
    { id: 'M003', name: 'Amit Kumar', membership: 'expired' },
  ];

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    setLoading(true);
    try {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
      ]);
      setModelsLoaded(true);
    } catch (e) {
      console.log('Models load error:', e);
    }
    setLoading(false);
  };

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
    setCameraOn(true);
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(t => t.stop());
    }
    if (intervalRef.current) clearInterval(intervalRef.current);
    setCameraOn(false);
    setScanning(false);
    setResult(null);
  };

  const simulateFaceScan = () => {
    setScanning(true);
    setResult(null);

    setTimeout(() => {
      const randomMember = members[Math.floor(Math.random() * members.length)];
      const entry = {
        name: randomMember.name,
        membership: randomMember.membership,
        time: new Date().toLocaleTimeString(),
        date: new Date().toLocaleDateString(),
      };

      setResult(entry);
      setScanning(false);

      if (randomMember.membership === 'active') {
        setAttendance(prev => [entry, ...prev]);
      }
    }, 2000);
  };

  return (
    <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', marginBottom: '20px' }}>
      <h2 style={{ color: '#2d6a4f', margin: '0 0 4px', fontSize: '18px' }}>Face Recognition Entry</h2>
      <p style={{ color: '#888', marginBottom: '16px', fontSize: '13px' }}>Camera se chehra scan karo — automatic entry</p>

      {/* Status bar */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', background: modelsLoaded ? '#d8f3dc' : '#fff3cd', color: modelsLoaded ? '#1b4332' : '#856404' }}>
          {loading ? 'AI Models Loading...' : modelsLoaded ? 'AI Ready' : 'Models Not Loaded'}
        </span>
        <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', background: cameraOn ? '#d8f3dc' : '#f0f4f0', color: cameraOn ? '#1b4332' : '#555' }}>
          {cameraOn ? 'Camera On' : 'Camera Off'}
        </span>
      </div>

      {/* Camera feed */}
      <div style={{ position: 'relative', marginBottom: '16px' }}>
        <video ref={videoRef} autoPlay style={{ width: '100%', borderRadius: '10px', border: '2px solid #b7e4c7', display: cameraOn ? 'block' : 'none' }} />
        <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, display: cameraOn ? 'block' : 'none' }} />

        {!cameraOn && (
          <div style={{ background: '#f0f4f0', borderRadius: '10px', padding: '40px', textAlign: 'center', color: '#aaa' }}>
            Camera band hai — Start karo
          </div>
        )}
      </div>

      {/* Scan result */}
      {scanning && (
        <div style={{ padding: '16px', borderRadius: '12px', background: '#f0f4f0', textAlign: 'center', marginBottom: '16px' }}>
          <div style={{ fontSize: '14px', color: '#555' }}>Chehra scan ho raha hai...</div>
        </div>
      )}

      {result && !scanning && (
        <div style={{ padding: '16px', borderRadius: '12px', marginBottom: '16px', background: result.membership === 'active' ? '#d8f3dc' : '#ffe0e0', border: `2px solid ${result.membership === 'active' ? '#2d6a4f' : '#c00'}`, textAlign: 'center' }}>
          <div style={{ fontSize: '28px' }}>{result.membership === 'active' ? '✓' : '✗'}</div>
          <div style={{ fontWeight: 'bold', fontSize: '16px', color: result.membership === 'active' ? '#1b4332' : '#c00', marginTop: '4px' }}>
            {result.membership === 'active' ? `Welcome, ${result.name}!` : `Entry Denied — ${result.name}`}
          </div>
          <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
            {result.membership === 'active' ? 'Attendance marked automatically' : 'Membership expired — please renew'}
          </div>
        </div>
      )}

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {!cameraOn ? (
          <button onClick={startCamera} style={{ flex: 1, background: '#2d6a4f', color: '#fff', padding: '12px', borderRadius: '8px', border: 'none', fontSize: '14px', cursor: 'pointer' }}>
            Camera Start Karo
          </button>
        ) : (
          <>
            <button onClick={simulateFaceScan} disabled={scanning} style={{ flex: 1, background: '#185FA5', color: '#fff', padding: '12px', borderRadius: '8px', border: 'none', fontSize: '14px', cursor: 'pointer' }}>
              {scanning ? 'Scanning...' : 'Face Scan Karo'}
            </button>
            <button onClick={stopCamera} style={{ padding: '12px 20px', borderRadius: '8px', border: '1px solid #ddd', background: '#fff', color: '#555', cursor: 'pointer', fontSize: '14px' }}>
              Stop
            </button>
          </>
        )}
      </div>

      {/* Attendance log */}
      {attendance.length > 0 && (
        <div>
          <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#2d6a4f', marginBottom: '8px' }}>
            Face Scan Attendance — {attendance.length} entries
          </div>
          {attendance.map((entry, i) => (
            <div key={i} style={{ background: '#f8f8f8', borderRadius: '10px', padding: '10px 14px', marginBottom: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 'bold', color: '#1b4332', fontSize: '13px' }}>{entry.name}</div>
                <div style={{ fontSize: '12px', color: '#888' }}>{entry.date} • {entry.time}</div>
              </div>
              <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', background: '#d8f3dc', color: '#1b4332' }}>
                Entry Allowed
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FaceEntry;