import React from 'react';
import { Package, PlusCircle, Edit3 } from 'lucide-react';

function FurnitureConsole({
  furnitures,
  furnName,
  setFurnName,
  furnCategory,
  setFurnCategory,
  furnPrice,
  setFurnPrice,
  furnInStock,
  setFurnInStock,
  furnImage,
  setFurnImage,
  editingFurnId,
  setEditingFurnId,
  editName,
  setEditName,
  editCategory,
  setEditCategory,
  editPrice,
  setEditPrice,
  editInStock,
  setEditInStock,
  editImage,
  setEditImage,
  handleCreateFurniture,
  handleSelectEditFurniture,
  handleUpdateFurnitureInventory,
  handleRestockFurniture
}) {
  return (
    <div className="card">
      <h3 className="card-title text-orange-600">
        <Package size={16} /> Furniture Inventory Management
      </h3>

      {/* Add New Furniture Form */}
      <form onSubmit={handleCreateFurniture} style={{ marginBottom: '24px', background: '#fff7ed', padding: '16px', borderRadius: '12px', border: '1px solid #ffedd5' }}>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: 'bold', color: '#c2410c' }}>Add New Furniture Item</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="form-group">
            <label>Furniture Name</label>
            <input 
              type="text" 
              className="input-control" 
              placeholder="e.g. Wooden Dining Table"
              value={furnName}
              onChange={(e) => setFurnName(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select className="input-control" value={furnCategory} onChange={(e) => setFurnCategory(e.target.value)}>
              <option value="Living Room">Living Room</option>
              <option value="Study">Study / Office</option>
              <option value="Bedroom">Bedroom</option>
              <option value="Kitchen">Kitchen / Dining</option>
            </select>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
          <div className="form-group">
            <label>Monthly Price (₹)</label>
            <input 
              type="number" 
              className="input-control" 
              value={furnPrice}
              onChange={(e) => setFurnPrice(Number(e.target.value))}
              required 
            />
          </div>
          <div className="form-group">
            <label>Initial Stock Status</label>
            <select className="input-control" value={furnInStock ? 'yes' : 'no'} onChange={(e) => setFurnInStock(e.target.value === 'yes')}>
              <option value="yes">In Stock</option>
              <option value="no">Out of Stock</option>
            </select>
          </div>
          <div className="form-group">
            <label>Image URL (Optional)</label>
            <input 
              type="text" 
              className="input-control" 
              placeholder="Unsplash image URL"
              value={furnImage}
              onChange={(e) => setFurnImage(e.target.value)}
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary" style={{ background: '#ea580c' }}>
          <PlusCircle size={14} style={{ marginRight: '6px' }} /> List Furniture
        </button>
      </form>

      {/* Edit Existing Furniture Inventory Form */}
      {editingFurnId && (
        <form onSubmit={handleUpdateFurnitureInventory} style={{ marginBottom: '24px', background: '#f0fdf4', padding: '16px', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: 'bold', color: '#166534', display: 'flex', justifyContent: 'space-between' }}>
            <span>Edit Inventory: {editName}</span>
            <button type="button" onClick={() => setEditingFurnId('')} style={{ background: 'none', border: 'none', color: '#b91c1c', cursor: 'pointer', fontWeight: 'bold' }}>Cancel</button>
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label>Furniture Name</label>
              <input 
                type="text" 
                className="input-control" 
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required 
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <input 
                type="text" 
                className="input-control" 
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                required 
              />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label>Monthly Price (₹)</label>
              <input 
                type="number" 
                className="input-control" 
                value={editPrice}
                onChange={(e) => setEditPrice(Number(e.target.value))}
                required 
              />
            </div>
            <div className="form-group">
              <label>Stock Status</label>
              <select className="input-control" value={editInStock ? 'yes' : 'no'} onChange={(e) => setEditInStock(e.target.value === 'yes')}>
                <option value="yes">In Stock</option>
                <option value="no">Out of Stock</option>
              </select>
            </div>
            <div className="form-group">
              <label>Image URL</label>
              <input 
                type="text" 
                className="input-control" 
                value={editImage}
                onChange={(e) => setEditImage(e.target.value)}
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ background: '#16a34a' }}>
            <Edit3 size={14} style={{ marginRight: '6px' }} /> Update Inventory Details
          </button>
        </form>
      )}

      {/* List all furniture */}
      <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', fontWeight: 'bold' }}>All Furniture Listings</h4>
      <div className="item-list">
        {furnitures.map(item => (
          <div key={item._id} className="item-card">
            <img src={item.image} alt={item.name} className="item-img" />
            <div className="item-info">
              <h4 className="item-title">{item.name}</h4>
              <div className="item-price">₹{item.priceMonthly}/mo</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span className={`badge-stock ${item.inStock ? 'in' : 'out'}`}>
                  {item.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button 
                  className="btn btn-secondary" 
                  style={{ padding: '4px 6px', fontSize: '10px', flex: 1 }}
                  onClick={() => handleSelectEditFurniture(item)}
                >
                  <Edit3 size={10} style={{ marginRight: '2px' }} /> Edit
                </button>
                {!item.inStock && (
                  <button 
                    className="btn btn-primary" 
                    style={{ padding: '4px 6px', fontSize: '10px', flex: 1, background: 'var(--primary)' }}
                    onClick={() => handleRestockFurniture(item._id)}
                  >
                    Restock
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FurnitureConsole;
