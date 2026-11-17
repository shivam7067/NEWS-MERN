/**
 * Utility to construct consistent backend image URLs across development and production
 */

export const getBaseServerUrl = () => {
  // If explicitly configured, use VITE_SERVER_URL
  if (import.meta.env.VITE_SERVER_URL) {
    return import.meta.env.VITE_SERVER_URL.replace(/\/+$/, '');
  }

  // Otherwise, derive from VITE_API_URL (e.g., http://localhost:5000/api -> http://localhost:5000)
  if (import.meta.env.VITE_API_URL) {
    const apiUrl = import.meta.env.VITE_API_URL.trim();
    // If it's a full URL like http://... or https://...
    if (apiUrl.startsWith('http://') || apiUrl.startsWith('https://')) {
      return apiUrl.replace(/\/api\/?$/, '').replace(/\/+$/, '');
    }
  }

  // Fallback to empty string (uses current origin, where Vite proxy handles /uploads in dev)
  return '';
};

export const getFallbackImageUrl = () => {
  const serverUrl = getBaseServerUrl();
  return serverUrl ? `${serverUrl}/images/news.png` : '/images/news.png';
};

export const getImageUrl = (imagePath, customFallback = null) => {
  const fallback = customFallback || getFallbackImageUrl();

  if (!imagePath || typeof imagePath !== 'string') {
    return fallback;
  }

  const trimmed = imagePath.trim();
  if (!trimmed) {
    return fallback;
  }

  // If already an absolute URL or data URI
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:')) {
    return trimmed;
  }

  // Normalize path by stripping leading slashes
  let cleanPath = trimmed.replace(/^\/+/, '');

  // Ensure 'uploads/' prefix
  if (!cleanPath.startsWith('uploads/')) {
    cleanPath = `uploads/${cleanPath}`;
  }

  const serverUrl = getBaseServerUrl();
  return serverUrl ? `${serverUrl}/${cleanPath}` : `/${cleanPath}`;
};

export default getImageUrl;
