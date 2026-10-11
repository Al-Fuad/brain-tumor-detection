import { useState, useEffect, useCallback } from 'react';
import { checkHealth, getModelInfo } from '../services/api';

export function useBackendInfo() {
  const [health, setHealth] = useState(null);
  const [modelInfo, setModelInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
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
      setHealth({ status: 'offline', model_loaded: false });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    health,
    modelInfo,
    loading,
    error,
    refresh,
    isOnline: health?.status === 'healthy',
    isModelLoaded: Boolean(health?.model_loaded),
  };
}
