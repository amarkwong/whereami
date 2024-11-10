// src/app/game/[gameId]/GuessMap.tsx
'use client';

import { useState } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import { useRouter } from 'next/navigation';
import { Socket } from 'socket.io-client';

interface GuessMapProps {
  gameId: string;
}

declare let socket: Socket;

export default function GuessMap({ gameId }: GuessMapProps) {
  const [guess, setGuess] = useState<{ lat: number; lng: number } | null>(null);
  const router = useRouter();

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  const onMapClick = (event: google.maps.MapMouseEvent) => {
    setGuess({
      lat: event.latLng!.lat(),
      lng: event.latLng!.lng(),
    });
  };

  const submitGuess = () => {
    if (guess) {
      socket.emit('submitGuess', { gameId, guess }, (response: { success: boolean; message?: string }) => {
        if (response.success) {
          // Optionally, disable the submit button
          // Provide feedback to the user
        } else {
          alert(response.message);
        }
      });
    } else {
      alert('Please make a guess on the map.');
    }
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps</div>;

  return (
    <div>
      <GoogleMap
        onClick={onMapClick}
        mapContainerStyle={{ width: '100%', height: '400px' }}
        center={{ lat: 0, lng: 0 }}
        zoom={2}
      >
        {guess && <Marker position={guess} />}
      </GoogleMap>
      <button onClick={submitGuess}>Submit Guess</button>
    </div>
  );
}