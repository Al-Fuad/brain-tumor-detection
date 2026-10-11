import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Image as ImageIcon,
  Sparkles,
  AlertCircle,
  FileCheck,
  Loader2,
  AlertTriangle,
  RefreshCw,
  Clock,
} from 'lucide-react';
import { formatFileSize } from '../../utils/formatters';

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
   * Generates a sample MRI slice dynamically on an offscreen canvas
   * allowing users to test inference instantly without having to download images!
   */
  const handleLoadSample = (sampleType = 'tumor') => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Dark background
    ctx.fillStyle = '#05070c';
    ctx.fillRect(0, 0, 256, 256);

    // Brain ellipse contour
    const centerX = 128;
    const centerY = 128;
    const grad = ctx.createRadialGradient(centerX, centerY, 20, centerX, centerY, 105);
    grad.addColorStop(0, '#737373');
    grad.addColorStop(0.5, '#404040');
    grad.addColorStop(0.85, '#262626');
    grad.addColorStop(1, '#05070c');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, 88, 106, 0, 0, 2 * Math.PI);
    ctx.fill();

    // Ventricles
    ctx.fillStyle = '#171717';
    ctx.beginPath();
    ctx.ellipse(centerX - 18, centerY - 10, 8, 28, -0.15, 0, 2 * Math.PI);
    ctx.ellipse(centerX + 18, centerY - 10, 8, 28, 0.15, 0, 2 * Math.PI);
    ctx.fill();

    // Cortex fissures texture
    ctx.strokeStyle = '#262626';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      ctx.arc(centerX + (i % 2 === 0 ? 30 : -30), 80 + i * 12, 14, 0, Math.PI);
      ctx.stroke();
    }

    if (sampleType === 'tumor') {
      // High-intensity neoplastic lesion
      const lesionGrad = ctx.createRadialGradient(160, 100, 2, 160, 100, 22);
      lesionGrad.addColorStop(0, '#ffffff');
      lesionGrad.addColorStop(0.5, '#e5e5e5');
      lesionGrad.addColorStop(0.9, '#a3a3a3');
      lesionGrad.addColorStop(1, 'transparent');

      ctx.fillStyle = lesionGrad;
      ctx.beginPath();
      ctx.ellipse(160, 100, 20, 24, 0.4, 0, 2 * Math.PI);
      ctx.fill();
    }

    canvas.toBlob((blob) => {
      if (blob) {
        const sampleFile = new File(
          [blob],
          sampleType === 'tumor' ? 'sample_mri_lesion.png' : 'sample_mri_healthy.png',
          { type: 'image/png' }
        );
        onSelectFile(sampleFile);
      }
    }, 'image/png');
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

      {/* Quick Test Samples */}
      <div className="samples-bar">
        <span className="samples-label">Don't have an MRI scan handy?</span>
        <div className="samples-buttons">
          <button
            type="button"
            className="sample-btn"
            onClick={() => handleLoadSample('tumor')}
            disabled={loading}
          >
            <ImageIcon size={14} /> Sample Tumor Scan
          </button>
          <button
            type="button"
            className="sample-btn"
            onClick={() => handleLoadSample('healthy')}
            disabled={loading}
          >
            <ImageIcon size={14} /> Sample Healthy Scan
          </button>
        </div>
      </div>
    </div>
  );
}
