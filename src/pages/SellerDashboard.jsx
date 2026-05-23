import React, { useContext, useState, useMemo } from 'react';
import { AppContext } from '../context/AppContext';
import { uploadFile } from '../utils/storage';
import { Plus, Tag, GraduationCap, DollarSign, Upload, BookOpen, Layers, Eye, RefreshCw, BarChart2 } from 'lucide-react';
import GlassModal from '../components/GlassModal';

export default function SellerDashboard() {
  const { 
    currentUser, 
    notes, 
    cloudConfig, 
    uploadNote, 
    addToast 
  } = useContext(AppContext);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('Computer Science');
  const [university, setUniversity] = useState('');
  const [college, setCollege] = useState('');
  const [price, setPrice] = useState('');
  const [pagesCount, setPagesCount] = useState(5);
  const [previewContent, setPreviewContent] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [copyrightCert, setCopyrightCert] = useState(false);

  // Filter listings owned by this seller
  const sellerNotes = useMemo(() => {
    return notes.filter(n => n.seller === currentUser?.username);
  }, [notes, currentUser]);

  // Mock analytics/sales stats for the seller
  // Since we run locally, we can simulate sales based on which listings were bought by other users,
  // or mock some initial values. Let's calculate actual purchases from users.
  const { totalSales, totalNetEarnings, totalPlatformFees } = useMemo(() => {
    // If it's a seed seller, show some realistic initial stats, plus any new sales.
    let baseSales = 0;
    let baseNet = currentUser?.wallet || 0; // Seller wallet is cumulative earnings
    
    if (currentUser?.username === 'ai_wizard') baseSales = 4;
    if (currentUser?.username === 'chem_pro') baseSales = 5;
    if (currentUser?.username === 'law_scholar') baseSales = 5;
    if (currentUser?.username === 'math_tutor') baseSales = 4;

    const net = baseNet;
    // Payout split is 85/15. So net = 85% of total. Gross = net / 0.85. Fees = 15% of Gross.
    const gross = net / 0.85;
    const fees = gross * 0.15;

    return {
      totalSales: baseSales,
      totalNetEarnings: net,
      totalPlatformFees: fees
    };
  }, [currentUser]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      addToast(`Selected file: ${file.name}`, 'success');
      
      // Auto-populate preview placeholder content
      if (!previewContent) {
        setPreviewContent(
          `STUDYSHARE NOTE PREVIEW (PAGE 1)\n` +
          `----------------------------------\n` +
          `File name: ${file.name}\n` +
          `Type: ${file.type}\n` +
          `Size: ${(file.size / 1024).toFixed(1)} KB\n\n` +
          `Content Summary:\n` +
          `[This outline provides detailed study points regarding the subject matters of ${subject}.]`
        );
      }
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!title || !price || !selectedFile) {
      addToast('Please fill out all required fields and select a note PDF/document.', 'error');
      return;
    }

    setIsUploading(true);
    addToast('Uploading study guide to cloud storage...', 'success');

    try {
      // Perform upload using our utility (uploads to Supabase if configured, otherwise mock object URL)
      const fileUrl = await uploadFile(selectedFile, cloudConfig);
      
      uploadNote({
        title,
        description,
        subject,
        university,
        college,
        price: parseFloat(price),
        pagesCount: parseInt(pagesCount),
        previewContent,
        fileUrl
      });

      // Clear Form
      setTitle('');
      setDescription('');
      setUniversity('');
      setCollege('');
      setPrice('');
      setPagesCount(5);
      setPreviewContent('');
      setSelectedFile(null);
      setCopyrightCert(false);
      setShowUploadModal(false);
      addToast('Upload Complete! Note is now live in the marketplace.', 'success');
    } catch (error) {
      addToast(error.message || 'File upload failed. Please check cloud storage credentials.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 className="gradient-text" style={{ fontSize: '2.2rem', fontWeight: 800 }}>Seller Hub</h2>
          <p style={{ color: '#9d8dbd', fontSize: '0.95rem' }}>Upload notes, analyze earnings, and manage your cloud payouts.</p>
        </div>

        <button 
          className="btn btn-primary"
          onClick={() => {
            if ((currentUser?.strikes || 0) >= 3) {
              addToast('Your account is de-activated due to copyright strikes.', 'error');
              return;
            }
            setShowUploadModal(true);
          }}
          disabled={(currentUser?.strikes || 0) >= 3}
          id="upload-notes-modal-btn"
          style={{
            opacity: (currentUser?.strikes || 0) >= 3 ? 0.5 : 1,
            cursor: (currentUser?.strikes || 0) >= 3 ? 'not-allowed' : 'pointer'
          }}
        >
          <Plus size={18} />
          Upload New Note
        </button>
      </div>

      {/* Account Standing & Copyright Strikes Banner */}
      {(currentUser?.strikes || 0) >= 3 ? (
        <div style={{
          padding: '1.5rem 2rem',
          borderRadius: '16px',
          marginBottom: '2rem',
          background: 'rgba(255, 23, 68, 0.08)',
          border: '2px solid #ff1744',
          boxShadow: '0 0 20px rgba(255, 23, 68, 0.15)'
        }}>
          <h3 style={{ color: '#ff1744', fontWeight: 800, fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            🚫 Account De-activated
          </h3>
          <p style={{ color: '#f1ecf9', fontSize: '0.95rem', lineHeight: 1.5 }}>
            This seller account has been de-activated because of repeat copyright infringement warnings (<strong>{currentUser.strikes}/3 strikes</strong>). Your active listings have been suspended, upload permissions are revoked, and wallet payout transactions are frozen.
          </p>
        </div>
      ) : (
        <div style={{
          padding: '1rem 1.5rem',
          borderRadius: '12px',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: (currentUser?.strikes || 0) > 0 ? 'rgba(255, 23, 68, 0.05)' : 'rgba(0, 230, 118, 0.05)',
          border: (currentUser?.strikes || 0) > 0 ? '1px solid rgba(255, 23, 68, 0.2)' : '1px solid rgba(0, 230, 118, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.25rem' }}>{(currentUser?.strikes || 0) > 0 ? '⚠️' : '🛡️'}</span>
            <div>
              <div style={{ fontWeight: 700, color: 'white', fontSize: '0.95rem' }}>Account Standing & Copyright Compliance</div>
              <div style={{ fontSize: '0.85rem', color: '#bfb3d4', marginTop: '0.1rem' }}>
                {(currentUser?.strikes || 0) > 0 
                  ? `Repeat copyright warning strikes issued: ${currentUser.strikes}/3. Avoid uploading university lecture slides.`
                  : 'In good standing. Clear of copyright warning strikes.'}
              </div>
            </div>
          </div>
          <div style={{
            fontWeight: 700,
            fontSize: '0.9rem',
            color: (currentUser?.strikes || 0) > 0 ? '#ff5252' : '#00e676',
            padding: '0.25rem 0.75rem',
            borderRadius: '50px',
            background: (currentUser?.strikes || 0) > 0 ? 'rgba(255, 23, 68, 0.1)' : 'rgba(0, 230, 118, 0.1)'
          }}>
            {(currentUser?.strikes || 0) > 0 ? `${currentUser.strikes} Strikes` : '0 Strikes'}
          </div>
        </div>
      )}

      {/* Analytics Dashboard Cards */}
      <div className="stats-grid">
        <div className="glass-card stat-card">
          <div className="stat-icon-wrapper">
            <BookOpen size={24} />
          </div>
          <div className="stat-info">
            <h4>Live Listings</h4>
            <p>{sellerNotes.length}</p>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon-wrapper">
            <BarChart2 size={24} />
          </div>
          <div className="stat-info">
            <h4>Estimated Sales</h4>
            <p>{totalSales}</p>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon-wrapper">
            <DollarSign size={24} />
          </div>
          <div className="stat-info">
            <h4>Net Earnings (85%)</h4>
            <p>${totalNetEarnings.toFixed(2)}</p>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon-wrapper" style={{ color: '#ff007a', background: 'rgba(255, 0, 122, 0.1)' }}>
            <Layers size={24} />
          </div>
          <div className="stat-info">
            <h4>Platform Cut (15%)</h4>
            <p>${totalPlatformFees.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Cloud Storage Notice */}
      {(!cloudConfig.supabaseUrl || !cloudConfig.supabaseKey || !cloudConfig.bucketName) && (
        <div style={{ background: 'rgba(255, 183, 77, 0.08)', border: '1px solid rgba(255, 183, 77, 0.3)', padding: '1rem 1.5rem', borderRadius: '12px', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '1.5rem' }}>⚠️</span>
          <div>
            <strong style={{ color: '#ffb74d' }}>Cloud Storage Not Configured:</strong> Uploaded PDFs will be saved as temporary session links in your browser. Configure your <strong>Supabase Storage</strong> keys under the <span style={{ textDecoration: 'underline', cursor: 'pointer', color: '#00f2fe' }} onClick={() => navigateTo('settings')}>Cloud Settings</span> tab to store documents permanently in your cloud bucket.
          </div>
        </div>
      )}

      {/* Seller's listings table */}
      <div className="glass-panel">
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', fontWeight: 700 }}>Your Active Listings</h3>
        
        {sellerNotes.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="styled-table" id="seller-listings-table">
              <thead>
                <tr>
                  <th>Note Title</th>
                  <th>Subject</th>
                  <th>University</th>
                  <th>Pages</th>
                  <th>List Price</th>
                  <th>Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sellerNotes.map(note => (
                  <tr key={note.id}>
                    <td style={{ fontWeight: 600, color: 'white' }}>{note.title}</td>
                    <td>
                      <span className="note-badge" style={{ margin: 0 }}>{note.subject}</span>
                    </td>
                    <td>{note.university}</td>
                    <td>{note.pagesCount} pages</td>
                    <td style={{ color: '#00f2fe', fontWeight: 700 }}>${note.price.toFixed(2)}</td>
                    <td style={{ color: '#ffb100' }}>⭐ {note.rating} ({note.reviews?.length || 0})</td>
                    <td>
                      <button 
                        className="btn btn-secondary" 
                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
                        onClick={() => navigateTo('note-details', { noteId: note.id })}
                      >
                        View Page
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#9d8dbd' }}>
            <p>You have not uploaded any study guides yet.</p>
            <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>Click "Upload New Note" to start selling on StudyShare!</p>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <GlassModal 
        isOpen={showUploadModal} 
        onClose={() => !isUploading && setShowUploadModal(false)}
        title="Upload Study Outlines"
      >
        <form onSubmit={handleUploadSubmit}>
          <div className="input-group">
            <label>Note Title *</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="e.g., Intro to Algorithms Final Outline"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              id="upload-title-input"
            />
          </div>

          <div className="input-group">
            <label>Description *</label>
            <textarea 
              className="input-field" 
              placeholder="Outline topics covered, target exams, key benefits..."
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              id="upload-desc-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group">
              <label>Subject *</label>
              <select 
                className="input-field select-field"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                id="upload-subject-select"
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Law">Law</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Engineering">Engineering</option>
                <option value="Medicine">Medicine</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="input-group">
              <label>Price ($) *</label>
              <input 
                type="number" 
                min="0.99" 
                step="0.01" 
                className="input-field" 
                placeholder="e.g., 9.99"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                id="upload-price-input"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group">
              <label>University *</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="e.g., Stanford University"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                required
                id="upload-university-input"
              />
            </div>

            <div className="input-group">
              <label>College / Department</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="e.g., School of Engineering"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                id="upload-college-input"
              />
            </div>
          </div>

          <div className="input-group">
            <label>Total Pages</label>
            <input 
              type="number" 
              min="1" 
              className="input-field" 
              value={pagesCount}
              onChange={(e) => setPagesCount(e.target.value)}
              id="upload-pages-input"
            />
          </div>

          <div className="input-group">
            <label>Pasted Preview Content (Page 1 Text) *</label>
            <textarea 
              className="input-field" 
              placeholder="Paste Page 1 contents here so buyers can preview before purchasing..."
              rows="4"
              value={previewContent}
              onChange={(e) => setPreviewContent(e.target.value)}
              required
              id="upload-preview-input"
            />
          </div>

          <div className="input-group">
            <label>Select Note Document (PDF/PDF Image) *</label>
            <div className="dropzone" onClick={() => document.getElementById('upload-file-picker').click()}>
              <Upload size={32} style={{ color: '#8247e5' }} />
              <div>
                <p style={{ fontWeight: 600 }}>{selectedFile ? selectedFile.name : 'Click to select file'}</p>
                <p style={{ fontSize: '0.75rem', color: '#9d8dbd', marginTop: '0.25rem' }}>Supports PDF, PNG, JPG files</p>
              </div>
            </div>
            <input 
              type="file" 
              id="upload-file-picker" 
              style={{ display: 'none' }} 
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleFileChange}
              required
            />
          </div>

          {/* Copyright Certification Checkbox */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem', alignItems: 'flex-start' }}>
            <input 
              type="checkbox" 
              id="upload-copyright-cert"
              checked={copyrightCert}
              onChange={(e) => setCopyrightCert(e.target.checked)}
              style={{ marginTop: '0.2rem', cursor: 'pointer' }}
              required
            />
            <label htmlFor="upload-copyright-cert" style={{ fontSize: '0.85rem', color: '#cbbce2', lineHeight: 1.4, cursor: 'pointer', userSelect: 'none' }}>
              I certify that I am the sole author of this study guide, and it does not contain copyrighted textbooks, lecture slides, homework keys, or exam prompts.
            </label>
          </div>

          {/* Fee Notice */}
          {price && (
            <div style={{ background: 'rgba(0, 242, 254, 0.05)', border: '1px solid rgba(0, 242, 254, 0.15)', padding: '0.75rem 1rem', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1.25rem', color: '#cbbce2', marginTop: '1rem' }}>
              <strong>Platform Payout Summary:</strong> Setting price to <strong>${parseFloat(price).toFixed(2)}</strong> means you get <strong>${(price * 0.85).toFixed(2)} (85%)</strong> per download, while StudyShare takes <strong>${(price * 0.15).toFixed(2)} (15%)</strong> platform transaction fee.
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => setShowUploadModal(false)}
              disabled={isUploading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isUploading || !copyrightCert}
              style={{ opacity: isUploading || !copyrightCert ? 0.6 : 1, cursor: isUploading || !copyrightCert ? 'not-allowed' : 'pointer' }}
              id="upload-submit-btn"
            >
              Post Listing
            </button>
          </div>
        </form>
      </GlassModal>
    </div>
  );
}
