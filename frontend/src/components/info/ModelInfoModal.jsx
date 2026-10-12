import React from 'react';
import {
  X,
  Cpu,
  Layers,
  Database,
  Image as ImageIcon,
  Zap,
  CheckCircle2,
  Award,
  Target,
  BarChart2,
} from 'lucide-react';
import { MODEL_METRICS } from '../../data/modelReports';

export function ModelInfoModal({ isOpen, onClose, modelInfo, health, onNavigateToReports }) {
  if (!isOpen) return null;

  const handleOpenReports = () => {
    onClose();
    if (onNavigateToReports) {
      onNavigateToReports();
    } else {
      const el = document.getElementById('model-reports-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <Cpu className="modal-title-icon" size={22} />
            <div>
              <h2>Model Architecture & Specifications</h2>
              <p className="modal-subtitle-text">VGG16 Transfer Learning · Masoud Nickparvar Dataset</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Top Benchmark Highlights */}
          <div className="modal-benchmarks-strip">
            <div className="modal-benchmark-item">
              <Award size={16} className="modal-bench-icon cyan" />
              <div>
                <div className="modal-bench-num">{MODEL_METRICS.summary.accuracyPercent}</div>
                <div className="modal-bench-label">Test Accuracy</div>
              </div>
            </div>
            <div className="modal-benchmark-item">
              <Target size={16} className="modal-bench-icon emerald" />
              <div>
                <div className="modal-bench-num">{MODEL_METRICS.summary.macroF1Percent}</div>
                <div className="modal-bench-label">Macro F1-Score</div>
              </div>
            </div>
            <div className="modal-benchmark-item">
              <BarChart2 size={16} className="modal-bench-icon purple" />
              <div>
                <div className="modal-bench-num">{MODEL_METRICS.summary.meanRocAuc.toFixed(3)}</div>
                <div className="modal-bench-label">Mean ROC-AUC</div>
              </div>
            </div>
          </div>

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
                <Zap size={15} /> Model State
              </span>
              <span
                className={`spec-value ${
                  health?.model_loaded
                    ? 'spec-value-highlight'
                    : health?.model_loading
                    ? 'spec-value-amber'
                    : 'spec-value-rose'
                }`}
              >
                {health?.model_loaded
                  ? 'Loaded & Ready'
                  : health?.model_loading
                  ? 'Loading / Warming up'
                  : 'Weights Not Loaded'}
              </span>
            </div>
          </div>

          {health?.model_error && !health?.model_loaded && (
            <div className="modal-status-notice">
              <strong>Server Notice:</strong> {health.model_error}
            </div>
          )}

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
            <h4>Preprocessing Pipeline & Verification</h4>
            <ul>
              <li>Automatic conversion of MRI scans to 3-channel RGB format</li>
              <li>Bilinear interpolation resize to standard 256×256 pixels</li>
              <li>Pixel normalization scaled to [0.0, 1.0]</li>
              <li>Validated on 1,600 balanced holdout test scans (400 per class)</li>
            </ul>
          </div>
        </div>

        <div className="modal-footer modal-footer-split">
          <button className="btn-secondary" onClick={handleOpenReports}>
            <BarChart2 size={16} />
            <span>View Full Evaluation Reports</span>
          </button>
          <button className="btn-primary" onClick={onClose}>
            Close Specifications
          </button>
        </div>
      </div>
    </div>
  );
}
