import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Sparkles,
  AlertCircle,
  FileCheck,
  Loader2,
  AlertTriangle,
  RefreshCw,
  Clock,
  Check,
} from 'lucide-react';
import { formatFileSize, SAMPLE_SCANS, fetchSampleFile } from '../../utils/formatters';

export function ImageDropzone({
  file,
  previewUrl,
  onSelectFile,
  onAnalyze,
  loading,
  error,
  isOnline = true,
  isModelLoaded = true,
  isModelLoading = false,
  modelError = null,
  onRefreshBackend,
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [loadingSampleId, setLoadingSampleId] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSelect(e.target.files[0]);
    }
  };

  const validateAndSelect = (selectedFile) => {
    if (!selectedFile.type.startsWith('image/')) {
      alert('Please upload a valid image file (JPEG, PNG, WEBP).');
      return;
    }
    onSelectFile(selectedFile);
  };

  /**
   * Loads one of the clinical sample MRI images provided in public/
   */
  const handleSelectSampleScan = async (sample) => {
    if (loading || loadingSampleId) return;
    try {
      setLoadingSampleId(sample.id);
      const sampleFile = await fetchSampleFile(sample);
      onSelectFile(sampleFile);
    } catch (err) {
      console.error('Failed to load sample image:', err);
      alert(`Could not load sample ${sample.label}. Please try uploading an image manually.`);
    } finally {
      setLoadingSampleId(null);
    }
  };

  return (
    <div className="upload-container">
      {/* Model Loading / Readiness Status Banner */}
      {!isOnline ? (
        <div className="model-banner model-banner-offline">
          <div className="model-banner-header">
            <div className="model-banner-icon-offline">
              <AlertCircle size={20} />
            </div>
            <div className="model-banner-info">
              <h4 className="model-banner-title">Backend Server Offline</h4>
              <p className="model-banner-desc">
                Cannot connect to the FastAPI prediction service. Ensure the backend server is running.
              </p>
            </div>
            {onRefreshBackend && (
              <button
                type="button"
                className="banner-refresh-btn"
                onClick={onRefreshBackend}
                title="Retry connecting to backend"
              >
                <RefreshCw size={14} />
                <span>Retry</span>
              </button>
            )}
          </div>
        </div>
      ) : !isModelLoaded ? (
        isModelLoading ? (
          <div className="model-banner model-banner-loading">
            <div className="model-banner-header">
              <div className="model-banner-icon-loading">
                <Loader2 className="spinner spinner-accent" size={22} />
              </div>
              <div className="model-banner-info">
                <div className="model-banner-title-row">
                  <h4 className="model-banner-title">Loading Neural Network Model...</h4>
                  <span className="model-badge model-badge-pulse">
                    <span className="pulse-dot"></span>
                    Initializing
                  </span>
                </div>
                <p className="model-banner-desc">
                  The deep learning model weights (~216 MB) are currently loading in server memory.
                  You can select or prepare your MRI scan now — analysis will automatically unlock once loaded.
                </p>
              </div>
              {onRefreshBackend && (
                <button
                  type="button"
                  className="banner-refresh-btn"
                  onClick={onRefreshBackend}
                  title="Check status now"
                >
                  <RefreshCw size={14} />
                  <span>Check Status</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="model-banner model-banner-error">
            <div className="model-banner-header">
              <div className="model-banner-icon-error">
                <AlertTriangle size={22} />
              </div>
              <div className="model-banner-info">
                <div className="model-banner-title-row">
                  <h4 className="model-banner-title">Neural Network Model Not Loaded</h4>
                  <span className="model-badge model-badge-error">Weights Missing</span>
                </div>
                <p className="model-banner-desc">
                  {modelError ||
                    'Model artifact was not found on the backend. Please check server logs or download configuration.'}
                </p>
              </div>
              {onRefreshBackend && (
                <button
                  type="button"
                  className="banner-refresh-btn"
                  onClick={onRefreshBackend}
                  title="Recheck model availability"
                >
                  <RefreshCw size={14} />
                  <span>Recheck</span>
                </button>
              )}
            </div>
          </div>
        )
      ) : null}

      {/* Drag & Drop Zone */}
      <div
        className={`dropzone glass-panel ${isDragOver ? 'dropzone-active' : ''} ${
          previewUrl ? 'dropzone-has-file' : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !previewUrl && fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          style={{ display: 'none' }}
        />

        {!previewUrl ? (
          <div className="dropzone-empty">
            <div className="upload-icon-circle">
              <UploadCloud size={38} className="upload-cloud-icon" />
            </div>
            <h3 className="dropzone-title">Upload Brain MRI Scan</h3>
            <p className="dropzone-subtitle">
              Drag & drop your MRI scan here, or <span className="browse-link">browse files</span>
            </p>
            <p className="dropzone-hint">Supports DICOM exports, PNG, JPG, JPEG (Max 15MB)</p>
          </div>
        ) : (
          <div className="dropzone-preview">
            <div className="preview-image-wrapper">
              <img src={previewUrl} alt="Selected MRI Scan" className="preview-img" />
              {loading && (
                <div className="scan-line-overlay">
                  <div className="scan-line"></div>
                </div>
              )}
            </div>

            <div className="preview-meta">
              <div className="file-info-header">
                <FileCheck size={20} className="file-check-icon" />
                <div>
                  <h4 className="file-name">{file?.name || 'Selected MRI'}</h4>
                  <p className="file-size">{file ? formatFileSize(file.size) : ''}</p>
                </div>
              </div>

              {!isModelLoaded && (
                <div className="preview-status-callout">
                  <Clock size={15} />
                  <span>
                    {isModelLoading
                      ? 'Scan ready. Waiting for model to finish loading before classifying...'
                      : 'Model not loaded on backend. Inference disabled until model is ready.'}
                  </span>
                </div>
              )}

              <div className="preview-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  disabled={loading}
                >
                  Choose Different File
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAnalyze();
                  }}
                  disabled={loading || !isModelLoaded}
                  title={
                    !isModelLoaded
                      ? isModelLoading
                        ? 'Model is loading...'
                        : 'Model not loaded'
                      : 'Classify MRI Scan'
                  }
                >
                  {loading ? (
                    <span className="btn-loading-state">
                      <span className="spinner"></span>
                      Classifying Scan...
                    </span>
                  ) : !isModelLoaded ? (
                    <span className="btn-loading-state">
                      {isModelLoading ? (
                        <>
                          <span className="spinner"></span>
                          Loading Model...
                        </>
                      ) : (
                        <>
                          <AlertTriangle size={17} />
                          Model Not Ready
                        </>
                      )}
                    </span>
                  ) : (
                    <span className="btn-label-icon">
                      <Sparkles size={18} />
                      Classify MRI Scan
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error Banner */}
      {error && (
        <div className="error-alert">
          <AlertCircle size={20} className="error-icon" />
          <p>{error}</p>
        </div>
      )}

      {/* Quick Test Pre-loaded Clinical Samples */}
      <div className="samples-showcase">
        <div className="samples-header">
          <div className="samples-header-title">
            <Sparkles size={16} className="samples-header-icon" />
            <span>Pre-loaded Clinical MRI Samples</span>
          </div>
          <span className="samples-header-subtitle">
            Click any calibrated scan below to test model inference immediately
          </span>
        </div>

        <div className="samples-grid">
          {SAMPLE_SCANS.map((sample) => {
            const isCurrentlySelected = file?.name === sample.name;
            const isLoadingThis = loadingSampleId === sample.id;

            return (
              <button
                key={sample.id}
                type="button"
                className={`sample-card glass-panel ${
                  isCurrentlySelected ? 'sample-card-selected' : ''
                } ${isLoadingThis ? 'sample-card-loading' : ''}`}
                onClick={() => handleSelectSampleScan(sample)}
                disabled={loading || loadingSampleId !== null}
                style={{
                  '--sample-accent': sample.color,
                }}
              >
                <div className="sample-thumbnail-frame">
                  <img
                    src={sample.image}
                    alt={`${sample.label} MRI Sample`}
                    className="sample-thumbnail-img"
                    loading="lazy"
                  />
                  {isLoadingThis && (
                    <div className="sample-thumbnail-overlay">
                      <Loader2 size={20} className="spinner" />
                    </div>
                  )}
                  {isCurrentlySelected && (
                    <div className="sample-selected-indicator" title="Currently selected">
                      <Check size={14} />
                    </div>
                  )}
                </div>

                <div className="sample-meta">
                  <div className="sample-badge-row">
                    <span
                      className="sample-type-badge"
                      style={{
                        color: sample.color,
                        backgroundColor: sample.badgeBg,
                        borderColor: sample.badgeBorder,
                      }}
                    >
                      {sample.label}
                    </span>
                  </div>
                  <span className="sample-name-label">{sample.subtitle}</span>
                  <span className="sample-action-hint">
                    {isCurrentlySelected ? 'Selected' : 'Click to load'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
