// src/app/results/[gameId]/ResultsMap.tsx
'use client';

import { GoogleMap, useLoadScript, Marker, Polyline } from '@react-google-maps/api';

interface Guess {
  guess: { lat: number; lng: number };
  name: string;
}

interface ResultsMapProps {
  guesses: Guess[];
  actualLocation: { lat: number; lng: number };
}

export default function ResultsMap({ guesses, actualLocation }: ResultsMapProps) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps</div>;

  return (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '500px' }}
      center={actualLocation}
      zoom={2}
    >
      {/* Actual Location Marker */}
      <Marker position={actualLocation} label="Actual Location" />

      {/* Player Guesses */}
      {guesses.map((guess, index) => (
        <Marker
          key={index}
          position={guess.guess}
          label={guess.name}
          icon={{
            url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
          }}
        />
      ))}

      {/* Lines from Guesses to Actual Location */}
      {guesses.map((guess, index) => (
        <Polyline
          key={index}
          path={[guess.guess, actualLocation]}
          options={{
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2,
          }}
        />
      ))}
    </GoogleMap>
  );
}