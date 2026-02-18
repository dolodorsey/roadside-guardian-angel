import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface SOSMapProps {
  center: { lat: number; lng: number };
  zoom?: number;
  markers?: { lat: number; lng: number; color?: string; label?: string; pulse?: boolean }[];
  className?: string;
}

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const makeIcon = (color: string, pulse: boolean) => {
  const s = pulse ? 20 : 14;
  return L.divIcon({
    className: '',
    iconSize: [s, s],
    iconAnchor: [s / 2, s / 2],
    html: `<div style="position:relative;width:${s}px;height:${s}px;">${pulse ? `<div style="position:absolute;inset:-6px;border-radius:50%;background:${color}33;animation:sos-ring 2s ease-out infinite;"></div>` : ''}<div style="width:${s}px;height:${s}px;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 2px 8px ${color}66;"></div></div>`,
  });
};

const SOSMap: React.FC<SOSMapProps> = ({ center, zoom = 15, markers = [], className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!ref.current || mapRef.current) return;
    const map = L.map(ref.current, { center: [center.lat, center.lng], zoom, zoomControl: false, attributionControl: false });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', { maxZoom: 19 }).addTo(map);
    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  useEffect(() => { mapRef.current?.setView([center.lat, center.lng], zoom, { animate: true }); }, [center.lat, center.lng, zoom]);

  useEffect(() => {
    if (!mapRef.current) return;
    markersRef.current.forEach(m => m.remove());
    markersRef.current = markers.map(m => {
      const marker = L.marker([m.lat, m.lng], { icon: makeIcon(m.color || '#f97316', m.pulse || false) }).addTo(mapRef.current!);
      if (m.label) marker.bindTooltip(m.label, { permanent: true, direction: 'top', offset: [0, -14], className: 'sos-tooltip' });
      return marker;
    });
  }, [markers]);

  return <div ref={ref} className={`w-full h-full ${className}`} />;
};

export default SOSMap;
