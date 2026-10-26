import React from 'react';
import { RefreshCw } from 'lucide-react';

function Navbar({ fetchData }) {
  return (
    <header>
      <div>
        <h1>🛠️ Renting Carnival Admin Console</h1>
        <p style={{ margin: '4px 0 0 0', fontSize: '12px', opacity: 0.7 }}>Manage platform notifications, restock alerts and simulated emails</p>
      </div>
      <button className="btn btn-primary" onClick={fetchData} style={{ background: '#334155' }}>
        <RefreshCw size={14} style={{ marginRight: '6px' }} /> Refresh Data
      </button>
    </header>
  );
}

export default Navbar;
