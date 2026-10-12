import React from 'react';
import { getClassConfig } from '../../utils/formatters';

export function ConfidenceBar({ label, _probability, percentage, isTop }) {
  const config = getClassConfig(label);

  return (
    <div className={`confidence-item ${isTop ? 'confidence-item-top' : ''}`}>
      <div className="confidence-header">
        <div className="confidence-label-group">
          <span
            className="confidence-color-dot"
            style={{ backgroundColor: config.badgeColor }}
          ></span>
          <span className="confidence-name">{config.label}</span>
          {isTop && <span className="top-badge">Top Match</span>}
        </div>
        <div className="confidence-value-group">
          <span className="confidence-percentage">{percentage.toFixed(1)}%</span>
        </div>
      </div>

      <div className="progress-track">
        <div
          className="progress-fill"
          style={{
            width: `${Math.min(100, Math.max(0, percentage))}%`,
            backgroundColor: config.badgeColor,
            boxShadow: isTop ? `0 0 12px ${config.badgeColor}66` : 'none',
          }}
        ></div>
      </div>
    </div>
  );
}
