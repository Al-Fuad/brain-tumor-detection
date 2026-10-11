/**
 * API Service for Brain Tumor Detection Backend
 */

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/+$/, '');

export class ApiError extends Error {
  constructor(message, status = 500, details = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

/**
 * Check backend health status
 */
export async function checkHealth() {
  try {
    const res = await fetch(`${BASE_URL}/health`);
    if (!res.ok) {
      throw new ApiError(`Health check failed with status ${res.status}`, res.status);
    }
    return await res.json();
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(
      `Cannot connect to backend server at ${BASE_URL}. Ensure FastAPI is running.`,
      0
    );
  }
}

/**
 * Fetch model specifications and architecture metadata
 */
export async function getModelInfo() {
  try {
    const res = await fetch(`${BASE_URL}/model-info`);
    if (!res.ok) {
      throw new ApiError(`Failed to fetch model info (${res.status})`, res.status);
    }
    return await res.json();
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError('Failed to retrieve model information.', 0);
  }
}

/**
 * Send MRI image for classification
 * @param {File|Blob} file 
 */
export async function predictImage(file) {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${BASE_URL}/predict`, {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      const errorMsg = data?.message || data?.detail || `Inference failed with status ${res.status}`;
      throw new ApiError(errorMsg, res.status, data);
    }

    return data;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(
      err.message || 'Network error occurred during image prediction.',
      0
    );
  }
}
