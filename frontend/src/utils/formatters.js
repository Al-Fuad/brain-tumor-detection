/**
 * Utilities for formatting labels, colors, and clinical categories
 */

export const CLASS_CONFIG = {
  notumor: {
    label: 'No Tumor Detected',
    shortLabel: 'No Tumor',
    badgeColor: '#10b981', // Emerald green
    badgeBg: 'rgba(16, 185, 129, 0.12)',
    badgeBorder: 'rgba(16, 185, 129, 0.3)',
    severity: 'negative',
    description: 'No neoplastic mass or abnormal tissue lesion identified.',
  },
  glioma: {
    label: 'Glioma',
    shortLabel: 'Glioma',
    badgeColor: '#f43f5e', // Rose/Red
    badgeBg: 'rgba(244, 63, 94, 0.12)',
    badgeBorder: 'rgba(244, 63, 94, 0.3)',
    severity: 'positive',
    description: 'Tumor arising from glial cells (astrocytes, oligodendrocytes, or ependymal cells).',
  },
  meningioma: {
    label: 'Meningioma',
    shortLabel: 'Meningioma',
    badgeColor: '#f59e0b', // Amber
    badgeBg: 'rgba(245, 158, 11, 0.12)',
    badgeBorder: 'rgba(245, 158, 11, 0.3)',
    severity: 'positive',
    description: 'Tumor originating within the meningeal membranes surrounding the brain and spine.',
  },
  pituitary: {
    label: 'Pituitary Tumor',
    shortLabel: 'Pituitary',
    badgeColor: '#06b6d4', // Cyan
    badgeBg: 'rgba(6, 182, 212, 0.12)',
    badgeBorder: 'rgba(6, 182, 212, 0.3)',
    severity: 'positive',
    description: 'Abnormal growth developing in the pituitary gland at the base of the skull.',
  },
};

export function formatClassLabel(className) {
  if (!className) return 'Unknown';
  return CLASS_CONFIG[className]?.label || className.charAt(0).toUpperCase() + className.slice(1);
}

export function getClassConfig(className) {
  return CLASS_CONFIG[className] || {
    label: className,
    shortLabel: className,
    badgeColor: '#6366f1',
    badgeBg: 'rgba(99, 102, 241, 0.12)',
    badgeBorder: 'rgba(99, 102, 241, 0.3)',
    severity: 'neutral',
    description: 'Classified brain MRI scan pattern.',
  };
}

export function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export const SAMPLE_SCANS = [
  {
    id: 'glioma',
    key: 'glioma',
    name: 'glioma.jpg',
    label: 'Glioma',
    subtitle: 'Malignant Glial Tumor',
    image: `${import.meta.env.BASE_URL}glioma.jpg`,
    color: '#f43f5e',
    badgeBg: 'rgba(244, 63, 94, 0.15)',
    badgeBorder: 'rgba(244, 63, 94, 0.35)',
  },
  {
    id: 'meningioma',
    key: 'meningioma',
    name: 'meningioma.jpg',
    label: 'Meningioma',
    subtitle: 'Extra-axial Meninges Tumor',
    image: `${import.meta.env.BASE_URL}meningioma.jpg`,
    color: '#f59e0b',
    badgeBg: 'rgba(245, 158, 11, 0.15)',
    badgeBorder: 'rgba(245, 158, 11, 0.35)',
  },
  {
    id: 'pituitary',
    key: 'pituitary',
    name: 'pituitary.jpg',
    label: 'Pituitary',
    subtitle: 'Sellar Region Adenoma',
    image: `${import.meta.env.BASE_URL}pituitary.jpg`,
    color: '#06b6d4',
    badgeBg: 'rgba(6, 182, 212, 0.15)',
    badgeBorder: 'rgba(6, 182, 212, 0.35)',
  },
  {
    id: 'notumor',
    key: 'notumor',
    name: 'no.jpg',
    label: 'No Tumor',
    subtitle: 'Healthy Anatomical Tissue',
    image: `${import.meta.env.BASE_URL}no.jpg`,
    color: '#10b981',
    badgeBg: 'rgba(16, 185, 129, 0.15)',
    badgeBorder: 'rgba(16, 185, 129, 0.35)',
  },
];

export async function fetchSampleFile(sample) {
  const url = sample.image || sample.path;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to load sample image ${sample.name} (${res.status})`);
  }
  const blob = await res.blob();
  return new File([blob], sample.name, { type: blob.type || 'image/jpeg' });
}

