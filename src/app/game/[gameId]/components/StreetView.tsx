// src/app/game/[gameId]/components/StreetView.tsx
'use client';

import React, { FC, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useGameContext } from '../../../context/GameContext';
import { useLoadScript } from '@react-google-maps/api';
import CountdownTimer from './CountdownTimer';

interface Location {
  lat: number;
  lng: number;
}

interface StreetViewProps {
  location: Location;
}

const StreetView: FC<StreetViewProps> = ({ location }) => {
  const streetViewRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { setActualLocation } = useGameContext();

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!, // Ensure this is set in .env.local
    libraries: [], // Add any additional libraries if needed
  });

  // Set the actual location in context
  useEffect(() => {
    setActualLocation({ lat: location.lat, lng: location.lng });
  }, [location, setActualLocation]);

  useEffect(() => {
    if (isLoaded && window.google && streetViewRef.current) {
      new window.google.maps.StreetViewPanorama(streetViewRef.current, {
        position: { lat: location.lat, lng: location.lng },
        pov: { heading: 165, pitch: 0 },
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
  }, [isLoaded, location]);

  if (loadError) return <div>Error loading Street View</div>;
  if (!isLoaded) return <div>Loading Street View...</div>;

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      {/* Countdown component */}
      <CountdownTimer
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