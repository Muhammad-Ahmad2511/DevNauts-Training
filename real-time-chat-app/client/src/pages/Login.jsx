import { useState } from 'react';
import axios from 'axios';

export default function Login({ onLogin }) {
  const [username, setUsername]     = useState('');
  const [password, setPassword]     = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError]           = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async () => {
    if (!username || !password) {
      setError('Please fill in both fields');
      return;
    }
    try {
      const route = isRegister ? 'register' : 'login';
      const res = await axios.post(`http://localhost:5000/api/auth/${route}`, { username, password });
      if (isRegister) {
        alert('Registered successfully! Now login.');
        setIsRegister(false);
        setError('');
      } else {
        localStorage.setItem('token', res.data.token);
        onLogin({ username: res.data.username, token: res.data.token });
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f2f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '16px', width: '100%', maxWidth: '400px', boxShadow: '0 2px 12px rgba(0,0,0,0.1)' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ width: '56px', height: '56px', backgroundColor: '#128c7e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '500', color: '#111' }}>
            {isRegister ? 'Create account' : 'Welcome back'}
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#8a9a95' }}>MERN Chat App</p>
        </div>

        {/* Error */}
        {error && (
          <p style={{ color: '#e53e3e', fontSize: '13px', backgroundColor: '#fff5f5', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', border: '0.5px solid #fed7d7' }}>
            {error}
          </p>
        )}

        {/* Username */}
        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '13px', color: '#555', display: 'block', marginBottom: '6px' }}>Username</label>
          <input
            placeholder="Enter your username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', boxSizing: 'border-box', color: '#111' }}
          />
        </div>

        {/* Password with eye toggle */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '13px', color: '#555', display: 'block', marginBottom: '6px' }}>Password</label>
          <div style={{ position: 'relative' }}>
            <input
              placeholder="Enter your password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              style={{ width: '100%', padding: '10px 44px 10px 14px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', boxSizing: 'border-box', color: '#111' }}
            />
            {/* Eye button */}
            <button
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: '0', display: 'flex', alignItems: 'center', color: '#8a9a95' }}
            >
              {showPassword ? (
                // Eye OFF icon (hide)
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              ) : (
                // Eye ON icon (show)
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          style={{ width: '100%', padding: '12px', backgroundColor: '#128c7e', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '500', cursor: 'pointer' }}
        >
          {isRegister ? 'Register' : 'Login'}
        </button>

        {/* Switch */}
        <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px', color: '#8a9a95' }}>
          {isRegister ? 'Already have an account?' : "Don't have an account?"}
          <button
            onClick={() => { setIsRegister(!isRegister); setError(''); }}
            style={{ background: 'none', border: 'none', color: '#128c7e', fontWeight: '500', cursor: 'pointer', fontSize: '13px', marginLeft: '4px' }}
          >
            {isRegister ? 'Login' : 'Register'}
          </button>
        </p>

      </div>
    </div>
  );
}