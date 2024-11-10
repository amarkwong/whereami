// app/layout.tsx
'use client';

import React from 'react';
import { GameProvider } from './context/GameContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <GameProvider>{children}</GameProvider>
      </body>
    </html>
  );
}