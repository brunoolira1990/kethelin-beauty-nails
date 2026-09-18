export interface GoogleBusinessConfig {
  businessName: string;
  address: string;
  placeId: string;
  locationId: string;
  apiKey: string;
  reviewUrl: string;
  mapsUrl: string;
  rating: number;
  reviewCount: number;
  isCustomUrlSet: boolean;
  updatedAt?: string;
}

const STORAGE_KEY_CONFIG = 'kethelin_google_business_config_v1';
const STORAGE_KEY_REVIEWS = 'kethelin_real_reviews_v1';

export const DEFAULT_GOOGLE_CONFIG: GoogleBusinessConfig = {
  businessName: 'Kethelin Beauty Nails',
  address: 'Rua Edmar Matosinho, 10 - Parque Bandeirantes, Mauá - SP',
  placeId: '',
  locationId: '',
  apiKey: '',
  // Direct Google search & review link for Kethelin Beauty Nails
  reviewUrl: 'https://www.google.com/maps/search/?api=1&query=Kethelin+Beauty+Nails+Rua+Edmar+Matosinho+10+Maua+SP',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Rua+Edmar+Matosinho+10+Maua+SP',
  rating: 5.0,
  reviewCount: 0,
  isCustomUrlSet: false,
};

export function getGoogleBusinessConfig(): GoogleBusinessConfig {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
    if (saved) {
      return { ...DEFAULT_GOOGLE_CONFIG, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error('Failed to parse Google Business config', e);
  }
  return DEFAULT_GOOGLE_CONFIG;
}

export function saveGoogleBusinessConfig(config: GoogleBusinessConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save Google Business config', e);
  }
}

export function buildGoogleDirectReviewUrl(placeIdOrUrl: string): string {
  if (!placeIdOrUrl) return DEFAULT_GOOGLE_CONFIG.reviewUrl;
  const trimmed = placeIdOrUrl.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  // If it's a Place ID (e.g. ChIJ...)
  return `https://search.google.com/local/writereview?placeid=${encodeURIComponent(trimmed)}`;
}

export function getQrCodeUrl(targetUrl: string, size = 260): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(
    targetUrl
  )}&margin=10`;
}
