// src/app/results/[gameId]/page.tsx
import { notFound } from 'next/navigation';
import games from '../../../lib/gameState';
import ResultsMap from './ResultsMap';

interface ResultsPageProps {
  params: { gameId: string };
}

export default function ResultsPage({ params }: ResultsPageProps) {
  const { gameId } = params;
  const game = games[gameId];

  if (!game) {
    notFound();
  }

  const guesses = Object.values(game.guesses);
  const actualLocation = game.location;

  return (
    <div>
      <h1>Results for Game {gameId}</h1>
      <ResultsMap guesses={guesses} actualLocation={actualLocation} />
    </div>
  );
}