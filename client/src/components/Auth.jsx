import React from 'react';
import { LogIn, UserPlus } from 'lucide-react';

function Auth({
  authMode,
  setAuthMode,
  loginEmail,
  setLoginEmail,
  loginPassword,
  setLoginPassword,
  regName,
  setRegName,
  regEmail,
  setRegEmail,
  regPassword,
  setRegPassword,
  regRole,
  setRegRole,
  handleLogin,
  handleRegister,
  users,
  handleUserChange
}) {
  return (
    <div className="auth-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: 'var(--background)', padding: '20px' }}>
      <div className="card" style={{ width: '100%', maxWidth: '420px', padding: '30px' }}>
        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 6px 0', background: 'linear-gradient(to right, var(--text), var(--primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>🔔 Renting Carnival</h1>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>MERN Notification & Property Hub</p>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
          <button 
            className={`btn ${authMode === 'login' ? 'btn-primary' : 'btn-secondary'}`} 
            style={{ flex: 1 }} 
            onClick={() => setAuthMode('login')}
          >
            <LogIn size={14} style={{ marginRight: '6px' }} /> Login
          </button>
          <button 
            className={`btn ${authMode === 'register' ? 'btn-primary' : 'btn-secondary'}`} 
            style={{ flex: 1 }} 
            onClick={() => setAuthMode('register')}
          >
            <UserPlus size={14} style={{ marginRight: '6px' }} /> Register
          </button>
        </div>

        {authMode === 'login' ? (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                className="input-control" 
                value={loginEmail} 
                onChange={(e) => setLoginEmail(e.target.value)} 
                placeholder="john@example.com" 
                required 
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input 
                type="password" 
                className="input-control" 
                value={loginPassword} 
                onChange={(e) => setLoginPassword(e.target.value)} 
                placeholder="••••••••" 
                required 
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '10px', marginTop: '10px' }}>
              Sign In
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                className="input-control" 
                value={regName} 
                onChange={(e) => setRegName(e.target.value)} 
                placeholder="John Doe" 
                required 
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                className="input-control" 
                value={regEmail} 
                onChange={(e) => setRegEmail(e.target.value)} 
                placeholder="john@example.com" 
                required 
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input 
                type="password" 
                className="input-control" 
                value={regPassword} 
                onChange={(e) => setRegPassword(e.target.value)} 
                placeholder="••••••••" 
                required 
              />
            </div>
            <div className="form-group">
              <label>Account Role</label>
              <select className="input-control" value={regRole} onChange={(e) => setRegRole(e.target.value)}>
                <option value="user">Standard Client</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '10px', marginTop: '10px' }}>
              Create Account
            </button>
          </form>
        )}

        {/* Quick bypass selector */}
        <div style={{ marginTop: '25px', paddingTop: '15px', borderTop: '1px dashed var(--border)', textAlign: 'center' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Or bypass login with standard profiles:</span>
          <select className="input-control" onChange={handleUserChange} defaultValue="">
            <option value="">-- Choose Profile --</option>
            {users.map(u => (
              <option key={u._id} value={u._id}>{u.name} ({u.role})</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default Auth;
