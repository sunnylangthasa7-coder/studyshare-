import React from 'react';
import { X } from 'lucide-react';

export default function GlassModal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>
        {title && (
          <h3 
            className="gradient-text" 
            style={{ fontSize: '1.6rem', marginBottom: '1.25rem', fontWeight: 700, paddingRight: '1.5rem' }}
          >
            {title}
          </h3>
        )}
        {children}
      </div>
    </div>
  );
}
