import React from 'react';
import { Megaphone, Mail } from 'lucide-react';

function Broadcasters({
  users,
  customRecipient,
  setCustomRecipient,
  customTitle,
  setCustomTitle,
  customMessage,
  setCustomMessage,
  mktTitle,
  setMktTitle,
  mktMessage,
  setMktMessage,
  handleSendCustomNotification,
  handleSendMarketingNotification
}) {
  return (
    <div className="card">
      <h3 className="card-title text-purple-600">
        <Megaphone size={16} /> Targeted & Marketing Notifications
      </h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Custom Target Notification */}
        <div style={{ background: '#faf5ff', padding: '16px', borderRadius: '12px', border: '1px solid #f3e8ff' }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: 'bold', color: '#7c3aed' }}>Custom In-App Notification</h4>
          <form onSubmit={handleSendCustomNotification}>
            <div className="form-group">
              <label>Select User</label>
              <select 
                className="input-control"
                value={customRecipient}
                onChange={(e) => setCustomRecipient(e.target.value)}
                required
              >
                <option value="">-- Choose User --</option>
                {users.filter(u => u.role !== 'admin').map(u => (
                  <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Title</label>
              <input 
                type="text" 
                className="input-control" 
                placeholder="Special discount code"
                value={customTitle} 
                onChange={(e) => setCustomTitle(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea 
                rows="2"
                className="input-control" 
                placeholder="Enter private message details..."
                value={customMessage} 
                onChange={(e) => setCustomMessage(e.target.value)} 
                required 
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ background: '#a855f7', width: '100%' }}>
              Send In-App Alert
            </button>
          </form>
        </div>

        {/* Marketing Broadcaster */}
        <div style={{ background: '#eff6ff', padding: '16px', borderRadius: '12px', border: '1px solid #dbeafe' }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: 'bold', color: '#1d4ed8' }}>Marketing Broadcast (Email Only)</h4>
          <form onSubmit={handleSendMarketingNotification}>
            <div className="form-group">
              <label>Promo Campaign Title</label>
              <input 
                type="text" 
                className="input-control" 
                placeholder="e.g. Renting Festival: 20% off all sofas!"
                value={mktTitle} 
                onChange={(e) => setMktTitle(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Marketing Message Body</label>
              <textarea 
                rows="3"
                className="input-control" 
                placeholder="Compose promotional email content..."
                value={mktMessage} 
                onChange={(e) => setMktMessage(e.target.value)} 
                required 
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ background: '#2563eb', width: '100%' }}>
              <Mail size={14} style={{ marginRight: '6px' }} /> Broadcast Email & Notification
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Broadcasters;
