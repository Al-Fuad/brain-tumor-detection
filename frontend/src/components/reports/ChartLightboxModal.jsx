import React from 'react';
import { X, ExternalLink, ZoomIn, CheckCircle2 } from 'lucide-react';

export function ChartLightboxModal({ isOpen, onClose, chart }) {
  if (!isOpen || !chart) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-content glass-panel chart-lightbox-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title-group">
            <ZoomIn className="modal-title-icon" size={22} />
            <div>
              <h2>{chart.title}</h2>
              <p className="modal-subtitle-text">{chart.subtitle}</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close chart preview">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body chart-lightbox-body">
          <div className="chart-preview-wrapper">
            <img
              src={chart.src}
              alt={chart.title}
              className="chart-lightbox-img"
            />
          </div>

          <div className="chart-lightbox-details">
            <div className="chart-meta-badge-row">
              <span
                className="chart-badge"
                style={{
                  color: chart.badgeColor || '#06b6d4',
                  backgroundColor: `${chart.badgeColor || '#06b6d4'}22`,
                  borderColor: `${chart.badgeColor || '#06b6d4'}44`,
                }}
              >
                {chart.badge}
              </span>
              <span className="chart-source-tag">Source: brain-tumor-notebook.ipynb</span>
            </div>

            {chart.highlights && chart.highlights.length > 0 && (
              <div className="chart-highlights-block">
                <h4>Key Clinical & Analytical Observations</h4>
                <ul className="chart-highlights-list">
                  {chart.highlights.map((item, idx) => (
                    <li key={idx}>
                      <CheckCircle2 size={16} className="highlight-icon" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="chart-provenance-box">
              <ExternalLink size={16} />
              <span>{chart.caption}</span>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-primary" onClick={onClose}>
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
