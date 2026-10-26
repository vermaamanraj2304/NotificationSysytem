import React from 'react';
import { User, Shield, MapPin, Tag } from 'lucide-react';

function UserList({ users }) {
  return (
    <div className="card">
      <h3 className="card-title text-indigo-600" style={{ color: 'var(--secondary)' }}>
        <User size={16} /> Registered Platform Users ({users.length})
      </h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
        {users.map(u => {
          const hasPrefs = u.searchPreferences && u.searchPreferences.city;
          return (
            <div key={u._id} style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '14px', background: '#f8fafc', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div style={{ padding: '6px', background: u.role === 'admin' ? '#fee2e2' : '#e0e7ff', borderRadius: '8px' }}>
                  {u.role === 'admin' ? <Shield size={14} className="text-red-500" /> : <User size={14} className="text-indigo-500" />}
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '13px', fontWeight: 'bold' }}>{u.name}</h4>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{u.email}</span>
                </div>
              </div>

              <div style={{ fontSize: '10px', marginTop: '10px', borderTop: '1px dashed var(--border)', paddingTop: '10px' }}>
                <span style={{ fontWeight: 'bold', display: 'block', marginBottom: '4px', color: 'var(--text)' }}>Preferences:</span>
                {hasPrefs ? (
                  <div style={{ color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span>📍 City: {u.searchPreferences.city}</span>
                    <span>💰 Max Budget: ₹{u.searchPreferences.priceMax}</span>
                    <span>🏠 Layout: {u.searchPreferences.propertyType}</span>
                  </div>
                ) : (
                  <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No preferences set.</span>
                )}
              </div>

              <div style={{ fontSize: '10px', marginTop: '10px' }}>
                <span style={{ fontWeight: 'bold', display: 'block', marginBottom: '2px', color: 'var(--text)' }}>Wishlisted Furniture:</span>
                <span style={{ color: 'var(--text-muted)' }}>
                  {u.wishlistedFurniture && u.wishlistedFurniture.length > 0 
                    ? `${u.wishlistedFurniture.length} items (${u.wishlistedFurniture.join(', ')})`
                    : 'None'
                  }
                </span>
              </div>

              <span style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase', padding: '2px 6px', borderRadius: '4px', background: u.role === 'admin' ? '#fecaca' : '#c7d2fe', color: u.role === 'admin' ? '#991b1b' : '#3730a3' }}>
                {u.role}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default UserList;
