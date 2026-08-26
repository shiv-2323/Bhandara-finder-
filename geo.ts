// Calculate distance in kilometers using Haversine formula
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of Earth in KM
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function formatDistance(distanceKm: number, lang: 'hi' | 'en' = 'hi'): string {
  if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000);
    return lang === 'hi' ? `${meters} मी.` : `${meters} m`;
  }
  return lang === 'hi' ? `${distanceKm.toFixed(1)} किमी.` : `${distanceKm.toFixed(1)} km`;
}
