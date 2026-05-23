import React from 'react';
import { Star, GraduationCap, ArrowUpRight, School } from 'lucide-react';

export default function NoteCard({ note, onClick }) {
  // Truncate description if too long
  const truncate = (text, max = 100) => {
    if (text.length <= max) return text;
    return text.substring(0, max) + '...';
  };

  return (
    <div className="glass-card note-card-inner" onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className="note-badge">{note.subject}</div>
      <h3 className="note-title" style={{ color: '#ffffff' }}>{note.title}</h3>
      
      <p style={{ color: '#bfb3d4', fontSize: '0.9rem', marginBottom: '1rem', flexGrow: 1 }}>
        {truncate(note.description)}
      </p>

      <div className="note-meta">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <GraduationCap size={14} style={{ color: '#00f2fe' }} />
          <span style={{ fontWeight: 650 }}>{note.university}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#9d8dbd', fontSize: '0.8rem' }}>
          <School size={12} />
          <span>{note.college}</span>
        </div>
        <div style={{ fontSize: '0.75rem', marginTop: '0.25rem', color: '#7b6d9e' }}>
          Uploaded by: <span style={{ textTransform: 'capitalize', color: '#cbbce2' }}>{note.seller}</span>
        </div>
      </div>

      <div className="note-footer">
        <div className="note-price">${note.price.toFixed(2)}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div className="note-rating">
            <Star size={14} fill="#ffb100" stroke="none" />
            <span>{note.rating}</span>
            <span style={{ color: '#7b6d9e', fontWeight: 400, fontSize: '0.75rem' }}>
              ({note.reviews?.length || 0})
            </span>
          </div>
          <ArrowUpRight size={18} style={{ color: '#8247e5' }} />
        </div>
      </div>
    </div>
  );
}
