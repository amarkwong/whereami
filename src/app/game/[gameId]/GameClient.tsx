// src/app/game/[gameId]/GameClient.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import StreetView from './components/StreetView';
import CountdownTimer from './components/CountdownTimer';
import GuessMap from './GuessMap';

interface Location {
  lat: number;
  lng: number;
}

interface GameClientProps {
  gameId: string;
  initialData: {
    location: Location;
    endTime: number;
  };
}

let socket: Socket;

export default function GameClient({ gameId, initialData }: GameClientProps) {
  const router = useRouter();
  const [connected, setConnected] = useState(false);
  const [location, setLocation] = useState<Location>(initialData.location);
  const [endTime, setEndTime] = useState<number>(initialData.endTime);

  useEffect(() => {
    // Initialize Socket.IO client
    if (!socket) {
      socket = io();

      socket.on('connect', () => {
        setConnected(true);
        socket.emit(
          'joinGame',
          { gameId, playerName: 'PlayerName' },
          (response: { success: boolean; message?: string; location?: Location; endTime?: number }) => {
            if (response.success) {
              setLocation(response.location!);
              setEndTime(response.endTime!);
            } else {
              alert(response.message);
              router.push('/');
            }
          }
        );
      });

      socket.on('showResults', () => {
        router.push(`/results/${gameId}`);
      });

      // Clean up on unmount
      return () => {
        socket.disconnect();
      };
    }
  }, [gameId]);

  return (
    <div>
      {connected ? (
        <>
          <StreetView location={location} />
          <CountdownTimer endTime={endTime} />
          <GuessMap gameId={gameId} />
        </>
      ) : (
        <div>Connecting...</div>
      )}
    </div>
  );
}