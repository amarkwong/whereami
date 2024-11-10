// app/components/StreetView.tsx
'use client';

import React, { FC, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useGameContext } from '../context/GameContext';
import Countdown from './Countdown';

interface StreetViewProps {
  lat: number;
  lng: number;
}

declare global {
  interface Window {
    initMap: () => void;
    google: any;
  }
}

const StreetView: FC<StreetViewProps> = ({ lat, lng }) => {
  const streetViewRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { setActualLocation } = useGameContext();

  // Set the actual location in context
  useEffect(() => {
    setActualLocation({ lat, lng });
  }, [lat, lng, setActualLocation]);

  useEffect(() => {
    const scriptId = 'google-maps-script';

    window.initMap = function initMap() {
      if (streetViewRef.current) {
        new window.google.maps.StreetViewPanorama(streetViewRef.current, {
          position: { lat, lng },
          pov: { heading: 0, pitch: 0 },
          addressControl: false,
          linksControl: true,
          panControl: false,
          zoomControl: false,
          fullscreenControl: false,
          motionTrackingControl: false,
          enableCloseButton: false,
          showRoadLabels: false,
          clickToGo: true,
          disableDefaultUI: true,
        });
      }
    };

    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&callback=initMap`;
      script.async = true;
      document.head.appendChild(script);
    } else if (window.google && window.google.maps) {
      window.initMap();
    }
  }, [lat, lng]);

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      {/* Countdown component */}
      <Countdown
        seconds={90}
        onComplete={() => router.push('/guess-map')} // Redirect without query parameters
      />

      {/* Street View container */}
      <div
        ref={streetViewRef}
        style={{ width: '100%', height: '100%', zIndex: 1 }}
      />
    </div>
  );
};

export default StreetView;