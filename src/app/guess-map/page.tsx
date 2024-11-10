// app/guess-map/page.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useJsApiLoader, GoogleMap, Marker, Polyline } from '@react-google-maps/api';
import { useGameContext } from '../context/GameContext';
import Countdown from '../components/Countdown';

interface LatLngLiteral {
  lat: number;
  lng: number;
}

const containerStyle = {
  width: '100%',
  height: '100vh',
  position: 'relative' as 'relative',
};

const GuessMap: React.FC = () => {
  const [markerPosition, setMarkerPosition] = useState<LatLngLiteral | null>(null);
  const [guessSubmitted, setGuessSubmitted] = useState<boolean>(false);
  const [mapCenter, setMapCenter] = useState<LatLngLiteral>({ lat: 0, lng: 0 });
  const [mapZoom, setMapZoom] = useState<number>(2);
  const { actualLocation } = useGameContext();
  const router = useRouter();
  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  // Redirect to home if actualLocation is not set
  useEffect(() => {
    if (!actualLocation) {
      router.push('/');
    }
  }, [actualLocation, router]);

  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current;

      const onCenterChanged = () => {
        const center = map.getCenter();
        if (center) {
          setMapCenter({
            lat: center.lat(),
            lng: center.lng(),
          });
        }
      };

      const onZoomChanged = () => {
        setMapZoom(map.getZoom() || mapZoom);
      };

      // Add listeners
      const centerChangedListener = map.addListener('center_changed', onCenterChanged);
      const zoomChangedListener = map.addListener('zoom_changed', onZoomChanged);

      // Clean up listeners on unmount
      return () => {
        centerChangedListener.remove();
        zoomChangedListener.remove();
      };
    }
  }, [mapRef]);

  useEffect(() => {
    if (guessSubmitted && mapRef.current && markerPosition && actualLocation) {
      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend(markerPosition);
      bounds.extend(actualLocation);
      mapRef.current.fitBounds(bounds);

      // Update the mapCenter and mapZoom after fitting bounds
      const center = bounds.getCenter();
      setMapCenter({ lat: center.lat(), lng: center.lng() });
      setMapZoom(mapRef.current.getZoom() || mapZoom);
    }
  }, [guessSubmitted, markerPosition, actualLocation]);

  if (loadError) {
    console.error('Error loading Google Maps API:', loadError);
    return <div>Error loading maps</div>;
  }

  if (!isLoaded || !actualLocation) {
    return <div>Loading...</div>;
  }

  // Function to handle map clicks and place a marker
  const onMapClick = (event: google.maps.MapMouseEvent) => {
    if (guessSubmitted) {
      return; // Prevent changing the marker after submission
    }
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      setMarkerPosition({ lat, lng });
    }
  };

  // Function to calculate the distance between two coordinates
  const calculateDistance = (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ) => {
    const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
    const R = 6371e3; // Earth's radius in meters
    const φ1 = toRadians(lat1);
    const φ2 = toRadians(lat2);
    const Δφ = toRadians(lat2 - lat1);
    const Δλ = toRadians(lng2 - lng1);

    const a =
      Math.sin(Δφ / 2) ** 2 +
      Math.cos(φ1) *
        Math.cos(φ2) *
        Math.sin(Δλ / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // in meters
    return distance;
  };

  // Function to handle guess submission
  const handleSubmitGuess = () => {
    if (markerPosition && actualLocation) {
      const distance = calculateDistance(
        markerPosition.lat,
        markerPosition.lng,
        actualLocation.lat,
        actualLocation.lng
      );

      // Update state to indicate guess has been submitted
      setGuessSubmitted(true);

      // Log the distance (or display it as we've done below)
      console.log(`Your guess is ${Math.round(distance / 1000)} km away from the actual location.`);
    } else {
      alert('Please place a marker on the map to submit your guess.');
    }
  };

  // Handle automatic submission when time runs out
  const handleTimeUp = () => {
    if (markerPosition) {
      handleSubmitGuess();
    } else {
      alert('Time is up! You did not place a guess.');
      // Optionally, reveal the actual location
      setGuessSubmitted(true);
    }
    // Optionally, redirect to a results page or reset the game
  };

  // Prepare the path for the polyline
  const linePath =
    markerPosition && actualLocation ? [markerPosition, actualLocation] : [];

  return (
    <div style={containerStyle}>
      {/* Countdown component */}
      {!guessSubmitted && <Countdown seconds={60} onComplete={handleTimeUp} />}

      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={mapCenter}
        zoom={mapZoom}
        onClick={onMapClick}
        onLoad={(map: google.maps.Map) => {
          mapRef.current = map;
        }}
        options={{
          disableDefaultUI: false,
        }}
      >
        {/* User's marker */}
        {markerPosition && (
          <Marker
            position={markerPosition}
            draggable={!guessSubmitted}
            onDragEnd={(event: google.maps.MapMouseEvent) => {
              if (guessSubmitted) {
                return;
              }
              if (event.latLng) {
                setMarkerPosition({
                  lat: event.latLng.lat(),
                  lng: event.latLng.lng(),
                });
              }
            }}
            label="Your Guess"
          />
        )}

        {/* Actual location marker after submission */}
        {guessSubmitted && (
          <Marker
            position={actualLocation}
            icon={{
              url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
            }}
            label="Actual Location"
          />
        )}

        {/* Dotted line between markers after submission */}
        {guessSubmitted && markerPosition && (
          <Polyline
            path={linePath}
            options={{
              strokeColor: '#FF0000',
              strokeOpacity: 1.0,
              strokeWeight: 2,
              geodesic: true,
              icons: [
                {
                  icon: {
                    path: 'M 0,-1 0,1',
                    strokeOpacity: 1,
                    scale: 4,
                  },
                  offset: '0',
                  repeat: '20px',
                },
              ],
            }}
          />
        )}
      </GoogleMap>

      {/* Submit Guess Button */}
      {!guessSubmitted && (
        <button
          onClick={handleSubmitGuess}
          style={{
            position: 'absolute' as 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '10px 20px',
            fontSize: '16px',
            zIndex: 1,
          }}
        >
          Submit Guess
        </button>
      )}

      {/* Display the distance after submission */}
      {guessSubmitted && markerPosition && (
        <div
          style={{
            position: 'absolute' as 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '10px 20px',
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: 'white',
            fontSize: '16px',
            zIndex: 1,
            borderRadius: '5px',
          }}
        >
          Your guess was{' '}
          {Math.round(
            calculateDistance(
              markerPosition.lat,
              markerPosition.lng,
              actualLocation.lat,
              actualLocation.lng
            ) / 1000
          )}{' '}
          km away from the actual location.
        </div>
      )}
    </div>
  );
};

export default GuessMap;