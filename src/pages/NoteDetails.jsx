import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Star, GraduationCap, School, Calendar, ArrowLeft, Download, ShieldCheck, MessageSquarePlus } from 'lucide-react';
import GlassModal from '../components/GlassModal';

export default function NoteDetails() {
  const { 
    currentParams, 
    notes, 
    currentUser, 
    navigateTo, 
    purchaseNote, 
    reportNote,
    addReview,
    addToast 
  } = useContext(AppContext);

  const noteId = currentParams.noteId;
  const note = notes.find(n => n.id === noteId);

  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  // Copyright Report states
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('textbook');
  const [reportDetails, setReportDetails] = useState('');
  const [reporterEmail, setReporterEmail] = useState('');

  const handleReportSubmit = (e) => {
    e.preventDefault();
    if (!reporterEmail.trim()) {
      addToast('Please enter your email address.', 'error');
      return;
    }
    reportNote(note.id, reportReason, reportDetails, reporterEmail);
    setShowReportModal(false);
    setReportDetails('');
    setReporterEmail('');
  };

  if (!note) {
    return (
      <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
        <h2>Note Not Found</h2>
        <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigateTo('marketplace')}>
          Back to Marketplace
        </button>
      </div>
    );
  }

  const isOwner = currentUser && currentUser.username === note.seller;
  const isPurchased = currentUser && currentUser.purchasedIds.includes(note.id);
  const canDownload = isOwner || isPurchased;

  // Split calculation
  const platformFee = Number((note.price * 0.15).toFixed(2));
  const sellerEarnings = Number((note.price - platformFee).toFixed(2));

  const handleCheckoutConfirm = () => {
    purchaseNote(note.id);
    setShowCheckoutModal(false);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      addToast('Review comment cannot be empty.', 'error');
      return;
    }
    addReview(note.id, reviewRating, reviewComment);
    setReviewComment('');
    setReviewRating(5);
  };

  const handleBuyClick = () => {
    if (!currentUser) {
      addToast('Please login to buy study notes.', 'error');
      // Trigger log in flow
      const loginBtn = document.getElementById('login-trigger-btn');
      if (loginBtn) loginBtn.click();
      return;
    }
    setShowCheckoutModal(true);
  };

  return (
    <div>
      <button 
        className="btn btn-secondary" 
        style={{ marginBottom: '1.5rem', background: 'none', border: 'none', color: '#cbbce2' }}
        onClick={() => navigateTo('marketplace')}
        id="back-to-marketplace-btn"
      >
        <ArrowLeft size={16} />
        Back to Marketplace
      </button>

      <div className="preview-container">
        {/* Left Side: Document Previewer */}
        <div>
          <div className="pdf-preview">
            <div className="pdf-preview-header">
              <span style={{ fontSize: '0.85rem', color: '#9d8dbd', fontWeight: 600 }}>
                {note.title}
              </span>
              <span style={{ fontSize: '0.85rem', color: '#cbbce2', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                Page 1 of {note.pagesCount}
              </span>
            </div>

            <div className="pdf-preview-page">
              <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'serif', fontSize: '1rem', width: '100%', color: '#120e24' }}>
                {note.previewContent}
              </pre>

              {!canDownload && (
                <div className="blur-overlay">
                  <div className="blur-text" style={{ padding: '0 1rem' }}>
                    <p style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0b0717', marginBottom: '0.5rem' }}>Notes Locked</p>
                    <p style={{ fontSize: '0.9rem', color: '#3b2f5c', fontWeight: 550, marginBottom: '1.5rem', maxWidth: '400px' }}>
                      Purchase this study guide to unlock all {note.pagesCount} pages and start studying immediately.
                    </p>
                    <button 
                      className="btn btn-primary" 
                      onClick={handleBuyClick}
                      id="preview-purchase-btn"
                    >
                      Unlock for ${note.price.toFixed(2)}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Reviews List */}
          <div className="glass-panel reviews-section" style={{ marginTop: '2rem' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', fontWeight: 700 }}>
              Reviews & Feedback ({note.reviews?.length || 0})
            </h3>
            
            {note.reviews && note.reviews.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {note.reviews.map(rev => (
                  <div key={rev.id} className="review-item">
                    <div className="review-header">
                      <span className="review-user" style={{ textTransform: 'capitalize' }}>{rev.user}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#ffb100' }}>
                        <Star size={12} fill="#ffb100" stroke="none" />
                        <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{rev.rating}</span>
                      </div>
                    </div>
                    <p style={{ color: '#bfb3d4', fontSize: '0.9rem' }}>{rev.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#9d8dbd', fontStyle: 'italic', fontSize: '0.9rem' }}>
                No reviews yet. Be the first to leave feedback!
              </p>
            )}

            {/* Leave a review - only for buyers of this note */}
            {isPurchased && (
              <form onSubmit={handleReviewSubmit} style={{ marginTop: '2rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1.5rem' }}>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MessageSquarePlus size={16} style={{ color: '#00f2fe' }} />
                  Submit Your Review
                </h4>

                <div className="input-group">
                  <label>Rating (1 to 5 Stars)</label>
                  <select 
                    className="input-field select-field" 
                    value={reviewRating}
                    onChange={(e) => setReviewRating(e.target.value)}
                    style={{ maxWidth: '120px' }}
                  >
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                </div>

                <div className="input-group">
                  <label>Comment</label>
                  <textarea 
                    className="input-field" 
                    placeholder="Write your review details here..." 
                    rows="3"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1.2rem', fontSize: '0.9rem' }}>
                  Submit Review
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right Side: Notes details and purchase details */}
        <div className="glass-panel" style={{ height: 'fit-content' }}>
          <div className="note-badge" style={{ marginBottom: '1rem' }}>{note.subject}</div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1rem', color: '#ffffff' }}>
            {note.title}
          </h2>

          <p style={{ color: '#bfb3d4', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
            {note.description}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <GraduationCap size={18} style={{ color: '#00f2fe' }} />
              <div>
                <div style={{ fontSize: '0.75rem', color: '#9d8dbd' }}>University</div>
                <div style={{ fontWeight: 600 }}>{note.university}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <School size={18} style={{ color: '#8247e5' }} />
              <div>
                <div style={{ fontSize: '0.75rem', color: '#9d8dbd' }}>College / School</div>
                <div style={{ fontWeight: 600 }}>{note.college}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Calendar size={18} style={{ color: '#ff007a' }} />
              <div>
                <div style={{ fontSize: '0.75rem', color: '#9d8dbd' }}>Uploaded On</div>
                <div style={{ fontWeight: 600 }}>{note.uploadedAt}</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <span style={{ fontSize: '0.85rem', color: '#9d8dbd' }}>Price</span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#00f2fe' }}>${note.price.toFixed(2)}</div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#ffb100' }}>
              <Star size={16} fill="#ffb100" stroke="none" />
              <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>{note.rating}</span>
              <span style={{ color: '#9d8dbd', fontSize: '0.85rem' }}>({note.reviews?.length || 0} ratings)</span>
            </div>
          </div>

          {canDownload ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0, 230, 118, 0.1)', color: '#00e676', padding: '0.75rem', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600 }}>
                <ShieldCheck size={18} />
                <span>You own this document</span>
              </div>
              <a 
                href={note.fileUrl || '#'} 
                download
                className="btn btn-primary" 
                style={{ justifyContent: 'center' }}
                onClick={(e) => {
                  if (!note.fileUrl) {
                    e.preventDefault();
                    addToast('Simulating download of premium PDF note file...', 'success');
                  }
                }}
                id="download-note-btn"
              >
                <Download size={18} />
                Download PDF Document
              </a>
            </div>
          ) : (
            <button 
              className="btn btn-primary" 
              style={{ width: '100%', justifyContent: 'center', padding: '1rem' }}
              onClick={handleBuyClick}
              id="details-purchase-btn"
            >
              Buy & Access Outlines
            </button>
          )}
          
          <button 
            className="btn btn-secondary" 
            style={{ width: '100%', justifyContent: 'center', marginTop: '0.75rem', borderColor: 'rgba(255, 23, 68, 0.25)', color: '#ff5252', background: 'rgba(255, 23, 68, 0.03)', fontSize: '0.9rem' }}
            onClick={() => setShowReportModal(true)}
            id="report-infringement-btn"
          >
            ⚠️ Report Infringement
          </button>
        </div>
      </div>

      {/* Checkout Split Modal */}
      <GlassModal 
        isOpen={showCheckoutModal} 
        onClose={() => setShowCheckoutModal(false)}
        title="Notes Order Summary"
      >
        <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '1rem', marginBottom: '1rem' }}>
          <p style={{ color: '#9d8dbd', fontSize: '0.85rem' }}>Item description</p>
          <p style={{ fontWeight: 700, fontSize: '1.1rem', marginTop: '0.25rem' }}>{note.title}</p>
          <p style={{ fontSize: '0.85rem', color: '#bfb3d4', marginTop: '0.25rem' }}>Subject: {note.subject} | Creator: {note.seller}</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
            <span style={{ color: '#cbbce2' }}>List Price</span>
            <span>${note.price.toFixed(2)}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', color: '#ff007a' }}>
            <span>Platform Fee (15% Cut)</span>
            <span>-${platformFee.toFixed(2)}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', color: '#00e676', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.75rem' }}>
            <span>Seller Net Payout (85%)</span>
            <span>+${sellerEarnings.toFixed(2)}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 800, marginTop: '0.5rem' }}>
            <span className="gradient-text">Total Due</span>
            <span style={{ color: '#00f2fe' }}>${note.price.toFixed(2)}</span>
          </div>
        </div>

        <div style={{ background: 'rgba(130, 71, 229, 0.08)', border: '1px solid rgba(130, 71, 229, 0.25)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.85rem', color: '#cbbce2' }}>
          <strong>Transaction Split Mechanics:</strong> Out of the total amount of <strong>${note.price.toFixed(2)}</strong> paid by you, <strong>${platformFee.toFixed(2)}</strong> goes to StudyShare, and <strong>${sellerEarnings.toFixed(2)}</strong> is routed directly to <strong>{note.seller}</strong>'s wallet.
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#9d8dbd' }}>Your wallet balance</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: currentUser?.wallet >= note.price ? '#00e676' : '#ff1744' }}>
              ${currentUser?.wallet.toFixed(2)}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-secondary" onClick={() => setShowCheckoutModal(false)}>
              Cancel
            </button>
            <button 
              className="btn btn-primary" 
              onClick={handleCheckoutConfirm}
              disabled={currentUser?.wallet < note.price}
              id="confirm-checkout-btn"
            >
              Confirm & Unlock
            </button>
          </div>
        </div>
      </GlassModal>

      {/* Copyright Infringement Report Modal */}
      <GlassModal 
        isOpen={showReportModal} 
        onClose={() => setShowReportModal(false)}
        title="Report Copyright Infringement"
      >
        <p style={{ color: '#9d8dbd', fontSize: '0.9rem', marginBottom: '1.25rem', lineHeight: 1.4 }}>
          If you believe this study guide infringes your intellectual property or contains restricted university material, please submit a claim.
        </p>

        <form onSubmit={handleReportSubmit}>
          <div className="input-group">
            <label>Reason for Flagging</label>
            <select 
              className="input-field select-field"
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              id="report-reason-select"
            >
              <option value="textbook">Contains scanned textbook pages / figures</option>
              <option value="slides">Contains university slides, homework keys, or exam prompts</option>
              <option value="unauthorized">My own material uploaded without permission</option>
              <option value="other">Other copyright / plagiarism issue</option>
            </select>
          </div>

          <div className="input-group">
            <label>Specific Details</label>
            <textarea 
              className="input-field" 
              placeholder="e.g. Page 3 has scanned diagrams from Chemistry 10th edition, Chapter 4..." 
              rows="3"
              value={reportDetails}
              onChange={(e) => setReportDetails(e.target.value)}
              required
              id="report-details-input"
            />
          </div>

          <div className="input-group">
            <label>Your Email Address</label>
            <input 
              type="email" 
              className="input-field" 
              placeholder="e.g. professor@university.edu"
              value={reporterEmail}
              onChange={(e) => setReporterEmail(e.target.value)}
              required
              id="report-email-input"
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setShowReportModal(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-danger" id="report-submit-btn" style={{ background: '#ff1744' }}>
              Submit Report
            </button>
          </div>
        </form>
      </GlassModal>
    </div>
  );
}
