import React, { useState } from 'react';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { ImageDropzone } from './components/upload/ImageDropzone';
import { PredictionResult } from './components/prediction/PredictionResult';
import { ClassGuide } from './components/info/ClassGuide';
import { ModelInfoModal } from './components/info/ModelInfoModal';
import { usePredict } from './hooks/usePredict';
import { useBackendInfo } from './hooks/useBackendInfo';
import './App.css';

export function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isOnline, isModelLoaded, health, modelInfo } = useBackendInfo();
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

  return (
    <div className="app-layout">
      <Header
        isOnline={isOnline}
        isModelLoaded={isModelLoaded}
        onOpenModelInfo={() => setIsModalOpen(true)}
      />

      <main className="main-content">
        <div className="content-container">
          {/* Hero Section */}
          <section className="hero-section">
            <div className="hero-pill">
              <span className="pill-dot"></span>
              <span>Next-Gen Computer Vision Diagnostics</span>
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
          <section className="interactive-section">
            {!prediction ? (
              <ImageDropzone
                file={file}
                previewUrl={previewUrl}
                onSelectFile={selectFile}
                onAnalyze={analyze}
                loading={loading}
                error={error}
              />
            ) : (
              <PredictionResult
                prediction={prediction}
                previewUrl={previewUrl}
                onReset={reset}
              />
            )}
          </section>

          {/* Classification Guide */}
          <section className="guide-section">
            <ClassGuide />
          </section>
        </div>
      </main>

      <Footer />

      <ModelInfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        modelInfo={modelInfo}
        health={health}
      />
    </div>
  );
}

export default App;
