import React, { useState } from 'react';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { ImageDropzone } from './components/upload/ImageDropzone';
import { PredictionResult } from './components/prediction/PredictionResult';
import { ClassGuide } from './components/info/ClassGuide';
import { ModelInfoModal } from './components/info/ModelInfoModal';
import { ModelReportsSection } from './components/reports/ModelReportsSection';
import { usePredict } from './hooks/usePredict';
import { useBackendInfo } from './hooks/useBackendInfo';
import { fetchSampleFile } from './utils/formatters';
import './App.css';

export function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    isOnline,
    isModelLoaded,
    isModelLoading,
    modelError,
    health,
    modelInfo,
    refresh: refreshBackend,
  } = useBackendInfo();
  const {
    file,
    previewUrl,
    prediction,
    loading,
    error,
    selectFile,
    analyze,
    reset,
  } = usePredict();

  const handleSelectSample = async (sample) => {
    try {
      const sampleFile = await fetchSampleFile(sample);
      selectFile(sampleFile);
      const interactiveEl = document.getElementById('interactive-section');
      if (interactiveEl) {
        interactiveEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } catch (err) {
      console.error('Failed to load sample file:', err);
    }
  };

  const handleScrollToReports = () => {
    const el = document.getElementById('model-reports-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="app-layout">
      <Header
        isOnline={isOnline}
        isModelLoaded={isModelLoaded}
        isModelLoading={isModelLoading}
        modelError={modelError}
        onOpenModelInfo={() => setIsModalOpen(true)}
        onOpenReports={handleScrollToReports}
      />

      <main className="main-content">
        <div className="content-container">
          {/* Hero Section */}
          <section className="hero-section">
            <div className="hero-pill-row">
              <div className="hero-pill">
                <span className="pill-dot"></span>
                <span>Next-Gen Computer Vision Diagnostics</span>
              </div>
              <button
                type="button"
                className="hero-metric-badge"
                onClick={handleScrollToReports}
                title="Jump to independent validation reports"
              >
                <span className="metric-badge-dot"></span>
                <span>92.5% Test Accuracy · 0.92 F1-Score</span>
              </button>
            </div>
            <h1 className="hero-title">
              Instant Brain Tumor <br />
              <span className="gradient-text">Detection & Classification</span>
            </h1>
            <p className="hero-description">
              Upload coronal, sagittal, or axial MRI scans to immediately classify glioma,
              meningioma, pituitary adenomas, or healthy neurocranial tissue using our VGG16
              convolutional neural network.
            </p>
          </section>

          {/* Interactive Core: Dropzone or Result */}
          <section id="interactive-section" className="interactive-section">
            {!prediction ? (
              <ImageDropzone
                file={file}
                previewUrl={previewUrl}
                onSelectFile={selectFile}
                onAnalyze={analyze}
                loading={loading}
                error={error}
                isOnline={isOnline}
                isModelLoaded={isModelLoaded}
                isModelLoading={isModelLoading}
                modelError={modelError}
                onRefreshBackend={refreshBackend}
              />
            ) : (
              <PredictionResult
                prediction={prediction}
                previewUrl={previewUrl}
                onReset={reset}
                onSelectSample={handleSelectSample}
              />
            )}
          </section>

          {/* Model Reports, F1-Scores, Classification Report & Notebook Graphs */}
          <ModelReportsSection />

          {/* Classification Guide */}
          <section className="guide-section">
            <ClassGuide onSelectSample={handleSelectSample} />
          </section>
        </div>
      </main>

      <Footer />

      <ModelInfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        modelInfo={modelInfo}
        health={health}
        onNavigateToReports={handleScrollToReports}
      />
    </div>
  );
}

export default App;
