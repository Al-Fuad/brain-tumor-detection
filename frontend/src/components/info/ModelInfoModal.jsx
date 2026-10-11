import React from 'react';
import { X, Cpu, Layers, Database, Image as ImageIcon, Zap, CheckCircle2 } from 'lucide-react';

export function ModelInfoModal({ isOpen, onClose, modelInfo, health }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <Cpu className="modal-title-icon" size={22} />
            <h2>Model Architecture & Specifications</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="spec-grid">
            <div className="spec-card">
              <span className="spec-label">
                <Layers size={15} /> Architecture
              </span>
              <span className="spec-value">{modelInfo?.architecture || 'VGG16 Transfer Learning'}</span>
            </div>

            <div className="spec-card">
              <span className="spec-label">
                <ImageIcon size={15} /> Input Dimensions
              </span>
              <span className="spec-value">
                {modelInfo?.image_size || 256} × {modelInfo?.image_size || 256} × 3 (RGB)
              </span>
            </div>

            <div className="spec-card">
              <span className="spec-label">
                <Database size={15} /> Detectable Classes
              </span>
              <span className="spec-value">{modelInfo?.num_classes || 4} Categories</span>
            </div>

            <div className="spec-card">
              <span className="spec-label">
                <Zap size={15} /> Backend Status
              </span>
              <span className="spec-value spec-value-highlight">
                {health?.status === 'healthy' ? 'Active & Healthy' : 'Offline'}
              </span>
            </div>
          </div>

          <div className="classes-section">
            <h3>Class Output Labels</h3>
            <div className="class-pills">
              {(modelInfo?.classes || ['glioma', 'meningioma', 'notumor', 'pituitary']).map((cls) => (
                <div key={cls} className="class-pill">
                  <CheckCircle2 size={14} className="pill-check" />
                  <span>{cls.toUpperCase()}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="info-notes">
            <h4>Preprocessing Pipeline</h4>
            <ul>
              <li>Automatic conversion of MRI scans to 3-channel RGB format</li>
              <li>Bilinear interpolation resize to standard 256×256 pixels</li>
              <li>Pixel normalization scaled to [0.0, 1.0]</li>
              <li>Softmax probability distribution computed across classes</li>
            </ul>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-primary" onClick={onClose}>
            Close Specifications
          </button>
        </div>
      </div>
    </div>
  );
}
