import React from 'react';
import { Layers } from 'lucide-react';

function DiagnosticGuide() {
  return (
    <div className="card" style={{ background: '#faf5ff', borderColor: '#d8b4fe' }}>
      <h3 className="card-title" style={{ color: '#6b21a8' }}>
        <Layers size={18} /> How Notifications Flow Works
      </h3>
      <div style={{ fontSize: '12px', color: '#581c87', lineHeight: 1.5 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px' }}>
          <div>
            <h4 style={{ margin: '0 0 4px 0', fontWeight: 'bold' }}>⚡ Automated Search Alert</h4>
            <p style={{ margin: 0 }}>Adding a property matching user preferences sends a targeted notification and email instantly.</p>
          </div>
          <div>
            <h4 style={{ margin: '0 0 4px 0', fontWeight: 'bold' }}>📦 Back-In-Stock Notice</h4>
            <p style={{ margin: 0 }}>Restocking or setting an item to In-Stock scans all wishlisted standard clients and fires an alert & email.</p>
          </div>
          <div>
            <h4 style={{ margin: '0 0 4px 0', fontWeight: 'bold' }}>📢 Custom & Marketing</h4>
            <p style={{ margin: 0 }}>Send unique targeted updates or trigger a site-wide broadcast that registers in logs and dispatches mock emails.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DiagnosticGuide;
