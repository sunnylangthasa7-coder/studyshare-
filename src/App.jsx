import React, { useContext } from 'react';
import { AppContext } from './context/AppContext';
import Navbar from './components/Navbar';
import Marketplace from './pages/Marketplace';
import NoteDetails from './pages/NoteDetails';
import SellerDashboard from './pages/SellerDashboard';
import BuyerDashboard from './pages/BuyerDashboard';
import Settings from './pages/Settings';
import { AlertCircle, CheckCircle } from 'lucide-react';

function AppContent() {
  const { currentPage, toasts } = useContext(AppContext);

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
