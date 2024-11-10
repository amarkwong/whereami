import GameProviderWrapper from "./GameProviderWrapper";

// src/app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <title>StreetView Multiplayer Game</title>
      </head>
      <body>
        <GameProviderWrapper>
          {children}
        </GameProviderWrapper>
      </body>
    </html>
  );
}