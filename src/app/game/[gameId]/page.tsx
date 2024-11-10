// src/app/game/[gameId]/page.tsx
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import games from '../../../lib/gameState';
import GameClient from './GameClient';

interface GamePageProps {
  params: { gameId: string };
}

export default async function GamePage({ params }: GamePageProps) {
  const { gameId } = params;
  const game = games[gameId];

  if (!game) {
    notFound();
  }

  const initialData = {
    location: game.location,
    endTime: game.endTime,
  };

  return (
    <div>
      <h1>Game ID: {gameId}</h1>
      {/* Use a Client Component for interactive parts */}
      <Suspense fallback={<div>Loading...</div>}>
        <GameClient gameId={gameId} initialData={initialData} />
      </Suspense>
    </div>
  );
}