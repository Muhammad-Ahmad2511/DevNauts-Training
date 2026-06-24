import { useEffect, useRef } from 'react';

export default function MessageList({ messages, currentUser }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', backgroundColor: '#efeae2' }}>
      {messages.length === 0 && (
        <p style={{ color: '#8a9a95', textAlign: 'center', marginTop: '40px' }}>No messages yet. Say hello!</p>
      )}

      {messages.map((msg, i) => {
        const isMe = msg.sender === currentUser;
        return (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
            {!isMe && (
              <span style={{ fontSize: '11px', fontWeight: '500', color: '#128c7e', marginBottom: '2px', marginLeft: '4px' }}>
                {msg.sender}
              </span>
            )}
            <div style={{
              maxWidth: '70%',
              padding: '8px 12px',
              borderRadius: '8px',
              borderTopRightRadius: isMe ? '2px' : '8px',
              borderTopLeftRadius: isMe ? '8px' : '2px',
              backgroundColor: isMe ? '#d9fdd3' : '#ffffff',
              fontSize: '14px',
              lineHeight: '1.5',
              color: '#111',
            }}>
              {msg.text}
            </div>
            <span style={{ fontSize: '10px', color: '#8a9a95', marginTop: '3px', marginRight: '4px' }}>
              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}