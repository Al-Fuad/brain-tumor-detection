import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { CLASS_CONFIG, SAMPLE_SCANS } from '../../utils/formatters';

export function ClassGuide({ onSelectSample }) {
  const classes = [
    {
      key: 'glioma',
      ...CLASS_CONFIG.glioma,
      prevalence: 'Common primary malignant brain tumor',
      origin: 'Glial cells (Astrocytes / Oligodendrocytes)',
      sample: SAMPLE_SCANS.find((s) => s.key === 'glioma'),
    },
    {
      key: 'meningioma',
      ...CLASS_CONFIG.meningioma,
      prevalence: 'Most frequent primary brain tumor (~37%)',
      origin: 'Arachnoid mater of meninges',
      sample: SAMPLE_SCANS.find((s) => s.key === 'meningioma'),
    },
    {
      key: 'pituitary',
      ...CLASS_CONFIG.pituitary,
      prevalence: 'Accounts for ~10-15% of intracranial tumors',
      origin: 'Sella turcica / Pituitary gland cells',
      sample: SAMPLE_SCANS.find((s) => s.key === 'pituitary'),
    },
    {
      key: 'notumor',
      ...CLASS_CONFIG.notumor,
      prevalence: 'Normal anatomical presentation',
      origin: 'Healthy neurocranial imaging',
      sample: SAMPLE_SCANS.find((s) => s.key === 'notumor'),
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

            {item.sample && (
              <div className="guide-card-preview">
                <img
                  src={item.sample.image}
                  alt={`${item.label} reference scan`}
                  className="guide-card-thumb"
                  loading="lazy"
                />
                {onSelectSample && (
                  <button
                    type="button"
                    className="guide-card-test-btn"
                    onClick={() => onSelectSample(item.sample)}
                    title={`Load and analyze ${item.label} sample scan`}
                  >
                    <span>Test This Scan</span>
                    <ArrowUpRight size={14} />
                  </button>
                )}
              </div>
            )}

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

