// src/server.ts

import { createServer } from 'http';
import next from 'next';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { parse } from 'url';
import games, { Player, Game } from './lib/gameState';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, dir: './src' });
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 3000;

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  const io = new SocketIOServer(server);

  // Function to remove player from games, now with access to 'io'
  function removePlayerFromGames(socketId: string) {
    for (const gameId in games) {
      const game = games[gameId];
      const playerIndex = game.players.findIndex((p) => p.id === socketId);

      if (playerIndex !== -1) {
        const playerName = game.players[playerIndex].name;
        game.players.splice(playerIndex, 1);
        console.log(`${playerName} removed from game ${gameId}`);

        // Notify remaining players
        io.to(gameId).emit('playerLeft', { players: game.players });

        // If no players are left, remove the game
        if (game.players.length === 0) {
          delete games[gameId];
          console.log(`Game ${gameId} deleted due to no players.`);
        }
      }
    }
  }

  io.on('connection', (socket: Socket) => {
    console.log(`New connection: ${socket.id}`);

    // Handle createGame event
    socket.on('createGame', (data: { playerName: string }, callback: (response: any) => void) => {
      const { playerName } = data;
      const gameId = generateGameId();
      const location = generateRandomLocation();
      const endTime = Date.now() + GAME_DURATION;

      games[gameId] = {
        players: [{ id: socket.id, name: playerName }],
        location,
        endTime,
        guesses: {},
      };

      socket.join(gameId);
      console.log(`Game created: ${gameId} by ${playerName}`);

      callback({ success: true, gameId, location, endTime });
    });

    // Handle joinGame event
    socket.on('joinGame', (data: { gameId: string; playerName: string }, callback: (response: any) => void) => {
      const { gameId, playerName } = data;
      const game = games[gameId];

      if (game && game.players.length < 8) {
        game.players.push({ id: socket.id, name: playerName });
        socket.join(gameId);

        // Notify existing players
        io.to(gameId).emit('playerJoined', { players: game.players });

        console.log(`${playerName} joined game ${gameId}`);

        callback({ success: true, location: game.location, endTime: game.endTime });
      } else {
        callback({ success: false, message: 'Game not found or full.' });
      }
    });

    // Handle submitGuess event
    socket.on('submitGuess', (data: { gameId: string; guess: { lat: number; lng: number } }, callback: (response: any) => void) => {
      const { gameId, guess } = data;
      const game = games[gameId];

      if (game) {
        const playerName = getPlayerName(game, socket.id);
        game.guesses[socket.id] = { guess, name: playerName };

        console.log(`${playerName} submitted a guess in game ${gameId}`);

        // Check if all players have submitted their guesses or timer has ended
        if (Object.keys(game.guesses).length === game.players.length || Date.now() >= game.endTime) {
          // Send results to all players
          io.to(gameId).emit('showResults');

          // Optionally, clean up the game
          // delete games[gameId];
        }

        callback({ success: true });
      } else {
        callback({ success: false, message: 'Game not found.' });
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`Disconnected: ${socket.id}`);
      removePlayerFromGames(socket.id);
    });
  });

  server.listen(PORT, () => {
    console.log(`> Server listening on http://localhost:${PORT}`);
  });
});

// Helper functions
function generateGameId(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function generateRandomLocation(): { lat: number; lng: number } {
  // Implement logic to select a random StreetView location
  // For simplicity, returning fixed coordinates
  return { lat: 37.7749, lng: -122.4194 }; // San Francisco
}

function getPlayerName(game: Game, socketId: string): string {
  const player = game.players.find((p) => p.id === socketId);
  return player ? player.name : 'Unknown';
}

const GAME_DURATION = 300000; // 5 minutes in milliseconds