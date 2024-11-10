// app/context/GameContext.tsx
'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

interface GameContextType {
  actualLocation: { lat: number; lng: number } | null;
  setActualLocation: (location: { lat: number; lng: number }) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [actualLocation, setActualLocation] = useState<{ lat: number; lng: number } | null>(null);

  return (
    <GameContext.Provider value={{ actualLocation, setActualLocation }}>
      {children}
    </GameContext.Provider>
  );
};