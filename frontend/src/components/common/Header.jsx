import React from 'react';
import { Activity, Cpu, Server, CheckCircle2, AlertTriangle } from 'lucide-react';

export function Header({ isOnline, isModelLoaded, onOpenModelInfo }) {
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
            className={`status-pill ${isOnline ? 'status-online' : 'status-offline'}`}
            title={isOnline ? 'FastAPI backend connected' : 'Backend disconnected'}
          >
            <span className="status-dot"></span>
            <span className="status-text">
              {isOnline ? (isModelLoaded ? 'System Ready' : 'Model Loading') : 'Offline'}
            </span>
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
