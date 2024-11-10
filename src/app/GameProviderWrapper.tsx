// src/app/GameProviderWrapper.tsx
'use client';

import React, { ReactNode } from 'react';
import { GameProvider } from './context/GameContext';

interface GameProviderWrapperProps {
  children: ReactNode;
}

const GameProviderWrapper = ({ children }: GameProviderWrapperProps) => {
  return <GameProvider>{children}</GameProvider>;
};

export default GameProviderWrapper;