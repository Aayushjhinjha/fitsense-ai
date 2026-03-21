import React, { useState } from 'react';

function FeesManager({ user }) {
  const [members, setMembers] = useState([
    { id: 'M001', name: 'Rahul Sharma', phone: '9876543210', plan: 'Monthly', amount: 1500, paid: true, paidDate: '2026-03-01', expiry: '2026-03-31', daysLeft: 10 },
    { id: 'M002', name: 'Priya Singh', phone: '9876543211', plan: 'Quarterly', amount: 3500, paid: true, paidDate: '2026-02-15', expiry: '2026-05-15', daysLeft: 55 },
    { id: 'M003', name: 'Amit Kumar', phone: '9876543212', plan: 'Monthly', amount: 1500, paid: false, paidDate: null, expiry: '2026-02-28', daysLeft: -20 },
    { id: 'M004', name: 'Neha Gupta', phone: '9876543213', plan: 'Monthly', amount: 1500, paid: false, paidDate: null, expiry: '2026-03-25', daysLeft: 4 },
  ]);

  const [view, setView] = useState('overview');
  const [selectedMember, setSelectedMember] = useState(null);
  const [paymentDone, setPaymentDone] = useState(null);

  const totalRevenue = members.filter(m => m.paid).reduce((sum, m) => sum + m.amount, 0);
  const totalDue = members.filter(m => !m.paid).reduce((sum, m) => sum + m.amount, 0);
  const activeMembers = members.filter(m => m.paid).length;
  const expiringSoon = members.filter(m => m.daysLeft <= 7 && m.daysLeft >= 0).length;

  const markPaid = (memberId) => {
    setMembers(prev => prev.map(m => {
      if (m.id === memberId) {
        return { ...m, paid: true, paidDate: new Date().toISOString().split('T')[0] };
      }
      return m;
    }));
    setPaymentDone(memberId);
    setTimeout(() => setPaymentDone(null), 3000);
  };

  const sendReminder = (member) => {
    alert(`Reminder sent to ${member.name} (${member.phone})!\nMessage: "Dear ${member.name}, your gym membership is due. Please pay ₹${member.amount} to continue. Contact us for payment."`);
  };

  return (
    <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', marginBottom: '20px' }}>
      <h2 style={{ color: '#2d6a4f', margin: '0 0 4px', fontSize: '18px' }}>Fees & Payment Manager</h2>
      <p style={{ color: '#888', marginBottom: '16px', fontSize: '13px' }}>Member fees track karo, payments record karo</p>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
        {[
          { label: 'Total Collected', value: `₹${totalRevenue.toLocaleString()}`, color: '#d8f3dc', textColor: '#1b4332' },
          { label: 'Total Due', value: `₹${totalDue.toLocaleString()}`, color: '#ffe0e0', textColor: '#c00' },
          { label: 'Active Members', value: activeMembers, color: '#e8f4ff', textColor: '#185FA5' },
          { label: 'Expiring Soon', value: expiringSoon, color: '#fff3cd', textColor: '#856404' },
        ].map(stat => (
          <div key={stat.label} style={{ background: stat.color, borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '22px', fontWeight: 'bold', color: stat.textColor }}>{stat.value}</div>
            <div style={{ fontSize: '11px', color: stat.textColor, opacity: 0.8 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {['overview', 'due', 'paid'].map(tab => (
          <button key={tab} onClick={() => setView(tab)}
            style={{ padding: '7px 14px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: view === tab ? 'bold' : 'normal', background: view === tab ? '#2d6a4f' : '#f0f4f0', color: view === tab ? '#fff' : '#555' }}>
            {tab === 'overview' ? 'All Members' : tab === 'due' ? 'Due Payments' : 'Paid'}
          </button>
        ))}
      </div>

      {/* Payment success message */}
      {paymentDone && (
        <div style={{ padding: '12px', borderRadius: '10px', background: '#d8f3dc', border: '2px solid #2d6a4f', marginBottom: '12px', textAlign: 'center', fontSize: '14px', fontWeight: 'bold', color: '#1b4332' }}>
          Payment recorded successfully!
        </div>
      )}

      {/* Members list */}
      {members
        .filter(m => {
          if (view === 'due') return !m.paid;
          if (view === 'paid') return m.paid;
          return true;
        })
        .map(member => (
          <div key={member.id} style={{ background: '#f8f8f8', borderRadius: '12px', padding: '14px', marginBottom: '10px', border: `1.5px solid ${!member.paid ? '#ffcccc' : member.daysLeft <= 7 ? '#ffe0a0' : '#e0f0e0'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div>
                <div style={{ fontWeight: 'bold', color: '#1b4332', fontSize: '14px' }}>{member.name}</div>
                <div style={{ fontSize: '12px', color: '#888' }}>{member.phone} • {member.plan} Plan</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 'bold', fontSize: '16px', color: member.paid ? '#1b4332' : '#c00' }}>₹{member.amount}</div>
                <span style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: 'bold', background: member.paid ? '#d8f3dc' : '#ffe0e0', color: member.paid ? '#1b4332' : '#c00' }}>
                  {member.paid ? 'PAID' : 'DUE'}
                </span>
              </div>
            </div>

            <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>
              {member.paid ? `Paid on: ${member.paidDate}` : 'Payment pending'} • Expiry: {member.expiry}
              {member.daysLeft < 0 && <span style={{ color: '#c00', fontWeight: 'bold' }}> (Expired {Math.abs(member.daysLeft)} days ago)</span>}
              {member.daysLeft >= 0 && member.daysLeft <= 7 && <span style={{ color: '#856404', fontWeight: 'bold' }}> (Expires in {member.daysLeft} days!)</span>}
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              {!member.paid && (
                <button onClick={() => markPaid(member.id)}
                  style={{ flex: 1, background: '#2d6a4f', color: '#fff', padding: '8px', borderRadius: '8px', border: 'none', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Mark as Paid
                </button>
              )}
              <button onClick={() => sendReminder(member)}
                style={{ flex: 1, background: '#f0f4f0', color: '#555', padding: '8px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '12px', cursor: 'pointer' }}>
                Send Reminder
              </button>
            </div>
          </div>
        ))}

      {members.filter(m => view === 'due' ? !m.paid : view === 'paid' ? m.paid : true).length === 0 && (
        <div style={{ textAlign: 'center', padding: '20px', color: '#aaa', fontSize: '13px' }}>
          Koi record nahi mila
        </div>
      )}
    </div>
  );
}

export default FeesManager;