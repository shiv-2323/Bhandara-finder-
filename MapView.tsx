import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { BhandaraEvent, Language } from '../types';
import { calculateDistance, formatDistance } from '../utils/geo';
import { getTranslation } from '../utils/translations';

interface MapViewProps {
  bhandaras: BhandaraEvent[];
  userLat: number | null;
  userLng: number | null;
  radiusFilter: number | null;
  selectedId: string | null;
  onSelectBhandara: (id: string) => void;
  lang: Language;
}

export const MapView: React.FC<MapViewProps> = ({
  bhandaras,
  userLat,
  userLng,
  radiusFilter,
  selectedId,
  onSelectBhandara,
  lang,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletInstance = useRef<L.Map | null>(null);
  const markersGroup = useRef<L.LayerGroup | null>(null);

  // Default center: India (Delhi / Uttar Pradesh region center)
  const defaultLat = userLat || 27.5;
  const defaultLng = userLng || 79.5;
  const defaultZoom = userLat ? 11 : 6;

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize Map if not already initialized
    if (!leafletInstance.current) {
      const map = L.map(mapRef.current, {
        center: [defaultLat, defaultLng],
        zoom: defaultZoom,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: ['a', 'b', 'c'],
        maxZoom: 19,
      }).addTo(map);

      leafletInstance.current = map;
      markersGroup.current = L.layerGroup().addTo(map);
    }

    const map = leafletInstance.current;
    const group = markersGroup.current;

    if (!group) return;
    group.clearLayers();

    // Create Custom Saffron Pin Icon
    const saffronIcon = L.divIcon({
      className: 'custom-saffron-pin',
      html: `<div style="background-color: #F4811F; color: white; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3); transform: scale(1); transition: transform 0.2s;">🍛</div>`,
      iconSize: [34, 34],
      iconAnchor: [17, 17],
    });

    const selectedIcon = L.divIcon({
      className: 'custom-selected-pin',
      html: `<div style="background-color: #E8A000; color: white; width: 42px; height: 42px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 22px; border: 4px solid white; box-shadow: 0 6px 16px rgba(0,0,0,0.4); transform: scale(1.15);">🌟</div>`,
      iconSize: [42, 42],
      iconAnchor: [21, 21],
    });

    // Add User Location Marker & Circle if available
    if (userLat && userLng) {
      const userIcon = L.divIcon({
        className: 'custom-user-pin',
        html: `<div style="background-color: #3B82F6; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 6px rgba(59,130,246,0.3);"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });

      const userMarker = L.marker([userLat, userLng], { icon: userIcon }).bindPopup(
        `<div style="text-align:center; font-weight:bold; font-size:13px; padding:4px;">📍 ${
          lang === 'hi' ? 'आपकी वर्तमान स्थिति' : 'Your Current Location'
        }</div>`
      );
      group.addLayer(userMarker);

      if (radiusFilter) {
        const radiusCircle = L.circle([userLat, userLng], {
          radius: radiusFilter * 1000,
          color: '#F4811F',
          fillColor: '#F4811F',
          fillOpacity: 0.12,
          weight: 2,
        });
        group.addLayer(radiusCircle);
      }
    }

    // Add Bhandara Markers
    const bounds: [number, number][] = [];
    if (userLat && userLng) bounds.push([userLat, userLng]);

    bhandaras.forEach((b) => {
      if (!b.lat || !b.lng) return;

      const isSelected = b.id === selectedId;
      const marker = L.marker([b.lat, b.lng], {
        icon: isSelected ? selectedIcon : saffronIcon,
      });

      let distText = '';
      if (userLat && userLng) {
        const d = calculateDistance(userLat, userLng, b.lat, b.lng);
        distText = formatDistance(d, lang);
      }

      const popupContent = `
        <div style="padding: 4px; max-width: 200px;">
          <div style="font-size: 11px; font-weight: bold; color: #F4811F; text-transform: uppercase;">
            ${b.category} ${distText ? `• 📍 ${distText}` : ''}
          </div>
          <div style="font-size: 14px; font-weight: 800; margin-top: 2px; color: #1A0700;">
            ${b.name}
          </div>
          <div style="font-size: 12px; color: #666; margin-top: 4px;">
            📍 ${b.location}
          </div>
          <div style="font-size: 12px; font-weight: 600; color: #21A95A; margin-top: 4px;">
            🍽 ${b.food}
          </div>
          <button id="map-btn-${b.id}" style="margin-top: 8px; width: 100%; background: #F4811F; color: white; border: none; padding: 6px; border-radius: 20px; font-weight: bold; font-size: 11px; cursor: pointer;">
            ${lang === 'hi' ? 'विवरण देखें' : 'View Details'}
          </button>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.on('popupopen', () => {
        onSelectBhandara(b.id);
        const btn = document.getElementById(`map-btn-${b.id}`);
        if (btn) {
          btn.onclick = () => {
            const el = document.getElementById(`card-${b.id}`);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          };
        }
      });

      group.addLayer(marker);
      bounds.push([b.lat, b.lng]);
    });

    // Auto fit bounds if markers exist and no specific selectedId
    if (bounds.length > 1 && !selectedId) {
      map.fitBounds(L.latLngBounds(bounds), { padding: [40, 40], maxZoom: 14 });
    } else if (selectedId) {
      const sel = bhandaras.find((x) => x.id === selectedId);
      if (sel && sel.lat && sel.lng) {
        map.setView([sel.lat, sel.lng], 14, { animate: true });
      }
    }
  }, [bhandaras, userLat, userLng, radiusFilter, selectedId, lang]);

  const handleCenterUser = () => {
    if (leafletInstance.current && userLat && userLng) {
      leafletInstance.current.setView([userLat, userLng], 13, { animate: true });
    }
  };

  return (
    <div className="relative w-full h-[450px] lg:h-[600px] rounded-2xl overflow-hidden border-2 border-[var(--border)] shadow-sm">
      <div ref={mapRef} className="w-full h-full" />

      {/* Recenter button */}
      {userLat && userLng && (
        <button
          onClick={handleCenterUser}
          className="absolute bottom-4 right-4 z-[400] bg-white dark:bg-neutral-900 border-2 border-[#F4811F] text-[#F4811F] px-3.5 py-2 rounded-full font-extrabold text-xs shadow-md hover:bg-[#F4811F] hover:text-white transition-all flex items-center gap-1.5"
        >
          🎯 {lang === 'hi' ? 'मेरी स्थिति' : 'My Position'}
        </button>
      )}
    </div>
  );
};
