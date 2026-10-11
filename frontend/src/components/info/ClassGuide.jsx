import React from 'react';
import { ShieldCheck, AlertCircle, Eye } from 'lucide-react';
import { CLASS_CONFIG } from '../../utils/formatters';

export function ClassGuide() {
  const classes = [
    {
      key: 'glioma',
      ...CLASS_CONFIG.glioma,
      prevalence: 'Common primary malignant brain tumor',
      origin: 'Glial cells (Astrocytes / Oligodendrocytes)',
    },
    {
      key: 'meningioma',
      ...CLASS_CONFIG.meningioma,
      prevalence: 'Most frequent primary brain tumor (~37%)',
      origin: 'Arachnoid mater of meninges',
    },
    {
      key: 'pituitary',
      ...CLASS_CONFIG.pituitary,
      prevalence: 'Accounts for ~10-15% of intracranial tumors',
      origin: 'Sella turcica / Pituitary gland cells',
    },
    {
      key: 'notumor',
      ...CLASS_CONFIG.notumor,
      prevalence: 'Normal anatomical presentation',
      origin: 'Healthy neurocranial imaging',
    },
  ];

  return (
    <div className="class-guide-section">
      <div className="guide-header">
        <h3 className="guide-title">Classification Taxonomy & Characteristics</h3>
        <p className="guide-subtitle">
          Trained on thousands of T1, T2, and FLAIR post-contrast weighted MRI scans
        </p>
      </div>

      <div className="guide-grid">
        {classes.map((item) => (
          <div key={item.key} className="guide-card glass-panel">
            <div className="guide-card-top">
              <span
                className="guide-badge"
                style={{
                  color: item.badgeColor,
                  backgroundColor: item.badgeBg,
                  borderColor: item.badgeBorder,
                }}
              >
                {item.shortLabel}
              </span>
            </div>
            <h4 className="guide-item-title">{item.label}</h4>
            <p className="guide-item-desc">{item.description}</p>
            <div className="guide-item-footer">
              <span className="guide-origin-tag">{item.origin}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
