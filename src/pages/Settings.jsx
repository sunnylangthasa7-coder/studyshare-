import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { testCloudConnection } from '../utils/storage';
import { Cloud, Key, HardDrive, ShieldCheck, ToggleLeft, RefreshCw, BarChart } from 'lucide-react';

export default function Settings() {
  const { 
    cloudConfig, 
    saveCloudConfig, 
    platformEarnings, 
    currentUser, 
    loginUser,
    addToast 
  } = useContext(AppContext);

  // Local state for settings form
  const [supabaseUrl, setSupabaseUrl] = useState(cloudConfig.supabaseUrl || '');
  const [supabaseKey, setSupabaseKey] = useState(cloudConfig.supabaseKey || '');
  const [bucketName, setBucketName] = useState(cloudConfig.bucketName || '');

  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null); // null, 'success', 'failed'
  const [testErrorMessage, setTestErrorMessage] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    saveCloudConfig({
      supabaseUrl: supabaseUrl.trim(),
      supabaseKey: supabaseKey.trim(),
      bucketName: bucketName.trim()
    });
  };

  const handleTestConnection = async () => {
    if (!supabaseUrl || !supabaseKey || !bucketName) {
      addToast('Please enter your Supabase URL, Anon Key, and Bucket Name first.', 'error');
      return;
    }

    setIsTesting(true);
    setTestResult(null);
    setTestErrorMessage('');
    addToast('Testing connection to Supabase bucket...', 'success');

    try {
      await testCloudConnection({
        supabaseUrl: supabaseUrl.trim(),
        supabaseKey: supabaseKey.trim(),
        bucketName: bucketName.trim()
      });
      setTestResult('success');
      addToast('Successfully connected to cloud storage bucket!', 'success');
    } catch (err) {
      setTestResult('failed');
      setTestErrorMessage(err.message);
      addToast('Cloud connection test failed.', 'error');
    } finally {
      setIsTesting(false);
    }
  };

  // Quick switch role
  const handleRoleToggle = () => {
    if (!currentUser) {
      addToast('Please log in first.', 'error');
      return;
    }
    const newRole = currentUser.role === 'buyer' ? 'seller' : 'buyer';
    loginUser(currentUser.username, newRole);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 className="gradient-text" style={{ fontSize: '2.2rem', fontWeight: 800 }}>Platform Settings</h2>
        <p style={{ color: '#9d8dbd', fontSize: '0.95rem' }}>Configure cloud storage APIs, view platform analytics, and manage active profiles.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Cloud Storage Panel */}
        <section className="glass-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.75rem' }}>
            <Cloud size={22} style={{ color: '#00f2fe' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Cloud Storage Integration</h3>
          </div>
          
          <p style={{ color: '#bfb3d4', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            By default, notes uploaded are simulated using temporary local browser URLs. 
            Enter your <strong>Supabase credentials</strong> below to save uploaded notes and PDFs permanently to a 
            1 TB cloud storage bucket (or free tiers). Files will be served securely from your cloud account.
          </p>

          <form onSubmit={handleSave}>
            <div className="input-group">
              <label>Supabase Project URL</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  className="input-field" 
                  style={{ width: '100%', paddingLeft: '2.5rem' }}
                  placeholder="https://xyzcompany.supabase.co" 
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  id="settings-supabase-url-input"
                />
                <HardDrive size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#7b6d9e' }} />
              </div>
            </div>

            <div className="input-group">
              <label>Supabase Service / Anon API Key</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="password" 
                  className="input-field" 
                  style={{ width: '100%', paddingLeft: '2.5rem' }}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." 
                  value={supabaseKey}
                  onChange={(e) => setSupabaseKey(e.target.value)}
                  id="settings-supabase-key-input"
                />
                <Key size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#7b6d9e' }} />
              </div>
            </div>

            <div className="input-group">
              <label>Storage Bucket Name</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="e.g., study-notes-bucket" 
                value={bucketName}
                onChange={(e) => setBucketName(e.target.value)}
                id="settings-supabase-bucket-input"
              />
            </div>

            {testResult === 'success' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0, 230, 118, 0.1)', color: '#00e676', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: 600 }}>
                <ShieldCheck size={18} />
                <span>Cloud Storage Connected Successfully!</span>
              </div>
            )}

            {testResult === 'failed' && (
              <div style={{ background: 'rgba(255, 23, 68, 0.08)', border: '1px solid rgba(255, 23, 68, 0.3)', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.85rem', color: '#ff5252' }}>
                <strong>Connection Failed:</strong> {testErrorMessage}
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button 
                type="button" 
                className="btn btn-secondary" 
                disabled={isTesting}
                onClick={handleTestConnection}
                id="settings-test-connection-btn"
              >
                {isTesting ? <RefreshCw className="floating-element" size={16} /> : 'Test Connection'}
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                id="settings-save-config-btn"
              >
                Save Configuration
              </button>
            </div>
          </form>
        </section>

        {/* Profile / Account Switching Panel */}
        <section className="glass-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.75rem' }}>
            <ToggleLeft size={22} style={{ color: '#8247e5' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Profile Account Settings</h3>
          </div>

          {currentUser ? (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <p>Logged in as: <strong style={{ color: 'white', textTransform: 'capitalize' }}>{currentUser.username}</strong></p>
                <p style={{ color: '#9d8dbd', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                  Current active portal role: <strong style={{ color: '#00f2fe', textTransform: 'capitalize' }}>{currentUser.role}</strong>
                </p>
              </div>

              <button 
                className="btn btn-secondary" 
                onClick={handleRoleToggle}
                id="settings-role-toggle-btn"
              >
                Switch to {currentUser.role === 'buyer' ? 'Seller Hub' : 'Buyer View'}
              </button>
            </div>
          ) : (
            <p style={{ color: '#9d8dbd', fontStyle: 'italic', fontSize: '0.9rem' }}>
              You are currently browsing as a guest. Please use "Get Started" in the navbar to log in.
            </p>
          )}
        </section>

        {/* Platform statistics panel */}
        <section className="glass-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.75rem' }}>
            <BarChart size={22} style={{ color: '#ff007a' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Global Marketplace Analytics</h3>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <p style={{ color: '#9d8dbd', fontSize: '0.85rem' }}>Platform Transaction Fee</p>
              <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', marginTop: '0.25rem' }}>15% Commission cut</p>
            </div>
            
            <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '1.5rem' }}>
              <p style={{ color: '#9d8dbd', fontSize: '0.85rem' }}>Total Fees Accumulated</p>
              <p style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ff007a', marginTop: '0.25rem' }} id="platform-accumulated-fees">
                ${platformEarnings.toFixed(2)}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
