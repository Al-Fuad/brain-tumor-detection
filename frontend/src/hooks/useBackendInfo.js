import { useState, useEffect, useCallback } from 'react';
import { checkHealth, getModelInfo } from '../services/api';

export function useBackendInfo() {
  const [health, setHealth] = useState(null);
  const [modelInfo, setModelInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async (isSilent = false) => {
    if (!isSilent) {
      setLoading(true);
    }
    setError(null);
    try {
      const [healthData, modelData] = await Promise.all([
        checkHealth(),
        getModelInfo().catch(() => null),
      ]);
      setHealth(healthData);
      setModelInfo(modelData);
    } catch (err) {
      setError(err.message);
      setHealth({ status: 'offline', model_loaded: false, model_status: 'offline' });
    } finally {
      if (!isSilent) {
        setLoading(false);
      }
    }
  }, []);

  // Initial load
  useEffect(() => {
    refresh(false);
  }, [refresh]);

  // Dynamic polling: fast (3s) while waiting for model/backend, relaxed (25s) when ready
  useEffect(() => {
    const isReady = health?.status === 'healthy' && health?.model_loaded;
    const intervalMs = isReady ? 25000 : 3500;

    const timer = setInterval(() => {
      refresh(true);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [health?.status, health?.model_loaded, refresh]);

  const isOnline = health?.status === 'healthy';
  const isModelLoaded = Boolean(health?.model_loaded);
  const isModelLoading = Boolean(
    health?.model_loading || (isOnline && !isModelLoaded && !health?.model_error)
  );

  return {
    health,
    modelInfo,
    loading,
    error,
    refresh: () => refresh(false),
    isOnline,
    isModelLoaded,
    isModelLoading,
    modelStatus: health?.model_status || (isModelLoaded ? 'ready' : isModelLoading ? 'loading' : 'offline'),
    modelError: health?.model_error || null,
  };
}
