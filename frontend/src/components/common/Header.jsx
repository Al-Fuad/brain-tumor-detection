import React from 'react';
import { Activity, Cpu, Server, CheckCircle2, AlertTriangle } from 'lucide-react';

export function Header({ isOnline, isModelLoaded, isModelLoading, modelError, onOpenModelInfo }) {
  let statusClass = 'status-offline';
  let statusLabel = 'Backend Offline';
  let statusTitle = 'Backend disconnected';

  if (isOnline) {
    if (isModelLoaded) {
      statusClass = 'status-online';
      statusLabel = 'System Ready';
      statusTitle = 'FastAPI connected & neural model initialized';
    } else if (isModelLoading) {
      statusClass = 'status-loading';
      statusLabel = 'Model Loading...';
      statusTitle = 'Neural network model is downloading/warming up on the server';
    } else {
      statusClass = 'status-warning';
      statusLabel = 'Model Not Loaded';
      statusTitle = modelError || 'Model artifact is missing or failed to initialize';
    }
  }

  return (
    <header className="site-header">
      <div className="header-container">
        <div className="brand-group">
          <div className="brand-icon-wrapper">
            <Activity className="brand-icon" size={26} />
          </div>
          <div>
            <h1 className="brand-title">
              NeuroScan<span className="brand-accent">AI</span>
            </h1>
            <p className="brand-subtitle">Deep Learning Brain MRI Classifier</p>
          </div>
        </div>

        <div className="header-actions">
          {/* Status Indicator */}
          <div
            className={`status-pill ${statusClass}`}
            title={statusTitle}
            onClick={onOpenModelInfo}
            role="button"
            tabIndex={0}
            style={{ cursor: 'pointer' }}
          >
            <span className="status-dot"></span>
            <span className="status-text">{statusLabel}</span>
          </div>

          {/* Model Specs Trigger */}
          <button
            className="specs-btn"
            onClick={onOpenModelInfo}
            aria-label="View Model Specifications"
          >
            <Cpu size={16} />
            <span>Model Specs</span>
          </button>
        </div>
      </div>
    </header>
  );
}
