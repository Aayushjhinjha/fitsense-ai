import React, { useState, useRef, useEffect } from 'react';

function SalesAgent({ user }) {
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Namaste! 🙏 Main FitSense AI ka Sales Agent hoon. Kya aap gym join karna chahte hain ya koi sawaal hai?', time: new Date().toLocaleTimeString() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', text: input, time: new Date().toLocaleTimeString() };
    setMessages(prev => [...prev, userMsg]);
    const userInput = input;
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('http://127.0.0.1:8000/sales-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userInput,
          history: messages.map(m => ({ role: m.role === 'bot' ? 'assistant' : 'user', content: m.text }))
        })
      });
      const data = await res.json();
      const botMsg = { role: 'bot', text: data.reply, time: new Date().toLocaleTimeString() };
      setMessages(prev => [...prev, botMsg]);

      if (data.lead_captured) setLeadCaptured(true);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Sorry, abhi connection issue hai. Thodi der baad try karo.', time: new Date().toLocaleTimeString() }]);
    }
    setLoading(false);
  };

  const quickReplies = [
    'Membership plans kya hain?',
    'Monthly fees kitni hai?',
    'Gym ka time kya hai?',
    'Free trial milega?',
  ];

  return (
    <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', marginBottom: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h2 style={{ color: '#2d6a4f', margin: '0 0 2px', fontSize: '18px' }}>AI Sales Agent</h2>
          <p style={{ color: '#888', margin: 0, fontSize: '12px' }}>24/7 available — Hindi + English</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2d6a4f' }}></div>
          <span style={{ fontSize: '12px', color: '#2d6a4f', fontWeight: 'bold' }}>Online</span>
        </div>
      </div>

      {leadCaptured && (
        <div style={{ background: '#d8f3dc', borderRadius: '10px', padding: '10px 14px', marginBottom: '12px', fontSize: '13px', color: '#1b4332', fontWeight: 'bold', textAlign: 'center' }}>
          Lead captured! Gym owner ko notify kar diya gaya.
        </div>
      )}

      {/* Chat messages */}
      <div style={{ height: '300px', overflowY: 'auto', marginBottom: '12px', padding: '8px', background: '#f8f8f8', borderRadius: '10px' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: '10px' }}>
            <div style={{ maxWidth: '80%' }}>
              <div style={{
                padding: '10px 14px', borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                background: msg.role === 'user' ? '#2d6a4f' : '#fff',
                color: msg.role === 'user' ? '#fff' : '#333',
                fontSize: '13px', lineHeight: '1.5',
                boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
              }}>
                {msg.text}
              </div>
              <div style={{ fontSize: '10px', color: '#aaa', marginTop: '3px', textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                {msg.time}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '10px' }}>
            <div style={{ padding: '10px 14px', borderRadius: '16px 16px 16px 4px', background: '#fff', fontSize: '13px', color: '#888', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
              Typing...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick replies */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
        {quickReplies.map((reply, i) => (
          <button key={i} onClick={() => setInput(reply)}
            style={{ padding: '5px 10px', borderRadius: '20px', border: '1px solid #2d6a4f', background: '#fff', color: '#2d6a4f', fontSize: '11px', cursor: 'pointer' }}>
            {reply}
          </button>
        ))}
      </div>

      {/* Input */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && sendMessage()}
          placeholder="Kuch bhi poocho — Hindi ya English mein..."
          style={{ flex: 1, padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #ddd', fontSize: '13px', outline: 'none' }}
        />
        <button onClick={sendMessage} disabled={loading}
          style={{ background: '#2d6a4f', color: '#fff', padding: '10px 18px', borderRadius: '10px', border: 'none', fontSize: '14px', cursor: 'pointer', fontWeight: 'bold' }}>
          Send
        </button>
      </div>
    </div>
  );
}

export default SalesAgent;