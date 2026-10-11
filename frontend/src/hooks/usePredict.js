import { useState, useCallback, useEffect } from 'react';
import { predictImage } from '../services/api';

export function usePredict() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Clean up object URLs when previewUrl changes or component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const selectFile = useCallback((selectedFile) => {
    if (!selectedFile) return;

    // Revoke previous url if any
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setFile(selectedFile);
    setPreviewUrl(objectUrl);
    setPrediction(null);
    setError(null);
  }, [previewUrl]);

  const analyze = useCallback(async (fileToAnalyze = file) => {
    if (!fileToAnalyze) {
      setError('Please select or upload an MRI scan first.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await predictImage(fileToAnalyze);
      setPrediction(result);
    } catch (err) {
      setError(err.message || 'An error occurred during classification.');
    } finally {
      setLoading(false);
    }
  }, [file]);

  const reset = useCallback(() => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setFile(null);
    setPreviewUrl(null);
    setPrediction(null);
    setError(null);
    setLoading(false);
  }, [previewUrl]);

  return {
    file,
    previewUrl,
    prediction,
    loading,
    error,
    selectFile,
    analyze,
    reset,
  };
}
