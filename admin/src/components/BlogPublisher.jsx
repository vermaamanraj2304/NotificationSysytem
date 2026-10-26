import React from 'react';
import { BookOpen } from 'lucide-react';

function BlogPublisher({
  blogs,
  blogTitle,
  setBlogTitle,
  blogContent,
  setBlogContent,
  handleCreateBlog
}) {
  return (
    <div className="card">
      <h3 className="card-title text-emerald-600">
        <BookOpen size={16} /> Publish New Blog
      </h3>
      
      {/* Blog Publish Form */}
      <form onSubmit={handleCreateBlog} style={{ marginBottom: '24px' }}>
        <div className="form-group">
          <label>Blog Title</label>
          <input 
            type="text" 
            className="input-control" 
            value={blogTitle} 
            onChange={(e) => setBlogTitle(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Content Summary</label>
          <textarea 
            rows="3" 
            className="input-control" 
            value={blogContent} 
            onChange={(e) => setBlogContent(e.target.value)} 
            required 
          />
        </div>
        <button type="submit" className="btn btn-primary" style={{ background: '#059669' }}>
          Publish & Notify Users
        </button>
      </form>

      {/* Show Published Blogs */}
      <h4 style={{ margin: '20px 0 10px 0', fontSize: '13px', fontWeight: 'bold', borderTop: '1px dashed var(--border)', paddingTop: '15px' }}>Published Articles & Insights</h4>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
        {blogs && blogs.length > 0 ? (
          blogs.map(blog => (
            <div key={blog._id} style={{ border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden', fontSize: '11px', background: '#f8fafc' }}>
              <img src={blog.image || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80'} alt={blog.title} style={{ height: '70px', width: '100%', objectFit: 'cover' }} />
              <div style={{ padding: '8px' }}>
                <h5 style={{ margin: '0 0 4px 0', fontWeight: 'bold', fontSize: '12px' }}>{blog.title}</h5>
                <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: 1.3 }}>{blog.content.substring(0, 80)}...</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '9px', color: 'var(--text-muted)' }}>
                  <span>By Admin</span>
                  <span>{new Date(blog.updatedAt || blog.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', padding: '10px 0', color: 'var(--text-muted)', fontStyle: 'italic' }}>
            No blog articles published.
          </div>
        )}
      </div>
    </div>
  );
}

export default BlogPublisher;
