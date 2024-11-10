// src/context/GameContext.tsx
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Location {
  lat: number;
  lng: number;
}

interface GameContextType {
  actualLocation: Location | null;
  setActualLocation: (location: Location) => void;
  // Add other context values and functions as needed
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [actualLocation, setActualLocation] = useState<Location | null>(null);

  return (
    <GameContext.Provider value={{ actualLocation, setActualLocation }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};