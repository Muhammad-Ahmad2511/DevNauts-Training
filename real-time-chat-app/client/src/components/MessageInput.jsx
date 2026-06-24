import { useState } from 'react';

export default function MessageInput({ onSend }) {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim()) {
      onSend(text);
      setText('');
    }
  };

  return (
    <div style={{ backgroundColor: '#f0f2f5', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '10px', borderTop: '0.5px solid #d9d9d9' }}>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSend()}
        placeholder="Type a message..."
        style={{ flex: 1, padding: '10px 16px', borderRadius: '24px', border: 'none', backgroundColor: '#fff', fontSize: '14px', outline: 'none', color: '#111' }}
      />
      <button
        onClick={handleSend}
        style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#128c7e', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
      </button>
    </div>
  );
}