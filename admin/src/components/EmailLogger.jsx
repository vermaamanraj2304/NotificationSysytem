import React from 'react';
import { Inbox, Trash2, Eye } from 'lucide-react';

function EmailLogger({
  emails,
  selectedEmailBody,
  setSelectedEmailBody,
  handleClearEmails
}) {
  return (
    <div className="card" style={{ position: 'sticky', top: '20px' }}>
      <div className="card-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Inbox size={16} /> Outgoing Email Sim Logger
        </span>
        {emails.length > 0 && (
          <button onClick={handleClearEmails} className="btn" style={{ padding: '4px', color: 'var(--danger)', background: 'none' }}>
            <Trash2 size={14} />
          </button>
        )}
      </div>

      {emails.length > 0 ? (
        <div className="email-list">
          {emails.map(email => (
            <div key={email.id} className="email-card">
              <div className="email-header">
                <span>To: <strong>{email.to}</strong></span>
                <span>{new Date(email.sentAt).toLocaleTimeString()}</span>
              </div>
              <h4 className="email-subject">{email.subject}</h4>
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <button 
                  className="btn" 
                  style={{ padding: '4px 8px', fontSize: '10px', background: '#f1f5f9' }}
                  onClick={() => setSelectedEmailBody(email.html)}
                >
                  <Eye size={10} style={{ marginRight: '4px' }} /> Preview Body
                </button>
                {email.previewUrl && (
                  <a 
                    href={email.previewUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn"
                    style={{ padding: '4px 8px', fontSize: '10px', background: '#e0f2fe', color: '#0369a1', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
                  >
                    View Ethereal Email
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '20px 0', fontSize: '12px', color: 'var(--text-muted)' }}>
          No outgoing emails tracked.
        </div>
      )}

      {selectedEmailBody && (
        <div className="email-body" dangerouslySetInnerHTML={{ __html: selectedEmailBody }} />
      )}
    </div>
  );
}

export default EmailLogger;
