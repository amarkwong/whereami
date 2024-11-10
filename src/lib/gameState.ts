// src/lib/gameState.ts
export interface Player {
  id: string;
  name: string;
}

export interface Guess {
  guess: { lat: number; lng: number };
  name: string;
}

export interface Game {
  players: Player[];
  location: { lat: number; lng: number };
  endTime: number;
  guesses: { [key: string]: Guess };
}

const games: { [key: string]: Game } = {};

export default games;