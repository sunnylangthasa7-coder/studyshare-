import React, { useContext, useMemo } from 'react';
import { AppContext } from '../context/AppContext';
import { Download, BookOpen, ExternalLink, Calendar, Search } from 'lucide-react';

export default function BuyerDashboard() {
  const { currentUser, notes, navigateTo, addToast } = useContext(AppContext);

  // Filter notes that have been purchased by this user
  const purchasedNotes = useMemo(() => {
    if (!currentUser) return [];
    return notes.filter(n => currentUser.purchasedIds.includes(n.id));
  }, [notes, currentUser]);

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 className="gradient-text" style={{ fontSize: '2.2rem', fontWeight: 800 }}>My Study Library</h2>
        <p style={{ color: '#9d8dbd', fontSize: '0.95rem' }}>Access and download your purchased outlines, summaries, and exam guides.</p>
      </div>

      <div className="glass-panel">
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: 700 }}>Your Purchases ({purchasedNotes.length})</h3>

        {purchasedNotes.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="styled-table" id="buyer-purchases-table">
              <thead>
                <tr>
                  <th>Document Title</th>
                  <th>Subject</th>
                  <th>University</th>
                  <th>Seller</th>
                  <th>Price Paid</th>
                  <th>Access Options</th>
                </tr>
              </thead>
              <tbody>
                {purchasedNotes.map(note => (
                  <tr key={note.id}>
                    <td style={{ fontWeight: 600, color: 'white' }}>{note.title}</td>
                    <td>
                      <span className="note-badge" style={{ margin: 0 }}>{note.subject}</span>
                    </td>
                    <td>{note.university}</td>
                    <td style={{ textTransform: 'capitalize' }}>{note.seller}</td>
                    <td style={{ color: '#00f2fe', fontWeight: 700 }}>${note.price.toFixed(2)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          className="btn btn-secondary" 
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                          onClick={() => navigateTo('note-details', { noteId: note.id })}
                        >
                          <ExternalLink size={14} />
                          Open Preview
                        </button>
                        <a 
                          href={note.fileUrl || '#'} 
                          download 
                          className="btn btn-primary"
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                          onClick={(e) => {
                            if (!note.fileUrl) {
                              e.preventDefault();
                              addToast('Simulating download of your purchased PDF study guide...', 'success');
                            }
                          }}
                        >
                          <Download size={14} />
                          Download
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <BookOpen size={48} style={{ color: '#7b6d9e', marginBottom: '1.5rem' }} />
            <p style={{ color: '#ffffff', fontSize: '1.1rem', fontWeight: 600 }}>Your study shelf is empty!</p>
            <p style={{ color: '#9d8dbd', fontSize: '0.9rem', marginTop: '0.25rem', marginBottom: '2rem' }}>
              Explore our catalog of cheat sheets, lecture summaries, and sample exams to start learning.
            </p>
            <button 
              className="btn btn-primary"
              onClick={() => navigateTo('marketplace')}
            >
              <Search size={16} />
              Browse Study Notes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
