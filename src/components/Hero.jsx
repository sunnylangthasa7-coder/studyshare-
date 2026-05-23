import React from 'react';
import { Search } from 'lucide-react';

export default function Hero({ searchQuery, setSearchQuery, onSelectSubject }) {
  const quickSubjects = ['Computer Science', 'Chemistry', 'Law', 'Mathematics'];

  return (
    <div className="hero-section">
      <h1 className="gradient-text">
        Unlock Top-Tier Study Notes & PDFs
      </h1>
      <p>
        Buy premium exam outlines and cheat sheets directly from students worldwide. 
        Sell your own study guides and keep <strong style={{ color: '#00f2fe' }}>85% of the profit</strong> from every download.
      </p>

      <div style={{ maxWidth: '650px', margin: '0 auto' }}>
        <div className="search-wrapper">
          <Search size={20} />
          <input 
            type="text" 
            className="input-field search-input" 
            placeholder="Search by note title, subject, university, or college..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            id="marketplace-search-input"
          />
        </div>

        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: '#9d8dbd', marginRight: '0.5rem' }}>Popular subjects:</span>
          {quickSubjects.map(sub => (
            <button 
              key={sub}
              className="btn btn-secondary"
              style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem', borderRadius: '50px' }}
              onClick={() => onSelectSubject(sub)}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      <div className="hero-stats">
        <div className="stat-item">
          <h3>1.2k+</h3>
          <p>Verified Notes</p>
        </div>
        <div className="stat-item" style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.1)', borderRight: '1px solid rgba(255, 255, 255, 0.1)', padding: '0 3rem' }}>
          <h3>8.5k+</h3>
          <p>Active Students</p>
        </div>
        <div className="stat-item">
          <h3>15%</h3>
          <p>Platform Fee</p>
        </div>
      </div>
    </div>
  );
}
