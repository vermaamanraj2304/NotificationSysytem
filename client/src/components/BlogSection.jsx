import React from 'react';
import { BookOpen } from 'lucide-react';

function BlogSection({ blogs }) {
  return (
    <div className="card">
      <h3 className="card-title text-emerald-600" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
        <BookOpen size={18} /> Renting Carnival Blog & Insights
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', marginTop: '12px' }}>
        {blogs.length > 0 ? (
          blogs.map(blog => (
            <div key={blog._id} style={{ display: 'flex', flexDirection: 'column', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden', background: 'white' }}>
              <img src={blog.image || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80'} alt={blog.title} style={{ height: '140px', width: '100%', objectFit: 'cover' }} />
              <div style={{ padding: '15px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 'bold', color: 'var(--text)' }}>{blog.title}</h4>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.4, margin: 0 }}>{blog.content}</p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px', fontSize: '10px', color: 'var(--text-muted)' }}>
                  <span>Published: {new Date(blog.updatedAt || blog.createdAt).toLocaleDateString()}</span>
                  <span style={{ fontWeight: 'bold' }}>By Admin</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', padding: '20px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
            No blog articles published.
          </div>
        )}
      </div>
    </div>
  );
}

export default BlogSection;
