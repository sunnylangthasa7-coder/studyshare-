import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Mail, Phone, MapPin, Info, Shield, FileText, RefreshCw, Send, ArrowLeft } from 'lucide-react';

export default function Compliance({ type }) {
  const { navigateTo, addToast } = useContext(AppContext);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      addToast('Please fill out all fields.', 'error');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      addToast('Message sent! We will respond within 24 hours.', 'success');
      setFormData({ name: '', email: '', message: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  // Render the specific policy/page content
  const renderContent = () => {
    switch (type) {
      case 'about':
        return (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <Info size={24} style={{ color: '#00f2fe' }} />
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>About StudyShare</h3>
            </div>
            <div className="prose-content" style={{ color: '#bfb3d4', lineHeight: 1.7, fontSize: '1rem' }}>
              <p style={{ marginBottom: '1.25rem' }}>
                <strong>StudyShare</strong> is a premium, decentralized study notes marketplace created to empower students around the globe. 
                Our platform provides a secure environment for students to share, buy, and sell high-quality lecture summaries, 
                exam preparation guides, and academic reference notes.
              </p>
              <p style={{ marginBottom: '1.25rem' }}>
                We believe that education should be collaborative. Students who put in hours of hard work to draft clean, concise, 
                and detailed notes deserve to be compensated. At the same time, peers looking for trusted study aids should have 
                direct access to verified student-authored materials.
              </p>
              <h4 style={{ color: '#f1ecf9', marginTop: '2rem', marginBottom: '0.75rem', fontWeight: 600 }}>Our Vision</h4>
              <p style={{ marginBottom: '1.25rem' }}>
                By removing intermediaries and keeping platform fees exceptionally low (only 15% platform fee to cover server costs), 
                we ensure that <strong>85% of all sales goes directly to the student creators</strong>. This encourages the creation 
                of premium academic content and builds a supportive educational ecosystem.
              </p>
            </div>
          </div>
        );

      case 'contact':
        return (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <Mail size={24} style={{ color: '#00f2fe' }} />
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Contact Us</h3>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem', marginTop: '1rem' }}>
              {/* Contact info details */}
              <div style={{ color: '#bfb3d4', lineHeight: 1.8 }}>
                <p style={{ marginBottom: '1.5rem' }}>
                  Have questions about your account, transactions, or note uploads? Get in touch with us! Our support team is available 24/7.
                </p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(130, 71, 229, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Mail size={18} style={{ color: '#8247e5' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: '#8247e5', fontWeight: 600 }}>Email Support</div>
                      <div style={{ color: '#f1ecf9', fontWeight: 500 }}>support@studyshare.app</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(0, 242, 254, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Phone size={18} style={{ color: '#00f2fe' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: '#00f2fe', fontWeight: 600 }}>Helpline</div>
                      <div style={{ color: '#f1ecf9', fontWeight: 500 }}>+91 98765 43210</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255, 0, 122, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <MapPin size={18} style={{ color: '#ff007a' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: '#ff007a', fontWeight: 600 }}>Office Address</div>
                      <div style={{ color: '#f1ecf9', fontWeight: 500, fontSize: '0.9rem' }}>
                        StudyShare Inc., Guwahati, Assam, 781001, India
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact form */}
              <div className="glass-card" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h4 style={{ color: '#f1ecf9', marginBottom: '1rem', fontWeight: 600 }}>Send a Message</h4>
                <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="input-group">
                    <label style={{ fontSize: '0.85rem' }}>Your Name</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                      required 
                    />
                  </div>
                  
                  <div className="input-group">
                    <label style={{ fontSize: '0.85rem' }}>Your Email</label>
                    <input 
                      type="email" 
                      className="input-field" 
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@example.com"
                      required 
                    />
                  </div>

                  <div className="input-group">
                    <label style={{ fontSize: '0.85rem' }}>Message</label>
                    <textarea 
                      className="input-field"
                      rows="4"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="How can we help you?"
                      style={{ resize: 'none', padding: '0.75rem' }}
                      required
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    className="action-btn primary-btn" 
                    disabled={isSubmitting}
                    style={{ marginTop: '0.5rem', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                  >
                    <Send size={16} />
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <Shield size={24} style={{ color: '#00f2fe' }} />
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Privacy Policy</h3>
            </div>
            <div className="prose-content" style={{ color: '#bfb3d4', lineHeight: 1.7, fontSize: '0.95rem' }}>
              <p style={{ marginBottom: '1rem' }}><em>Last Updated: May 24, 2026</em></p>
              <p style={{ marginBottom: '1.25rem' }}>
                At StudyShare, accessible from our application domain, we value the privacy of our visitors and users. This Privacy Policy document outlines the types of information collected and how we use it.
              </p>
              
              <h4 style={{ color: '#f1ecf9', marginTop: '1.5rem', marginBottom: '0.5rem', fontWeight: 600 }}>1. Information We Collect</h4>
              <p style={{ marginBottom: '1rem' }}>
                We collect essential profile details when you sign up using Google Login or standard register systems, including:
              </p>
              <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.25rem' }}>
                <li>Email address (for authentication and support identification)</li>
                <li>Display Name & Profile Avatar URL</li>
                <li>Wallet ledger data (details of note sales and purchases on the platform)</li>
              </ul>

              <h4 style={{ color: '#f1ecf9', marginTop: '1.5rem', marginBottom: '0.5rem', fontWeight: 600 }}>2. How We Use Your Information</h4>
              <p style={{ marginBottom: '1.25rem' }}>
                We use the collected details to verify your identity, secure note purchases, process payouts to seller wallets, and monitor platform activities against academic copyright infringements. We do not sell or lease your personal information to third parties.
              </p>

              <h4 style={{ color: '#f1ecf9', marginTop: '1.5rem', marginBottom: '0.5rem', fontWeight: 600 }}>3. Cookies & Session Storage</h4>
              <p style={{ marginBottom: '1.25rem' }}>
                StudyShare utilizes local browser storage (LocalStorage) to cache session details, cloud storage configuration settings, and temporary wallet balance tallies to ensure a fluid application experience.
              </p>
            </div>
          </div>
        );

      case 'terms':
        return (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <FileText size={24} style={{ color: '#00f2fe' }} />
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Terms & Conditions</h3>
            </div>
            <div className="prose-content" style={{ color: '#bfb3d4', lineHeight: 1.7, fontSize: '0.95rem' }}>
              <p style={{ marginBottom: '1rem' }}><em>Last Updated: May 24, 2026</em></p>
              <p style={{ marginBottom: '1.25rem' }}>
                Welcome to StudyShare. By accessing this web application, you agree to comply with and be bound by the following Terms & Conditions.
              </p>

              <h4 style={{ color: '#f1ecf9', marginTop: '1.5rem', marginBottom: '0.5rem', fontWeight: 600 }}>1. Academic Integrity & Copyright</h4>
              <p style={{ marginBottom: '1.25rem' }}>
                StudyShare strictly forbids the upload of plagiarized content or copyrighted materials. 
                Users are only permitted to upload notes that they have authored themselves. 
                Uploading direct scans of textbooks, exam papers distributed confidentially by instructors, or slides created by professors is a direct violation of our terms.
              </p>

              <h4 style={{ color: '#f1ecf9', marginTop: '1.5rem', marginBottom: '0.5rem', fontWeight: 600 }}>2. Copyright Strikes & Bans</h4>
              <p style={{ marginBottom: '1.25rem' }}>
                We implement a strict three-strike DMCA copyright violation rule. 
                If an uploaded document is flagged and confirmed to violate copyright laws, the note will be permanently deleted, and the seller will receive a strike. 
                Accumulating <strong>three strikes</strong> will result in an immediate, permanent ban of the user account and forfeiture of any remaining wallet balance.
              </p>

              <h4 style={{ color: '#f1ecf9', marginTop: '1.5rem', marginBottom: '0.5rem', fontWeight: 600 }}>3. Fees and Wallet Transactions</h4>
              <p style={{ marginBottom: '1.25rem' }}>
                All transaction fees, including the 15% platform fee and the 85% creator payout share, are processed electronically via simulated or verified payment links (such as Razorpay). Payouts are made directly into the verified seller's linked account.
              </p>
            </div>
          </div>
        );

      case 'refund':
        return (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <RefreshCw size={24} style={{ color: '#00f2fe' }} />
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Refund & Cancellation Policy</h3>
            </div>
            <div className="prose-content" style={{ color: '#bfb3d4', lineHeight: 1.7, fontSize: '0.95rem' }}>
              <p style={{ marginBottom: '1.25rem' }}>
                Since StudyShare operates as a digital goods marketplace offering instant access to downloadable PDF notes, our refund policy is strictly structured to protect both student buyers and content creators.
              </p>

              <h4 style={{ color: '#f1ecf9', marginTop: '1.5rem', marginBottom: '0.5rem', fontWeight: 600 }}>1. Finality of Sales</h4>
              <p style={{ marginBottom: '1.25rem' }}>
                Once a transaction is finalized and the download link is unlocked on your dashboard, the sale is considered final. 
                We do not support standard order cancellations or refunds for change-of-mind reasons.
              </p>

              <h4 style={{ color: '#f1ecf9', marginTop: '1.5rem', marginBottom: '0.5rem', fontWeight: 600 }}>2. Corrupted or Incorrect Document Claims</h4>
              <p style={{ marginBottom: '1.25rem' }}>
                If you purchase a note that is corrupted, blank, or differs entirely from the description/preview provided by the seller, 
                you may flag the listing and submit a support claim via our <strong>Contact Us</strong> page within <strong>24 hours</strong> of purchase. 
                Our support team will review the document. If verified, the transaction will be cancelled, and a full refund will be credited back to your wallet.
              </p>

              <h4 style={{ color: '#f1ecf9', marginTop: '1.5rem', marginBottom: '0.5rem', fontWeight: 600 }}>3. Cancellation of Uploads</h4>
              <p style={{ marginBottom: '1.25rem' }}>
                Sellers may delete or cancel their note listings at any time from the Seller Dashboard, provided there are no active dispute investigations on that note. Deleted notes will no longer be available for new purchases.
              </p>
            </div>
          </div>
        );

      default:
        return <p>Page not found.</p>;
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '3rem' }}>
      <button 
        onClick={() => navigateTo('marketplace')}
        style={{
          background: 'none',
          border: 'none',
          color: '#00f2fe',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          cursor: 'pointer',
          fontSize: '0.95rem',
          fontWeight: 600,
          marginBottom: '2rem',
          padding: '0.5rem 0',
          transition: 'transform 0.2s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(-4px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
      >
        <ArrowLeft size={18} />
        Back to Marketplace
      </button>

      <section className="glass-panel" style={{ padding: '2.5rem', borderRadius: '16px' }}>
        {renderContent()}
      </section>
    </div>
  );
}
