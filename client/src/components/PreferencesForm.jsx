import React from 'react';
import { Sparkles } from 'lucide-react';

function PreferencesForm({
  city,
  setCity,
  priceMax,
  setPriceMax,
  propertyType,
  setPropertyType,
  handleSavePreferences
}) {
  return (
    <div className="card">
      <h3 className="card-title" style={{ color: 'var(--secondary)' }}>
        <Sparkles size={18} /> Property Match Preferences
      </h3>
      <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '-8px', marginBottom: '14px' }}>
        We'll send you an automated in-app notice and email alert when a new property matches these criteria.
      </p>
      <form onSubmit={handleSavePreferences}>
        <div className="form-group">
          <label>Target City</label>
          <select 
            className="input-control"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            <option value="Delhi">Delhi</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Bangalore">Bangalore</option>
          </select>
        </div>
        <div className="form-group">
          <label>Maximum Price (₹/mo)</label>
          <input 
            type="number" 
            className="input-control" 
            value={priceMax}
            onChange={(e) => setPriceMax(Number(e.target.value))}
          />
        </div>
        <div className="form-group">
          <label>Layout Class</label>
          <select 
            className="input-control"
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
          >
            <option value="2BHK">2BHK Apartment</option>
            <option value="1BHK">1BHK Apartment</option>
            <option value="Studio">Studio Flat</option>
            <option value="PG">Shared PG Space</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
          Save & Alert Match
        </button>
      </form>
    </div>
  );
}

export default PreferencesForm;
