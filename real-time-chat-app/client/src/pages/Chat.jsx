import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';

export default function Chat({ user }) {
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const socket = io('http://localhost:5000', {
      auth: { token },
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('join');
    });

    socket.on('load-messages', (msgs) => {
      setMessages(msgs);
    });

    socket.on('receive-message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      socket.off('load-messages');
      socket.off('receive-message');
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user.username]);

  const sendMessage = (text) => {
    socketRef.current?.emit('send-message', { text });
  };

  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f2f5' }}>
      <div style={{ width: '100%', maxWidth: '700px', height: '90vh', display: 'flex', flexDirection: 'column', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.12)' }}>

        {/* Header */}
        <div style={{ backgroundColor: '#128c7e', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#25d366', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', fontSize: '16px', color: '#fff', flexShrink: 0 }}>
            CR
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '16px', fontWeight: '500', color: '#fff' }}>Chat Room</p>
            <p style={{ margin: 0, fontSize: '12px', color: '#cce8e5' }}>
              <span style={{ display: 'inline-block', width: '7px', height: '7px', backgroundColor: '#25d366', borderRadius: '50%', marginRight: '5px' }}></span>
              Logged in as: {user.username}
            </p>
          </div>
        </div>

        {/* Messages */}
        <MessageList messages={messages} currentUser={user.username} />

        {/* Input */}
        <MessageInput onSend={sendMessage} />
      </div>
    </div>
  );
}
