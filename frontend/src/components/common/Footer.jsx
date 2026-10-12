import React from 'react';
import { ShieldAlert } from 'lucide-react';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="disclaimer-box">
          <ShieldAlert size={18} className="disclaimer-icon" />
          <p className="disclaimer-text">
            <strong>Medical Disclaimer:</strong> NeuroScan AI is designed solely for academic research,
            educational exploration, and computer vision demonstration. It is not an FDA-approved diagnostic
            medical device and must never replace clinical radiology evaluation or direct medical consultation.
          </p>
        </div>

        <div className="footer-meta">
          <p>
            Powered by VGG16 Transfer Learning • FastAPI • React
          </p>
          <p className="footer-subtext">
            MIT Licensed • NeuroScan AI Project
          </p>
        </div>
      </div>
    </footer>
  );
}
