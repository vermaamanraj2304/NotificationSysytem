import React from 'react';
import { Package, Heart } from 'lucide-react';

function FurnitureList({
  furnitures,
  currentUser,
  handleWishlist,
  handleSimulateExpiry
}) {
  return (
    <div className="card">
      <h3 className="card-title" style={{ color: 'var(--primary)' }}>
        <Package size={18} /> Premium Rented Furniture Items
      </h3>
      <div className="items-grid">
        {furnitures.map(item => (
          <div key={item._id} className="item-card">
            <img src={item.image} alt={item.name} className="item-img" />
            <div className="item-info">
              <div>
                <span style={{ fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--primary)', background: '#ffedd5', padding: '2px 6px', borderRadius: '4px', display: 'inline-block', marginBottom: '6px' }}>{item.category}</span>
                <h4 className="item-title" style={{ fontSize: '13px', marginBottom: '2px' }}>{item.name}</h4>
                <div className="item-price" style={{ margin: '4px 0 8px 0', fontSize: '14px' }}>₹{item.priceMonthly}/mo</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className={`badge-stock ${item.inStock ? 'in' : 'out'}`}>
                    {item.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                  {!item.inStock && (
                    <button 
                      className="btn btn-secondary" 
                      style={{ padding: '4px 8px', fontSize: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}
                      onClick={() => handleWishlist(item._id)}
                    >
                      <Heart size={10} style={{ fill: currentUser?.wishlistedFurniture?.includes(item._id) ? 'var(--primary)' : 'none' }} /> Alert Me
                    </button>
                  )}
                </div>
                
                {/* Subscription expirations */}
                {item.subscriptionEnd && (
                  <div style={{ borderTop: '1px dashed var(--border)', paddingTop: '8px', marginTop: '4px' }}>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                      Lease expiry: <strong>{new Date(item.subscriptionEnd).toLocaleDateString()}</strong>
                    </span>
                    {new Date(item.subscriptionEnd) > new Date() && (
                      <button 
                        className="btn btn-secondary" 
                        style={{ width: '100%', padding: '4px', fontSize: '10px' }}
                        onClick={() => handleSimulateExpiry(item._id)}
                      >
                        Simulate Subscription Expire
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FurnitureList;
