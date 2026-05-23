import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { BookOpen, Wallet, LogOut, User, LayoutDashboard, Plus, Settings } from 'lucide-react';

export default function Navbar() {
  const { 
    currentUser, 
    currentPage, 
    navigateTo, 
    loginUser, 
    loginWithGoogle,
    logoutUser, 
    depositFunds,
    cloudConfig,
    hasEnvConfig,
    addToast 
  } = useContext(AppContext);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showGoogleMockSelector, setShowGoogleMockSelector] = useState(false);
  const [customGoogleName, setCustomGoogleName] = useState('');
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [showCustomGoogleForm, setShowCustomGoogleForm] = useState(false);
  
  // Login states
  const [usernameInput, setUsernameInput] = useState('');
  const [roleInput, setRoleInput] = useState('buyer');

  // Deposit states
  const [depositAmount, setDepositAmount] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!usernameInput) return;
    loginUser(usernameInput, roleInput);
    setShowLoginModal(false);
    setUsernameInput('');
  };

  const handleGoogleLogin = async () => {
    const { supabaseUrl, supabaseKey } = cloudConfig;
    if (supabaseUrl && supabaseKey) {
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(supabaseUrl, supabaseKey);
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            queryParams: {
              access_type: 'offline',
              prompt: 'consent',
            },
            redirectTo: window.location.origin
          }
        });
        if (error) throw error;
      } catch (e) {
        addToast('Supabase Google OAuth initialization failed: ' + e.message, 'error');
      }
    } else {
      setShowGoogleMockSelector(true);
      setShowLoginModal(false);
    }
  };

  const selectMockGoogleAccount = (account) => {
    loginWithGoogle(account.email, account.name, account.avatarUrl, roleInput);
    setShowGoogleMockSelector(false);
  };

  const handleCustomGoogleSubmit = (e) => {
    e.preventDefault();
    if (!customGoogleName.trim() || !customGoogleEmail.trim()) {
      addToast('Name and Email are required', 'error');
      return;
    }
    const email = customGoogleEmail.trim().toLowerCase();
    const name = customGoogleName.trim();
    const avatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`;
    
    loginWithGoogle(email, name, avatarUrl, roleInput);
    setShowGoogleMockSelector(false);
    setCustomGoogleName('');
    setCustomGoogleEmail('');
    setShowCustomGoogleForm(false);
  };

  const handleDepositSubmit = (e) => {
    e.preventDefault();
    const amt = parseFloat(depositAmount);
    if (isNaN(amt) || amt <= 0) {
      addToast('Please enter a valid positive number.', 'error');
      return;
    }
    depositFunds(amt);
    setShowDepositModal(false);
    setDepositAmount('');
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-logo" onClick={() => navigateTo('marketplace')}>
          <BookOpen size={28} className="accent-text" style={{ color: '#00f2fe' }} />
          <span className="gradient-text" style={{ fontWeight: 800 }}>Study<span style={{ color: '#8247e5' }}>Share</span></span>
        </div>

        <ul className="nav-links">
          <li 
            className={`nav-item ${currentPage === 'marketplace' ? 'active' : ''}`}
            onClick={() => navigateTo('marketplace')}
          >
            Marketplace
          </li>
          
          {currentUser && currentUser.role === 'buyer' && (
            <li 
              className={`nav-item ${currentPage === 'buyer-dashboard' ? 'active' : ''}`}
              onClick={() => navigateTo('buyer-dashboard')}
            >
              My Purchases
            </li>
          )}

          {currentUser && currentUser.role === 'seller' && (
            <li 
              className={`nav-item ${currentPage === 'seller-dashboard' ? 'active' : ''}`}
              onClick={() => navigateTo('seller-dashboard')}
            >
              Seller Dashboard
            </li>
          )}

          {!hasEnvConfig && (
            <li 
              className={`nav-item ${currentPage === 'settings' ? 'active' : ''}`}
              onClick={() => navigateTo('settings')}
            >
              Cloud Settings
            </li>
          )}
        </ul>

        <div className="nav-actions">
          {currentUser ? (
            <>
              {currentUser.role === 'buyer' && (
                <div 
                  className="wallet-pill" 
                  onClick={() => setShowDepositModal(true)}
                  title="Click to add mock funds"
                  style={{ cursor: 'pointer' }}
                >
                  <Wallet size={16} />
                  <span>${currentUser.wallet.toFixed(2)}</span>
                </div>
              )}
              {currentUser.role === 'seller' && (
                <div className="wallet-pill" style={{ borderColor: 'rgba(130, 71, 229, 0.4)', color: '#cbbce2', background: 'rgba(130, 71, 229, 0.05)' }}>
                  <LayoutDashboard size={16} />
                  <span>Earnings: ${currentUser.wallet.toFixed(2)}</span>
                </div>
              )}
              
              <button className="profile-btn" style={{ padding: currentUser.avatarUrl ? '0.2rem 1rem 0.2rem 0.4rem' : '0.4rem 1rem' }}>
                {currentUser.avatarUrl ? (
                  <img 
                    src={currentUser.avatarUrl} 
                    alt="profile" 
                    style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} 
                  />
                ) : (
                  <User size={16} />
                )}
                <span style={{ textTransform: 'capitalize' }}>
                  {currentUser.name || currentUser.username.split('@')[0]} ({currentUser.role})
                </span>
              </button>

              <button 
                className="btn btn-secondary" 
                style={{ padding: '0.4rem 0.8rem' }} 
                onClick={logoutUser}
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <button 
              className="btn btn-primary" 
              onClick={() => setShowLoginModal(true)}
              id="login-trigger-btn"
            >
              Get Started / Login
            </button>
          )}
        </div>
      </nav>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="modal-overlay" onClick={() => setShowLoginModal(false)}>
          <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
            <h2 className="gradient-text" style={{ fontSize: '1.8rem', marginBottom: '1rem', fontWeight: 700 }}>Welcome to StudyShare</h2>
            <p style={{ color: '#9d8dbd', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              Sign up or log in instantly to buy or sell notes.
            </p>
            
            <form onSubmit={handleLoginSubmit}>
              <div className="input-group">
                <label>Choose Username</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="e.g., student_123" 
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  required
                  id="login-username-input"
                />
              </div>

              <div className="input-group">
                <label>I want to:</label>
                <select 
                  className="input-field select-field"
                  value={roleInput}
                  onChange={(e) => setRoleInput(e.target.value)}
                  id="login-role-select"
                >
                  <option value="buyer">Buy & Download Notes</option>
                  <option value="seller">Sell & Upload Notes</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowLoginModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" id="login-submit-btn">
                  Continue
                </button>
              </div>
            </form>
            
            <div className="divider-container" style={{ margin: '1.5rem 0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }}></div>
              <span style={{ color: '#9d8dbd', fontSize: '0.85rem' }}>or</span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }}></div>
            </div>
            
            <button 
              type="button" 
              className="google-btn" 
              onClick={handleGoogleLogin}
              id="google-login-btn"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" style={{ marginRight: '2px' }}>
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.938 5.484 18 9 18z" fill="#34A853"/>
                <path d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.173 0 7.549 0 9s.347 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.86 11.426 0 9 0 5.484 0 2.438 2.062.957 4.961l3.007 2.332c.708-2.127 2.692-3.713 5.036-3.713z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
          </div>
        </div>
      )}

      {/* Mock Google Account Selector Modal */}
      {showGoogleMockSelector && (
        <div className="modal-overlay" onClick={() => setShowGoogleMockSelector(false)}>
          <div className="modal-content glass-panel google-chooser-card" onClick={(e) => e.stopPropagation()}>
            <div className="google-brand">
              <span className="g-letter-blue">G</span>
              <span className="g-letter-red">o</span>
              <span className="g-letter-yellow">o</span>
              <span className="g-letter-blue">g</span>
              <span className="g-letter-green">l</span>
              <span className="g-letter-red">e</span>
            </div>
            
            <h3 style={{ fontSize: '1.4rem', color: '#fff', fontWeight: 600, marginBottom: '0.25rem' }}>
              Choose an account
            </h3>
            <p style={{ color: '#9d8dbd', fontSize: '0.85rem', marginBottom: '1rem' }}>
              to continue to <strong style={{ color: '#00f2fe' }}>StudyShare</strong> as <span className="gradient-text" style={{ fontWeight: 700, textTransform: 'capitalize' }}>{roleInput}</span>
            </p>
            
            <div className="google-account-list">
              {[
                {
                  name: 'Sunny Thasa',
                  email: 'sunny.notes@gmail.com',
                  avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=sunny'
                },
                {
                  name: 'Jessica Chen',
                  email: 'jessica.chen@university.edu',
                  avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=jessica'
                },
                {
                  name: 'Alex Martinez',
                  email: 'alex.martinez@studyshare.com',
                  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex'
                }
              ].map((acc) => (
                <div 
                  key={acc.email} 
                  className="google-account-item"
                  onClick={() => selectMockGoogleAccount(acc)}
                  style={{ userSelect: 'none' }}
                >
                  <div className="google-account-avatar">
                    <img src={acc.avatarUrl} alt={acc.name} />
                  </div>
                  <div className="google-account-details">
                    <span className="google-account-name">{acc.name}</span>
                    <span className="google-account-email">{acc.email}</span>
                  </div>
                  <span className={`google-role-indicator ${roleInput}`}>
                    {roleInput}
                  </span>
                </div>
              ))}
            </div>

            {!showCustomGoogleForm ? (
              <button 
                type="button" 
                className="btn btn-secondary" 
                style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', fontSize: '0.9rem' }}
                onClick={() => setShowCustomGoogleForm(true)}
                id="google-custom-mock-trigger"
              >
                Use another mock account
              </button>
            ) : (
              <form onSubmit={handleCustomGoogleSubmit} className="google-custom-input-section">
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    className="input-field" 
                    style={{ flex: 1, padding: '0.5rem 0.75rem', fontSize: '0.9rem' }}
                    value={customGoogleName}
                    onChange={(e) => setCustomGoogleName(e.target.value)}
                    required
                    id="google-custom-name"
                  />
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    className="input-field" 
                    style={{ flex: 1, padding: '0.5rem 0.75rem', fontSize: '0.9rem' }}
                    value={customGoogleEmail}
                    onChange={(e) => setCustomGoogleEmail(e.target.value)}
                    required
                    id="google-custom-email"
                  />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                    onClick={() => setShowCustomGoogleForm(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                    id="google-custom-submit"
                  >
                    Sign In
                  </button>
                </div>
              </form>
            )}

            <div className="google-footer-text">
              To continue, Google will share your name, email address, language preference, and profile picture with StudyShare.
            </div>
            
            <button 
              type="button" 
              className="btn btn-secondary" 
              style={{ marginTop: '1.25rem', width: '100%', justifyContent: 'center', borderColor: 'rgba(255, 255, 255, 0.05)' }} 
              onClick={() => {
                setShowGoogleMockSelector(false);
                setShowLoginModal(true);
              }}
              id="google-back-to-login"
            >
              Back to Login Options
            </button>
          </div>
        </div>
      )}

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="modal-overlay" onClick={() => setShowDepositModal(false)}>
          <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
            <h2 className="gradient-text" style={{ fontSize: '1.8rem', marginBottom: '1rem', fontWeight: 700 }}>Add Mock Funds</h2>
            <p style={{ color: '#9d8dbd', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              Simulate depositing funds to your wallet to purchase notes.
            </p>
            
            <form onSubmit={handleDepositSubmit}>
              <div className="input-group">
                <label>Deposit Amount ($)</label>
                <input 
                  type="number" 
                  min="1" 
                  step="0.01" 
                  className="input-field" 
                  placeholder="e.g., 50.00" 
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  required
                  id="deposit-amount-input"
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowDepositModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" id="deposit-submit-btn">
                  Deposit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
