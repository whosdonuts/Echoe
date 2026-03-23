'use client';

import dynamic from 'next/dynamic';

// The map component uses mapbox-gl which requires browser APIs — SSR disabled
const MapScreenWeb = dynamic(
  () => import('@/components/map/MapScreenWeb').then((m) => m.MapScreenWeb),
  { ssr: false, loading: () => <div style={{ flex: 1, background: '#f0ede8' }} /> },
);

export default function DiscoverPage() {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <MapScreenWeb />
    </div>
  );
}
