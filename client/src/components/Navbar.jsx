import React from 'react';
import { Bell, User, LogOut } from 'lucide-react';

function Navbar({
  currentUser,
  users,
  socketConnected,
  unreadCount,
  notifications,
  isNotifOpen,
  setIsNotifOpen,
  markAllRead,
  getNotifIcon,
  handleUserChange,
  handleLogout
}) {
  return (
    <header>
      <div className="logo-section">
        <h1>🔔 Renting Carnival</h1>
        <p>Logged in as: <strong>{currentUser.name}</strong> ({currentUser.role})</p>
      </div>

      <div className="user-bar">
        <div className="status-indicator">
          <span className={`status-dot ${socketConnected ? 'online' : 'offline'}`}></span>
          <span>{socketConnected ? 'Real-Time Connected' : 'Offline'}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <User size={14} style={{ color: 'var(--primary)' }} />
          <select 
            className="user-select"
            value={currentUser._id} 
            onChange={handleUserChange}
          >
            <option value="">Logout</option>
            {users.map(u => (
              <option key={u._id} value={u._id}>
                {u.name} ({u.role})
              </option>
            ))}
          </select>
        </div>

        {/* Notification Bell Dropdown */}
        <div style={{ position: 'relative' }}>
          <button className="bell-btn" onClick={() => setIsNotifOpen(!isNotifOpen)}>
            <Bell size={20} />
            {unreadCount > 0 && <span className="bell-badge">{unreadCount}</span>}
          </button>

          {isNotifOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsNotifOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 40 }}></div>
              <div className="notifications-dropdown">
                <div className="dropdown-header">
                  <span>Notifications ({notifications.length})</span>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} className="dropdown-mark-read">
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="dropdown-list">
                  {notifications.length > 0 ? (
                    notifications.map(notif => (
                      <div key={notif._id} className={`dropdown-item ${!notif.read ? 'unread' : ''}`}>
                        <div className="notif-icon">{getNotifIcon(notif.type)}</div>
                        <div className="dropdown-item-content">
                          <h4>{notif.title}</h4>
                          <p>{notif.message}</p>
                          <span className="notif-time">{new Date(notif.createdAt).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: '20px', textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)' }}>
                      No notifications.
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <button className="btn btn-secondary" onClick={handleLogout} style={{ padding: '6px 12px', fontSize: '11px', background: 'rgba(255,255,255,0.15)', color: 'white', border: 'none' }}>
          <LogOut size={12} style={{ marginRight: '4px' }} /> Logout
        </button>
      </div>
    </header>
  );
}

export default Navbar;
