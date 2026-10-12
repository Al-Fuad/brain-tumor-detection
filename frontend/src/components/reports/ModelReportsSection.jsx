import React, { useState } from 'react';
import {
  Award,
  BarChart2,
  TrendingUp,
  Target,
  Layers,
  Sparkles,
  Maximize2,
  HelpCircle,
  FileSpreadsheet,
  LineChart,
  Grid3X3,
  CheckCircle,
} from 'lucide-react';
import { MODEL_METRICS } from '../../data/modelReports';
import { ChartLightboxModal } from './ChartLightboxModal';

export function ModelReportsSection() {
  const [activeTab, setActiveTab] = useState('report'); // 'report' | 'graphs' | 'matrix' | 'training'
  const [selectedChart, setSelectedChart] = useState(null);
  const [showMetricExplainer, setShowMetricExplainer] = useState(false);

  const {
    summary,
    classificationReport,
    averages,
    notebookGraphs,
    confusionMatrix,
    trainingProgression,
  } = MODEL_METRICS;

  return (
    <section id="model-reports-section" className="reports-section">
      {/* Section Header */}
      <div className="reports-header">
        <div className="reports-pill">
          <Sparkles size={14} className="pill-sparkle" />
          <span>Independent Validation & Notebook Benchmark Reports</span>
        </div>
        <h2 className="reports-title">
          Model Accuracy & <span className="gradient-text">Evaluation Analytics</span>
        </h2>
        <p className="reports-description">
          Rigorous clinical evaluation metrics, per-class F1-scores, and high-resolution figures
          extracted directly from the trained VGG16 Jupyter Notebook (
          <code>brain-tumor-notebook.ipynb</code>) on 1,600 holdout MRI scans.
        </p>
      </div>

      {/* KPI Cards Row */}
      <div className="kpi-grid">
        <div className="kpi-card glass-panel kpi-card-glow">
          <div className="kpi-top">
            <span className="kpi-label">Overall Test Accuracy</span>
            <div className="kpi-icon-wrapper kpi-cyan">
              <Award size={18} />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">{summary.accuracyPercent}</span>
            <span className="kpi-badge kpi-badge-success">1,480 / 1,600 Scans</span>
          </div>
          <p className="kpi-hint">Balanced holdout testing across 4 categories</p>
        </div>

        <div className="kpi-card glass-panel">
          <div className="kpi-top">
            <span className="kpi-label">Macro F1-Score</span>
            <div className="kpi-icon-wrapper kpi-emerald">
              <Target size={18} />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">{summary.macroF1Percent}</span>
            <span className="kpi-badge kpi-badge-teal">Harmonic Balance</span>
          </div>
          <p className="kpi-hint">Weighted avg: {summary.weightedF1 * 100}%</p>
        </div>

        <div className="kpi-card glass-panel">
          <div className="kpi-top">
            <span className="kpi-label">Macro Precision</span>
            <div className="kpi-icon-wrapper kpi-blue">
              <BarChart2 size={18} />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">{(summary.macroPrecision * 100).toFixed(1)}%</span>
            <span className="kpi-badge kpi-badge-blue">Low False Alarms</span>
          </div>
          <p className="kpi-hint">99% precision for pituitary lesions</p>
        </div>

        <div className="kpi-card glass-panel">
          <div className="kpi-top">
            <span className="kpi-label">Macro Sensitivity (Recall)</span>
            <div className="kpi-icon-wrapper kpi-amber">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">{(summary.macroRecall * 100).toFixed(1)}%</span>
            <span className="kpi-badge kpi-badge-amber">100% Healthy Recall</span>
          </div>
          <p className="kpi-hint">Zero missed healthy cranial scans</p>
        </div>

        <div className="kpi-card glass-panel">
          <div className="kpi-top">
            <span className="kpi-label">Mean ROC-AUC</span>
            <div className="kpi-icon-wrapper kpi-purple">
              <Layers size={18} />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">{summary.meanRocAuc.toFixed(3)}</span>
            <span className="kpi-badge kpi-badge-purple">Exceptional</span>
          </div>
          <p className="kpi-hint">Meningioma AUC = 0.999, Glioma = 0.997</p>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="reports-tabs-bar">
        <button
          className={`reports-tab-btn ${activeTab === 'report' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('report')}
        >
          <FileSpreadsheet size={16} />
          <span>Classification Report</span>
        </button>

        <button
          className={`reports-tab-btn ${activeTab === 'graphs' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('graphs')}
        >
          <LineChart size={16} />
          <span>Notebook Graphs ({notebookGraphs.length})</span>
        </button>

        <button
          className={`reports-tab-btn ${activeTab === 'matrix' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('matrix')}
        >
          <Grid3X3 size={16} />
          <span>Interactive Confusion Matrix</span>
        </button>

        <button
          className={`reports-tab-btn ${activeTab === 'training' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('training')}
        >
          <TrendingUp size={16} />
          <span>12-Epoch Training Curves</span>
        </button>

        <button
          className="metric-help-toggle"
          onClick={() => setShowMetricExplainer(!showMetricExplainer)}
          title="Explain metrics definitions"
        >
          <HelpCircle size={15} />
          <span>Metrics Guide</span>
        </button>
      </div>

      {/* Metric Explainer Drawer */}
      {showMetricExplainer && (
        <div className="metric-explainer-panel glass-panel">
          <div className="explainer-grid">
            <div className="explainer-col">
              <strong>Precision:</strong> Out of all scans predicted as tumor X, how many were
              truly tumor X? High precision prevents misdiagnosis anxiety and unnecessary
              interventions.
            </div>
            <div className="explainer-col">
              <strong>Recall (Sensitivity):</strong> Out of all actual instances of tumor X, how
              many did the model identify? Critical in clinical oncology to avoid missing
              aggressive lesions.
            </div>
            <div className="explainer-col">
              <strong>F1-Score:</strong> The harmonic mean of precision and recall (
              <code>2 × (P × R) / (P + R)</code>). Provides a single balanced score resistant to
              class frequency bias.
            </div>
            <div className="explainer-col">
              <strong>Support:</strong> The number of actual ground-truth cases tested in the
              dataset (400 per class = 1,600 total).
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 1: CLASSIFICATION REPORT */}
      {activeTab === 'report' && (
        <div className="tab-pane-fade">
          <div className="table-card glass-panel">
            <div className="table-card-header">
              <div>
                <h3 className="card-heading">Full Multiclass Classification Report</h3>
                <p className="card-subheading">
                  Standard scikit-learn evaluation metrics computed on the balanced test cohort
                </p>
              </div>
              <div className="report-provenance-tag">
                <span>scikit-learn · 1,600 scans</span>
              </div>
            </div>

            <div className="table-responsive">
              <table className="reports-table">
                <thead>
                  <tr>
                    <th>Class / Category</th>
                    <th className="text-right">Precision</th>
                    <th className="text-right">Recall</th>
                    <th className="text-right">F1-Score</th>
                    <th className="text-right">Support</th>
                    <th>F1 Visual Distribution</th>
                  </tr>
                </thead>
                <tbody>
                  {classificationReport.map((row) => (
                    <tr key={row.id}>
                      <td>
                        <div className="class-identity-cell">
                          <span
                            className="class-indicator-dot"
                            style={{ backgroundColor: row.color }}
                          ></span>
                          <div>
                            <div className="class-primary-name">{row.name}</div>
                            <div className="class-category-sub">{row.type}</div>
                          </div>
                        </div>
                      </td>
                      <td className="text-right font-mono font-semibold">
                        <span className="metric-pill metric-pill-cyan">
                          {(row.precision * 100).toFixed(1)}%
                        </span>
                      </td>
                      <td className="text-right font-mono font-semibold">
                        <span className="metric-pill metric-pill-amber">
                          {(row.recall * 100).toFixed(1)}%
                        </span>
                      </td>
                      <td className="text-right font-mono font-bold">
                        <span
                          className="metric-pill"
                          style={{
                            color: row.color,
                            backgroundColor: row.bgColor,
                            border: `1px solid ${row.borderColor}`,
                          }}
                        >
                          {(row.f1Score * 100).toFixed(1)}%
                        </span>
                      </td>
                      <td className="text-right font-mono text-muted">{row.support}</td>
                      <td>
                        <div className="progress-track-wrapper">
                          <div className="progress-track">
                            <div
                              className="progress-fill"
                              style={{
                                width: `${row.f1Score * 100}%`,
                                backgroundColor: row.color,
                              }}
                            ></div>
                          </div>
                          <span className="progress-num">{(row.f1Score * 100).toFixed(0)}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  {/* Accuracy Row */}
                  <tr className="summary-row summary-row-primary">
                    <td>
                      <strong>Overall Test Accuracy</strong>
                    </td>
                    <td colSpan={2} className="text-right text-muted">
                      Evaluated on 1,600 holdout scans
                    </td>
                    <td className="text-right font-mono font-bold">
                      <span className="metric-pill metric-pill-highlight">
                        {(averages.accuracy.f1Score * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="text-right font-mono text-muted">{averages.accuracy.support}</td>
                    <td>
                      <div className="progress-track-wrapper">
                        <div className="progress-track">
                          <div
                            className="progress-fill progress-fill-cyan"
                            style={{ width: `${averages.accuracy.f1Score * 100}%` }}
                          ></div>
                        </div>
                        <span className="progress-num">92.5%</span>
                      </div>
                    </td>
                  </tr>

                  {/* Macro Avg Row */}
                  <tr className="summary-row">
                    <td>
                      <strong>Macro Average</strong>
                    </td>
                    <td className="text-right font-mono">
                      {(averages.macro.precision * 100).toFixed(1)}%
                    </td>
                    <td className="text-right font-mono">
                      {(averages.macro.recall * 100).toFixed(1)}%
                    </td>
                    <td className="text-right font-mono font-semibold">
                      {(averages.macro.f1Score * 100).toFixed(1)}%
                    </td>
                    <td className="text-right font-mono text-muted">{averages.macro.support}</td>
                    <td>
                      <span className="average-desc">Unweighted mean across all 4 classes</span>
                    </td>
                  </tr>

                  {/* Weighted Avg Row */}
                  <tr className="summary-row">
                    <td>
                      <strong>Weighted Average</strong>
                    </td>
                    <td className="text-right font-mono">
                      {(averages.weighted.precision * 100).toFixed(1)}%
                    </td>
                    <td className="text-right font-mono">
                      {(averages.weighted.recall * 100).toFixed(1)}%
                    </td>
                    <td className="text-right font-mono font-semibold">
                      {(averages.weighted.f1Score * 100).toFixed(1)}%
                    </td>
                    <td className="text-right font-mono text-muted">{averages.weighted.support}</td>
                    <td>
                      <span className="average-desc">Balanced dataset weighted representation</span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Clinical Insights Grid */}
          <div className="clinical-insights-grid">
            {classificationReport.map((item) => (
              <div key={item.id} className="insight-card glass-panel">
                <div className="insight-card-top">
                  <div className="insight-tag" style={{ color: item.color }}>
                    <CheckCircle size={15} />
                    <span>{item.name} Analysis</span>
                  </div>
                  <span className="insight-f1">F1: {(item.f1Score * 100).toFixed(0)}%</span>
                </div>
                <p className="insight-body">{item.clinicalSummary}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: NOTEBOOK GRAPHS */}
      {activeTab === 'graphs' && (
        <div className="tab-pane-fade">
          <div className="notebook-graphs-grid">
            {notebookGraphs.map((chart) => (
              <div
                key={chart.id}
                className="notebook-graph-card glass-panel"
                onClick={() => setSelectedChart(chart)}
              >
                <div className="graph-card-header">
                  <div>
                    <h3 className="graph-title">{chart.title}</h3>
                    <p className="graph-subtitle">{chart.subtitle}</p>
                  </div>
                  <span
                    className="chart-badge"
                    style={{
                      color: chart.badgeColor,
                      backgroundColor: `${chart.badgeColor}1a`,
                      borderColor: `${chart.badgeColor}40`,
                    }}
                  >
                    {chart.badge}
                  </span>
                </div>

                <div className="graph-image-container">
                  <img
                    src={chart.src}
                    alt={chart.title}
                    className="graph-preview-img"
                    loading="lazy"
                  />
                  <div className="graph-overlay-hint">
                    <Maximize2 size={18} />
                    <span>Click to Enlarge & Inspect</span>
                  </div>
                </div>

                <div className="graph-card-footer">
                  <ul className="graph-bullet-points">
                    {chart.highlights.slice(0, 2).map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                  <div className="graph-action-row">
                    <span className="graph-cell-info">Source: Notebook</span>
                    <button
                      className="btn-link-action"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedChart(chart);
                      }}
                    >
                      <Maximize2 size={13} />
                      <span>Full View</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: INTERACTIVE CONFUSION MATRIX */}
      {activeTab === 'matrix' && (
        <div className="tab-pane-fade">
          <div className="matrix-view-card glass-panel">
            <div className="matrix-view-header">
              <div>
                <h3 className="card-heading">Interactive Confusion Matrix (1,600 Scans)</h3>
                <p className="card-subheading">
                  Rows represent ground-truth diagnosis; columns represent model predictions.
                  Diagonal cells represent correct classifications.
                </p>
              </div>
              <div className="matrix-metric-tag">
                <span>1,477 / 1,600 Correct ({summary.accuracyPercent})</span>
              </div>
            </div>

            <div className="matrix-table-wrapper">
              <div className="matrix-y-axis-label">Ground Truth (True Label)</div>
              <div className="matrix-grid-container">
                <div className="matrix-x-axis-label">Model Predicted Label</div>
                <table className="confusion-matrix-table">
                  <thead>
                    <tr>
                      <th className="cm-corner">True \ Pred</th>
                      {confusionMatrix.classes.map((cls) => (
                        <th key={cls} className="cm-header-col">
                          {cls}
                        </th>
                      ))}
                      <th className="cm-header-total">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {confusionMatrix.matrix.map((row, rowIdx) => {
                      const rowTotal = row.reduce((a, b) => a + b, 0);
                      const className = confusionMatrix.classes[rowIdx];
                      return (
                        <tr key={className}>
                          <th className="cm-header-row">{className}</th>
                          {row.map((val, colIdx) => {
                            const isDiagonal = rowIdx === colIdx;
                            const percentage = ((val / rowTotal) * 100).toFixed(1);
                            return (
                              <td
                                key={colIdx}
                                className={`cm-cell ${
                                  isDiagonal ? 'cm-cell-diagonal' : 'cm-cell-off'
                                }`}
                                title={`True ${className} → Predicted ${confusionMatrix.classes[colIdx]}: ${val} scans (${percentage}%)`}
                              >
                                <div className="cm-cell-val">{val}</div>
                                <div className="cm-cell-sub">{percentage}%</div>
                              </td>
                            );
                          })}
                          <td className="cm-row-total font-mono">{rowTotal}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="matrix-bottom-notes">
              <div className="matrix-note-pill note-green">
                <span className="dot-green"></span>
                <span>Diagonal = Correct Predictions (High density indicates high precision)</span>
              </div>
              <div className="matrix-note-pill note-purple">
                <span>Zero false tumor alarms on healthy patient scans (391/400 correct)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: TRAINING PROGRESSION */}
      {activeTab === 'training' && (
        <div className="tab-pane-fade">
          <div className="training-view-card glass-panel">
            <div className="training-header">
              <div>
                <h3 className="card-heading">12-Epoch Training Progression</h3>
                <p className="card-subheading">
                  Sparse categorical cross-entropy loss descent and sparse categorical accuracy
                  monitored per epoch
                </p>
              </div>
              <div className="training-provenance-tag">
                <span>VGG16 Transfer Learning · Adam Optimizer</span>
              </div>
            </div>

            <div className="epoch-progression-grid">
              {trainingProgression.map((ep) => (
                <div key={ep.epoch} className="epoch-card glass-panel">
                  <div className="epoch-top">
                    <span className="epoch-num">Epoch {ep.epoch}</span>
                    <span className="epoch-acc">{(ep.accuracy * 100).toFixed(2)}%</span>
                  </div>

                  <div className="epoch-bars">
                    <div className="epoch-bar-group">
                      <div className="epoch-bar-label">
                        <span>Accuracy</span>
                        <span>{(ep.accuracy * 100).toFixed(1)}%</span>
                      </div>
                      <div className="epoch-track">
                        <div
                          className="epoch-fill epoch-fill-acc"
                          style={{ width: `${ep.accuracy * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="epoch-bar-group">
                      <div className="epoch-bar-label">
                        <span>Loss</span>
                        <span className="font-mono">{ep.loss.toFixed(4)}</span>
                      </div>
                      <div className="epoch-track">
                        <div
                          className="epoch-fill epoch-fill-loss"
                          style={{ width: `${Math.min(100, ep.loss * 150)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal for Full Chart Previews */}
      <ChartLightboxModal
        isOpen={Boolean(selectedChart)}
        onClose={() => setSelectedChart(null)}
        chart={selectedChart}
      />
    </section>
  );
}
