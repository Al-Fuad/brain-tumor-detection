import React from 'react';
import {
  CheckCircle,
  AlertOctagon,
  Clock,
  RotateCcw,
  Sparkles,
  Info,
  Maximize2,
  FileText,
} from 'lucide-react';
import { ConfidenceBar } from './ConfidenceBar';
import { getClassConfig, formatClassLabel } from '../../utils/formatters';

export function PredictionResult({ prediction, previewUrl, onReset }) {
  if (!prediction) return null;

  const topConfig = getClassConfig(prediction.predicted_class);
  const isTumor = prediction.is_tumor_detected;

  return (
    <div className="result-container animate-fade-in">
      <div className="result-grid">
        {/* Left Column: Image Preview with overlay badges */}
        <div className="result-image-card glass-panel">
          <div className="card-header-simple">
            <span className="card-badge-title">Analyzed MRI Scan</span>
            <span className="filename-tag">{prediction.filename || 'mri_scan.png'}</span>
          </div>

          <div className="image-display-frame">
            <img
              src={previewUrl}
              alt="Analyzed Brain MRI"
              className="analyzed-mri-image"
            />
            {/* Visual target reticle overlay */}
            <div className="mri-scan-reticle">
              <div className="reticle-corner top-left"></div>
              <div className="reticle-corner top-right"></div>
              <div className="reticle-corner bottom-left"></div>
              <div className="reticle-corner bottom-right"></div>
            </div>

            {/* Float badge over image */}
            <div
              className="image-status-pill"
              style={{
                backgroundColor: topConfig.badgeBg,
                color: topConfig.badgeColor,
                borderColor: topConfig.badgeBorder,
              }}
            >
              {isTumor ? <AlertOctagon size={16} /> : <CheckCircle size={16} />}
              <span>{topConfig.label}</span>
            </div>
          </div>

          <div className="image-metrics-bar">
            <div className="metric-chip">
              <Clock size={14} />
              <span>Inference: {prediction.inference_time_ms} ms</span>
            </div>
            <div className="metric-chip">
              <Sparkles size={14} />
              <span>Resolution: 256 × 256</span>
            </div>
          </div>
        </div>

        {/* Right Column: Prediction Details & Probabilities */}
        <div className="result-details-card glass-panel">
          {/* Main Verdict Banner */}
          <div
            className="verdict-banner"
            style={{
              borderColor: topConfig.badgeBorder,
              backgroundColor: topConfig.badgeBg,
            }}
          >
            <div className="verdict-left">
              <span className="verdict-eyebrow">Model Classification</span>
              <h2 className="verdict-title" style={{ color: topConfig.badgeColor }}>
                {topConfig.label}
              </h2>
              <p className="verdict-status-tag">
                {isTumor ? '⚠️ Neoplastic Growth Indicated' : '✅ No Abnormal Tumor Detected'}
              </p>
            </div>

            <div className="verdict-confidence">
              <span className="confidence-label">Confidence</span>
              <span className="confidence-number" style={{ color: topConfig.badgeColor }}>
                {prediction.confidence_percentage}%
              </span>
            </div>
          </div>

          {/* Clinical Insights */}
          <div className="clinical-description-box">
            <div className="description-header">
              <Info size={16} className="desc-icon" />
              <span>Clinical Profile Summary</span>
            </div>
            <p className="description-text">{prediction.description}</p>
          </div>

          {/* Probabilities Distribution */}
          <div className="probabilities-section">
            <h3 className="section-title">Probability Distribution</h3>
            <div className="probabilities-list">
              {prediction.class_probabilities.map((item, index) => (
                <ConfidenceBar
                  key={item.label}
                  label={item.label}
                  probability={item.probability}
                  percentage={item.percentage}
                  isTop={index === 0}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="result-actions">
            <button className="btn-secondary" onClick={onReset}>
              <RotateCcw size={16} />
              <span>Analyze Another MRI</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
