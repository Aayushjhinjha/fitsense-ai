import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

function QREntry({ user }) {
  const [members, setMembers] = useState([
    { id: 'M001', name: 'Rahul Sharma', membership: 'active', expiry: '2026-06-30' },
    { id: 'M002', name: 'Priya Singh', membership: 'active', expiry: '2026-05-15' },
    { id: 'M003', name: 'Amit Kumar', membership: 'expired', expiry: '2026-02-28' },
  ]);
  const [scanning, setScanning] = useState(false);
  const [scannedMember, setScannedMember] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [view, setView] = useState('members');

  const simulateScan = (member) => {
    setScannedMember(member);
    if (member.membership === 'active') {
      const entry = {
        id: member.id,
        name: member.name,
        time: new Date().toLocaleTimeString(),
        date: new Date().toLocaleDateString(),
        status: 'Entry Allowed'
      };
      setAttendance(prev => [entry, ...prev]);
    }
    setTimeout(() => setScannedMember(null), 3000);
  };

  return (
    <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', marginBottom: '20px' }}>
      <h2 style={{ color: '#2d6a4f', margin: '0 0 4px', fontSize: '18px' }}>QR Entry System</h2>
      <p style={{ color: '#888', marginBottom: '16px', fontSize: '13px' }}>Member QR codes aur attendance tracking</p>

      {/* Tab buttons */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {['members', 'scan', 'attendance'].map(tab => (
          <button key={tab} onClick={() => setView(tab)}
            style={{ padding: '8px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: view === tab ? 'bold' : 'normal', background: view === tab ? '#2d6a4f' : '#f0f4f0', color: view === tab ? '#fff' : '#555' }}>
            {tab === 'members' ? 'Members' : tab === 'scan' ? 'Scan Entry' : 'Attendance'}
          </button>
        ))}
      </div>

      {/* Members View */}
      {view === 'members' && (
        <div>
          <p style={{ fontSize: '13px', color: '#888', marginBottom: '12px' }}>Har member ka QR code — gym entry ke liye</p>
          {members.map(member => (
            <div key={member.id} onClick={() => setSelectedMember(selectedMember?.id === member.id ? null : member)}
              style={{ background: '#f8f8f8', borderRadius: '10px', padding: '14px', marginBottom: '10px', cursor: 'pointer', border: `2px solid ${selectedMember?.id === member.id ? '#2d6a4f' : '#eee'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#1b4332', fontSize: '14px' }}>{member.name}</div>
                  <div style={{ fontSize: '12px', color: '#888' }}>ID: {member.id} • Expiry: {member.expiry}</div>
                </div>
                <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', background: member.membership === 'active' ? '#d8f3dc' : '#ffe0e0', color: member.membership === 'active' ? '#1b4332' : '#c00' }}>
                  {member.membership === 'active' ? 'Active' : 'Expired'}
                </span>
              </div>

              {selectedMember?.id === member.id && (
                <div style={{ marginTop: '14px', textAlign: 'center' }}>
                  <QRCodeSVG value={`FITSENSE-${member.id}-${member.name}`} size={140} fgColor="#1b4332" />
                  <div style={{ fontSize: '12px', color: '#888', marginTop: '6px' }}>Yeh QR scan karo gym entry ke liye</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Scan View */}
      {view === 'scan' && (
        <div>
          <p style={{ fontSize: '13px', color: '#888', marginBottom: '16px' }}>Member select karo — simulate scan karo</p>

          {scannedMember && (
            <div style={{ padding: '16px', borderRadius: '12px', marginBottom: '16px', background: scannedMember.membership === 'active' ? '#d8f3dc' : '#ffe0e0', border: `2px solid ${scannedMember.membership === 'active' ? '#2d6a4f' : '#c00'}`, textAlign: 'center' }}>
              <div style={{ fontSize: '24px' }}>{scannedMember.membership === 'active' ? '✓' : '✗'}</div>
              <div style={{ fontWeight: 'bold', fontSize: '16px', color: scannedMember.membership === 'active' ? '#1b4332' : '#c00' }}>
                {scannedMember.membership === 'active' ? `Welcome, ${scannedMember.name}!` : `Entry Denied — ${scannedMember.name}`}
              </div>
              <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
                {scannedMember.membership === 'active' ? 'Attendance marked' : 'Membership expired — please renew'}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {members.map(member => (
              <button key={member.id} onClick={() => simulateScan(member)}
                style={{ padding: '14px', borderRadius: '10px', border: '1px solid #ddd', background: '#f8f8f8', cursor: 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#1b4332', fontSize: '14px' }}>{member.name}</div>
                  <div style={{ fontSize: '12px', color: '#888' }}>Click to simulate QR scan</div>
                </div>
                <span style={{ fontSize: '20px' }}>📱</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Attendance View */}
      {view === 'attendance' && (
        <div>
          <p style={{ fontSize: '13px', color: '#888', marginBottom: '12px' }}>Aaj ki attendance — {attendance.length} entries</p>
          {attendance.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: '#aaa', fontSize: '13px' }}>
              Abhi koi entry nahi — Scan tab mein karo
            </div>
          ) : (
            attendance.map((entry, i) => (
              <div key={i} style={{ background: '#f8f8f8', borderRadius: '10px', padding: '12px 14px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#1b4332', fontSize: '13px' }}>{entry.name}</div>
                  <div style={{ fontSize: '12px', color: '#888' }}>{entry.date} • {entry.time}</div>
                </div>
                <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', background: '#d8f3dc', color: '#1b4332' }}>
                  {entry.status}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default QREntry;