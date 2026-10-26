import React from 'react';
import { Home, PlusCircle } from 'lucide-react';

function PropertyConsole({
  properties,
  propTitle,
  setPropTitle,
  propCity,
  setPropCity,
  propPrice,
  setPropPrice,
  propType,
  setPropType,
  propImage,
  setPropImage,
  handleCreateProperty
}) {
  return (
    <div className="card">
      <h3 className="card-title text-indigo-600">
        <Home size={16} /> Properties Management
      </h3>
      
      {/* Add Property Form */}
      <form onSubmit={handleCreateProperty} style={{ marginBottom: '24px', background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: 'bold' }}>Add New Rental Property</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="form-group">
            <label>Property Name / Title</label>
            <input 
              type="text" 
              className="input-control" 
              placeholder="e.g. Cozy 1BHK in Indiranagar"
              value={propTitle}
              onChange={(e) => setPropTitle(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label>City Location</label>
            <select className="input-control" value={propCity} onChange={(e) => setPropCity(e.target.value)}>
              <option value="Delhi">Delhi</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Bangalore">Bangalore</option>
            </select>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
          <div className="form-group">
            <label>Monthly Price (₹)</label>
            <input 
              type="number" 
              className="input-control" 
              value={propPrice}
              onChange={(e) => setPropPrice(Number(e.target.value))}
              required 
            />
          </div>
          <div className="form-group">
            <label>Property Layout Type</label>
            <select className="input-control" value={propType} onChange={(e) => setPropType(e.target.value)}>
              <option value="2BHK">2BHK Apartment</option>
              <option value="1BHK">1BHK Apartment</option>
              <option value="Studio">Studio Flat</option>
              <option value="PG">Shared PG Space</option>
            </select>
          </div>
          <div className="form-group">
            <label>Image URL (Optional)</label>
            <input 
              type="text" 
              className="input-control" 
              placeholder="Unsplash image URL"
              value={propImage}
              onChange={(e) => setPropImage(e.target.value)}
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary" style={{ background: 'var(--secondary)' }}>
          <PlusCircle size={14} style={{ marginRight: '6px' }} /> Create Property Listing
        </button>
      </form>

      {/* List all properties */}
      <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', fontWeight: 'bold' }}>All Active Property Listings</h4>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
        {properties.map(p => (
          <div key={p._id} style={{ border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden', fontSize: '11px', background: '#f8fafc' }}>
            <img src={p.image} alt={p.title} style={{ height: '80px', width: '100%', objectFit: 'cover' }} />
            <div style={{ padding: '8px' }}>
              <span style={{ fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--secondary)', display: 'block', fontSize: '9px' }}>{p.type}</span>
              <h5 style={{ margin: '4px 0', fontWeight: 'bold', fontSize: '12px' }}>{p.title}</h5>
              <div style={{ color: 'var(--text-muted)' }}>City: {p.city}</div>
              <div style={{ fontWeight: 'bold', color: 'var(--primary)', marginTop: '4px' }}>₹{p.price}/mo</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PropertyConsole;
