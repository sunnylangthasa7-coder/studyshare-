// StudyShare Notes Marketplace - Production Backend Connected (Trigger Build 2)
import React, { useContext } from 'react';
import { AppContext } from './context/AppContext';
import Navbar from './components/Navbar';
import Marketplace from './pages/Marketplace';
import NoteDetails from './pages/NoteDetails';
import SellerDashboard from './pages/SellerDashboard';
import BuyerDashboard from './pages/BuyerDashboard';
import Settings from './pages/Settings';
import Compliance from './pages/Compliance';
import { AlertCircle, CheckCircle } from 'lucide-react';

function AppContent() {
  const { currentPage, currentParams, navigateTo, toasts } = useContext(AppContext);

  // Render correct page based on simple router state
  const renderPage = () => {
    switch (currentPage) {
      case 'marketplace':
        return <Marketplace />;
      case 'note-details':
        return <NoteDetails />;
      case 'seller-dashboard':
        return <SellerDashboard />;
      case 'buyer-dashboard':
        return <BuyerDashboard />;
      case 'settings':
        return <Settings />;
      case 'compliance':
        return <Compliance type={currentParams.type} />;
      default:
        return <Marketplace />;
    }
  };

  return (
    <div className="app-container">
      <Navbar />
      
      <main>
        {renderPage()}
      </main>

      <footer className="footer">
        <p>© 2026 StudyShare Marketplace. Empowering students, protecting creators.</p>
        <div className="footer-links" style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', margin: '0.75rem 0', flexWrap: 'wrap' }}>
          <button onClick={() => navigateTo('compliance', { type: 'about' })} className="footer-link-btn">About Us</button>
          <button onClick={() => navigateTo('compliance', { type: 'contact' })} className="footer-link-btn">Contact Us</button>
          <button onClick={() => navigateTo('compliance', { type: 'privacy' })} className="footer-link-btn">Privacy Policy</button>
          <button onClick={() => navigateTo('compliance', { type: 'terms' })} className="footer-link-btn">Terms & Conditions</button>
          <button onClick={() => navigateTo('compliance', { type: 'refund' })} className="footer-link-btn">Refund Policy</button>
        </div>
        <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: '#564d75' }}>
          Platform Fee: 15% on all listings | Secured files live in your Cloud Storage
        </p>
      </footer>

      {/* Toast Notification HUD */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast ${toast.type === 'error' ? 'error' : 'success'}`}>
            {toast.type === 'error' ? (
              <AlertCircle size={18} style={{ color: '#ff1744' }} />
            ) : (
              <CheckCircle size={18} style={{ color: '#00e676' }} />
            )}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AppContent;

