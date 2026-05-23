import React, { useContext, useState, useMemo } from 'react';
import { AppContext } from '../context/AppContext';
import Hero from '../components/Hero';
import NoteCard from '../components/NoteCard';
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export default function Marketplace() {
  const { notes, navigateTo } = useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState('All');
  const [maxPrice, setMaxPrice] = useState(50);
  const [sortBy, setSortBy] = useState('rating'); // 'rating', 'price-low', 'price-high', 'newest'

  // Extract all unique subjects & universities for filters
  const subjects = useMemo(() => {
    return Array.from(new Set(notes.map(n => n.subject)));
  }, [notes]);

  const universities = useMemo(() => {
    return ['All', ...Array.from(new Set(notes.map(n => n.university)))];
  }, [notes]);

  // Handle subject quick-select from Hero
  const handleSelectSubjectQuick = (subjectName) => {
    if (selectedSubjects.includes(subjectName)) {
      setSelectedSubjects([]);
    } else {
      setSelectedSubjects([subjectName]);
    }
  };

  const toggleSubject = (subject) => {
    setSelectedSubjects(prev => 
      prev.includes(subject) 
        ? prev.filter(s => s !== subject) 
        : [...prev, subject]
    );
  };

  // Filter notes
  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      const matchesSearch = 
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.university.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesSubject = selectedSubjects.length === 0 || selectedSubjects.includes(note.subject);
      const matchesUniversity = selectedUniversity === 'All' || note.university === selectedUniversity;
      const matchesPrice = note.price <= maxPrice;

      return matchesSearch && matchesSubject && matchesUniversity && matchesPrice;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'newest') return new Date(b.uploadedAt) - new Date(a.uploadedAt);
      return 0;
    });
  }, [notes, searchQuery, selectedSubjects, selectedUniversity, maxPrice, sortBy]);

  return (
    <div>
      <Hero 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        onSelectSubject={handleSelectSubjectQuick} 
      />

      <div className="marketplace-layout">
        {/* Sidebar Filters */}
        <aside className="glass-panel filters-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '0.75rem' }}>
            <SlidersHorizontal size={18} style={{ color: '#00f2fe' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Filter & Refine</h3>
          </div>

          {/* Subjects */}
          <div className="filter-section">
            <h4>Subjects</h4>
            <div className="checkbox-group">
              {subjects.map(sub => (
                <label key={sub} className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={selectedSubjects.includes(sub)}
                    onChange={() => toggleSubject(sub)}
                  />
                  <span>{sub}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Universities */}
          <div className="filter-section">
            <h4>University</h4>
            <select 
              className="input-field" 
              style={{ width: '100%', background: '#19142f' }}
              value={selectedUniversity}
              onChange={(e) => setSelectedUniversity(e.target.value)}
              id="filter-university-select"
            >
              {universities.map(uni => (
                <option key={uni} value={uni}>{uni}</option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div className="filter-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <h4>Max Price</h4>
              <span style={{ color: '#00f2fe', fontWeight: 700 }}>${maxPrice}</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              step="5"
              style={{ width: '100%', accentColor: '#8247e5' }}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              id="filter-price-slider"
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#7b6d9e', marginTop: '0.25rem' }}>
              <span>$0</span>
              <span>$100</span>
            </div>
          </div>

          <button 
            className="btn btn-secondary" 
            style={{ width: '100%', marginTop: '1rem', justifyContent: 'center' }}
            onClick={() => {
              setSelectedSubjects([]);
              setSelectedUniversity('All');
              setMaxPrice(50);
              setSearchQuery('');
            }}
          >
            Reset Filters
          </button>
        </aside>

        {/* Notes Listings Section */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <p style={{ color: '#9d8dbd', fontWeight: 500 }}>
              Showing <span style={{ color: '#ffffff', fontWeight: 700 }}>{filteredNotes.length}</span> study guides
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ArrowUpDown size={16} style={{ color: '#8247e5' }} />
              <span style={{ fontSize: '0.9rem', color: '#9d8dbd' }}>Sort by:</span>
              <select 
                className="input-field" 
                style={{ padding: '0.4rem 1rem', fontSize: '0.9rem', background: '#120e24' }}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                id="filter-sort-select"
              >
                <option value="rating">Top Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Recently Uploaded</option>
              </select>
            </div>
          </div>

          {filteredNotes.length > 0 ? (
            <div className="notes-grid">
              {filteredNotes.map(note => (
                <NoteCard 
                  key={note.id} 
                  note={note} 
                  onClick={() => navigateTo('note-details', { noteId: note.id })}
                />
              ))}
            </div>
          ) : (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No results match your criteria</h3>
              <p style={{ color: '#9d8dbd', marginBottom: '1.5rem' }}>Try modifying your search keywords or adjusting your price & subject filters.</p>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setSelectedSubjects([]);
                  setSelectedUniversity('All');
                  setMaxPrice(50);
                  setSearchQuery('');
                }}
              >
                Reset Search
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
