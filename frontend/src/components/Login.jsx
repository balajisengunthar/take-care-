import { useState } from 'react';
import { login } from '../api/authApi';
import './Login.css';

export default function Login({ onLoginSuccess }) {
  const [name, setName]         = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [showPwd, setShowPwd]   = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !password.trim()) {
      setError('Please fill in all fields 💜');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const user = await login(name.trim(), password.trim());
      onLoginSuccess(user);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Try again 💔');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-bg">
      {/* Ambient blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      <div className="login-card glass-card page-enter">
        {/* Logo / heading */}
        <div className="login-header">
          <div className="login-icon">
            <span className="heart-icon">💜</span>
            <div className="pulse-ring" />
          </div>
          <h1 className="login-title serif">Forgive Me</h1>
          <p className="login-sub">A message waits for you with love</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          <div className="field-group">
            <label className="label" htmlFor="login-name">Your Name</label>
            <input
              id="login-name"
              className="input"
              type="text"
              placeholder="Enter your name…"
              value={name}
              onChange={e => setName(e.target.value)}
              autoCapitalize="words"
              autoComplete="name"
            />
          </div>

          <div className="field-group">
            <label className="label" htmlFor="login-password">Password</label>
            <div className="pwd-wrapper">
              <input
                id="login-password"
                className="input"
                type={showPwd ? 'text' : 'password'}
                placeholder="Enter password…"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="pwd-toggle"
                onClick={() => setShowPwd(v => !v)}
                aria-label={showPwd ? 'Hide password' : 'Show password'}
              >
                {showPwd ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {error && (
            <div className="login-error" role="alert">
              {error}
            </div>
          )}

          <button
            id="login-submit-btn"
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
          >
            {loading ? (
              <><span className="spinner" /> Opening…</>
            ) : (
              <>Open with love 💌</>
            )}
          </button>
        </form>

        <p className="login-footer">This space was made just for you ✨</p>
      </div>
    </div>
  );
}
