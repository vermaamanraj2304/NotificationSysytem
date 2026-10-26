import React from 'react';
import { Home, Search, MapPin } from 'lucide-react';

function PropertyList({
  properties,
  searchQuery,
  setSearchQuery,
  handlePropertySearchSubmit,
  handleClearSearch,
  handlePropertyClick
}) {
  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
        <h3 className="card-title" style={{ border: 'none', margin: 0 }}>
          <Home size={18} style={{ color: 'var(--secondary)' }} /> Explore Properties
        </h3>
        
        {/* Search Bar Form */}
        <form onSubmit={handlePropertySearchSubmit} style={{ display: 'flex', gap: '8px', maxWidth: '350px', width: '100%' }}>
          <div style={{ position: 'relative', flexGrow: 1 }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search by city, title, type..." 
              className="input-control" 
              style={{ paddingLeft: '32px' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ padding: '8px 12px' }}>
            Search
          </button>
          {searchQuery && (
            <button type="button" onClick={handleClearSearch} className="btn btn-secondary" style={{ padding: '8px 12px' }}>
              Reset
            </button>
          )}
        </form>
      </div>

      {/* Properties Grid */}
      <div className="items-grid">
        {properties.length > 0 ? (
          properties.map(prop => (
            <div 
              key={prop._id} 
              className="item-card"
              onClick={() => handlePropertyClick(prop._id)}
              style={{ cursor: 'pointer' }}
              title="Click to view recommendations"
            >
              <img src={prop.image || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80'} alt={prop.title} className="item-img" />
              <div className="item-info">
                <div>
                  <span style={{ fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--secondary)', background: '#e0e7ff', padding: '2px 6px', borderRadius: '4px', display: 'inline-block', marginBottom: '6px' }}>{prop.type}</span>
                  <h4 className="item-title" style={{ fontSize: '14px', marginBottom: '4px' }}>{prop.title}</h4>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                    <MapPin size={10} /> {prop.city}
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                  <div className="item-price" style={{ margin: 0, fontSize: '15px' }}>₹{prop.price}/mo</div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', padding: '30px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
            No matching properties found.
          </div>
        )}
      </div>
    </div>
  );
}

export default PropertyList;
