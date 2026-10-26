import React from 'react';
import { Bell, Trash2 } from 'lucide-react';

function NotificationLog({
  notifications,
  markAllRead,
  getNotifIcon,
  handleDeleteNotification
}) {
  return (
    <div className="card">
      <h3 className="card-title">
        <Bell size={18} /> Notification Log Center
      </h3>
      {notifications.length > 0 ? (
        <div className="sidebar-list">
          <button 
            onClick={markAllRead} 
            className="btn btn-secondary" 
            style={{ width: '100%', fontSize: '10px', padding: '6px', marginBottom: '8px' }}
          >
            Mark All Read
          </button>
          {notifications.map(notif => (
            <div key={notif._id} className={`notif-card ${!notif.read ? 'unread' : ''}`}>
              <div className="notif-icon">{getNotifIcon(notif.type)}</div>
              <div className="notif-info" style={{ flexGrow: 1 }}>
                <h4 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{notif.title}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '8px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{notif.type}</span>
                    <button 
                      onClick={() => handleDeleteNotification(notif._id)}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                      title="Delete notification"
                    >
                      <Trash2 size={10} />
                    </button>
                  </div>
                </h4>
                <p>{notif.message}</p>
                <span className="notif-time">{new Date(notif.createdAt).toLocaleTimeString()}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 0', fontSize: '12px', color: 'var(--text-muted)' }}>
          No notifications logged.
        </div>
      )}
    </div>
  );
}

export default NotificationLog;
