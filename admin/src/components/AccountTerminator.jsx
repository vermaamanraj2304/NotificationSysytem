import React from 'react';
import { AlertTriangle } from 'lucide-react';

function AccountTerminator({
  users,
  termRecipient,
  setTermRecipient,
  termReason,
  setTermReason,
  handleTerminateAccount
}) {
  return (
    <div className="card" style={{ borderColor: 'var(--danger)' }}>
      <h3 className="card-title text-rose-600">
        <AlertTriangle size={16} /> Danger action: Terminate Account
      </h3>
      <form onSubmit={handleTerminateAccount}>
        <div className="form-group">
          <label>Select Violating Account</label>
          <select 
            className="input-control"
            value={termRecipient}
            onChange={(e) => setTermRecipient(e.target.value)}
            required
          >
            <option value="">-- Choose User --</option>
            {users.filter(u => u.role !== 'admin').map(u => (
              <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Reason for termination</label>
          <input 
            type="text" 
            className="input-control" 
            value={termReason} 
            onChange={(e) => setTermReason(e.target.value)} 
            required 
          />
        </div>
        <button type="submit" className="btn btn-danger">
          Dispatch Termination Notice
        </button>
      </form>
    </div>
  );
}

export default AccountTerminator;
