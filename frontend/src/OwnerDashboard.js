import React, { useState } from 'react';

function OwnerDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  const stats = {
    totalMembers: 47,
    activeMembers: 38,
    monthlyRevenue: 62500,
    totalDue: 9000,
    todayAttendance: 23,
    newEnquiries: 5,
    expiringSoon: 8,
    avgRating: 4.7,
  };

  const members = [
    { id: 'M001', name: 'Rahul Sharma', phone: '9876543210', plan: 'Monthly', status: 'active', joined: '2025-01-15', fees: 'paid', expiry: '2026-03-31' },
    { id: 'M002', name: 'Priya Singh', phone: '9876543211', plan: 'Quarterly', status: 'active', joined: '2025-03-20', fees: 'paid', expiry: '2026-05-15' },
    { id: 'M003', name: 'Amit Kumar', phone: '9876543212', plan: 'Monthly', status: 'expired', joined: '2025-06-10', fees: 'due', expiry: '2026-02-28' },
    { id: 'M004', name: 'Neha Gupta', phone: '9876543213', plan: 'Monthly', status: 'active', joined: '2025-08-05', fees: 'paid', expiry: '2026-03-25' },
    { id: 'M005', name: 'Vijay Patel', phone: '9876543214', plan: 'Half Yearly', status: 'active', joined: '2025-09-12', fees: 'paid', expiry: '2026-06-12' },
    { id: 'M006', name: 'Sunita Verma', phone: '9876543215', plan: 'Monthly', status: 'active', joined: '2025-11-01', fees: 'due', expiry: '2026-03-20' },
  ];

  const recentActivity = [
    { type: 'entry', name: 'Rahul Sharma', time: '10:32 AM', icon: '✓' },
    { type: 'payment', name: 'Priya Singh', time: '10:15 AM', icon: '₹' },
    { type: 'entry', name: 'Vijay Patel', time: '09:58 AM', icon: '✓' },
    { type: 'new', name: 'Arjun Mehta', time: '09:30 AM', icon: '+' },
    { type: 'entry', name: 'Neha Gupta', time: '09:12 AM', icon: '✓' },
  ];

  const filteredMembers = members.filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.phone.includes(searchTerm)
  );

  const tabs = ['overview', 'members', 'activity'];

  return (
    <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', marginBottom: '20px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h2 style={{ color: '#2d6a4f', margin: '0 0 2px', fontSize: '18px' }}>Gym Owner Dashboard</h2>
          <p style={{ color: '#888', margin: 0, fontSize: '12px' }}>FitSense AI — Complete Management</p>
        </div>
        <div style={{ background: '#d8f3dc', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', color: '#1b4332', fontWeight: 'bold' }}>
          Live
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            style={{ padding: '7px 14px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: activeTab === tab ? 'bold' : 'normal', background: activeTab === tab ? '#2d6a4f' : '#f0f4f0', color: activeTab === tab ? '#fff' : '#555', textTransform: 'capitalize' }}>
            {tab}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div>
          {/* Main stats grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
            {[
              { label: 'Total Members', value: stats.totalMembers, color: '#e8f4ff', textColor: '#185FA5', sub: `${stats.activeMembers} active` },
              { label: 'Monthly Revenue', value: `₹${stats.monthlyRevenue.toLocaleString()}`, color: '#d8f3dc', textColor: '#1b4332', sub: `₹${stats.totalDue} due` },
              { label: "Today's Attendance", value: stats.todayAttendance, color: '#f0e8ff', textColor: '#534AB7', sub: 'members visited' },
              { label: 'New Enquiries', value: stats.newEnquiries, color: '#fff3cd', textColor: '#856404', sub: 'this week' },
            ].map(stat => (
              <div key={stat.label} style={{ background: stat.color, borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '26px', fontWeight: 'bold', color: stat.textColor }}>{stat.value}</div>
                <div style={{ fontSize: '11px', fontWeight: 'bold', color: stat.textColor }}>{stat.label}</div>
                <div style={{ fontSize: '10px', color: stat.textColor, opacity: 0.7, marginTop: '2px' }}>{stat.sub}</div>
              </div>
            ))}
          </div>

          {/* Alert cards */}
          <div style={{ marginBottom: '14px' }}>
            <div style={{ background: '#fff3cd', borderRadius: '10px', padding: '12px 14px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 'bold', color: '#856404', fontSize: '13px' }}>Memberships Expiring Soon</div>
                <div style={{ fontSize: '12px', color: '#856404', opacity: 0.8 }}>{stats.expiringSoon} members expire within 7 days</div>
              </div>
              <button style={{ background: '#856404', color: '#fff', border: 'none', borderRadius: '8px', padding: '6px 12px', fontSize: '11px', cursor: 'pointer' }}
                onClick={() => alert('Reminder sent to all expiring members!')}>
                Send All Reminders
              </button>
            </div>

            <div style={{ background: '#ffe0e0', borderRadius: '10px', padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 'bold', color: '#c00', fontSize: '13px' }}>Pending Payments</div>
                <div style={{ fontSize: '12px', color: '#c00',opacity: 0.8 }}>₹{stats.totalDue} pending from {members.filter(m => m.fees === 'due').length} members</div>
              </div>
              <button style={{ background: '#c00', color: '#fff', border: 'none', borderRadius: '8px', padding: '6px 12px', fontSize: '11px', cursor: 'pointer' }}
                onClick={() => alert('Payment reminders sent!')}>
                Collect Dues
              </button>
            </div>
          </div>

          {/* Quick stats row */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { label: 'Avg Rating', value: stats.avgRating + '/5' },
              { label: 'Retention Rate', value: '81%' },
              { label: 'New This Month', value: '6' },
              { label: 'Classes Today', value: '4' },
            ].map(item => (
              <div key={item.label} style={{ background: '#f8f8f8', borderRadius: '8px', padding: '8px 12px', flex: '1', minWidth: '70px', textAlign: 'center' }}>
                <div style={{ fontWeight: 'bold', color: '#2d6a4f', fontSize: '16px' }}>{item.value}</div>
                <div style={{ fontSize: '10px', color: '#888' }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Members Tab */}
      {activeTab === 'members' && (
        <div>
          <input
            placeholder="Search by name or phone..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #ddd', fontSize: '13px', marginBottom: '12px', outline: 'none' }}
          />
          <div style={{ fontSize: '12px', color: '#888', marginBottom: '10px' }}>{filteredMembers.length} members found</div>
          {filteredMembers.map(member => (
            <div key={member.id} style={{ background: '#f8f8f8', borderRadius: '10px', padding: '12px 14px', marginBottom: '8px', borderLeft: `3px solid ${member.status === 'active' ? '#2d6a4f' : '#ccc'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#1b4332', fontSize: '14px' }}>{member.name}</div>
                  <div style={{ fontSize: '12px', color: '#888' }}>{member.phone} • {member.plan}</div>
                  <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>Joined: {member.joined} • Expiry: {member.expiry}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-end' }}>
                  <span style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: 'bold', background: member.status === 'active' ? '#d8f3dc' : '#eee', color: member.status === 'active' ? '#1b4332' : '#888' }}>
                    {member.status.toUpperCase()}
                  </span>
                  <span style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: 'bold', background: member.fees === 'paid' ? '#d8f3dc' : '#ffe0e0', color: member.fees === 'paid' ? '#1b4332' : '#c00' }}>
                    {member.fees.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Activity Tab */}
      {activeTab === 'activity' && (
        <div>
          <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#2d6a4f', marginBottom: '10px' }}>Today's Activity</div>
          {recentActivity.map((activity, i) => (
            <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px', background: activity.type === 'entry' ? '#d8f3dc' : activity.type === 'payment' ? '#e8f4ff' : '#fff3cd', color: activity.type === 'entry' ? '#1b4332' : activity.type === 'payment' ? '#185FA5' : '#856404', flexShrink: 0 }}>
                {activity.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', color: '#333', fontSize: '13px' }}>{activity.name}</div>
                <div style={{ fontSize: '11px', color: '#888' }}>
                  {activity.type === 'entry' ? 'Gym entry' : activity.type === 'payment' ? 'Payment received' : 'New enquiry'}
                </div>
              </div>
              <div style={{ fontSize: '12px', color: '#888' }}>{activity.time}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OwnerDashboard;