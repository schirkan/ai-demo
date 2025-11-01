import { Server as IOServer } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import type { NextFunction, Request, Response } from 'express';

type Player = {
  id: string;
  name: string;
  socketId: string;
};

type Room = {
  id: string;
  players: Array<Player>;
  state: 'free' | 'buzzed' | 'input';
  winner?: string; // player id
  chat: Array<{ name: string; text: string }>;
  timeout?: NodeJS.Timeout;
};

// Räume im Speicher
const rooms: Record<string, Room | undefined> = {};
let io: IOServer | undefined;

// Helper: Broadcast
function broadcastRoomState(room: Room, ioInstance: IOServer) {
  const state = {
    type: 'room_state',
    players: room.players.map((p) => p.name),
    state: room.state,
    winner: room.winner
      ? room.players.find((p) => p.id === room.winner)?.name
      : undefined,
    chat: room.chat,
  };
  ioInstance.to(room.id).emit('room_state', state);
}

/*
 Initialize socket.io on an existing HTTP server.

 This function is idempotent. It requires an existing Node HTTP server (like the one
 exposed on req.socket.server) to attach socket.io to.
*/
export function initSocket(existingServer: any) {
  if (io) return;

  if (!existingServer) {
    // Fail fast: require the hosting environment to expose the server object.
    throw new Error(
      'Unable to initialize socket.io: no existing HTTP server provided. ' +
      'Ensure your server exposes the Node HTTP server object on the request (e.g. req.socket.server).'
    );
  }

  // Attach to provided server
  io = new IOServer(existingServer, {
    path: '/api/buzzer-socket',
    addTrailingSlash: false,
    cors: { origin: '*' },
  });

  io.on('connection', (socket) => {
    let currentRoom: Room | null = null;
    let playerId: string | null = null;

    socket.on('join', ({ roomId, name }: { roomId: string; name: string }) => {
      if (!rooms[roomId]) {
        rooms[roomId] = {
          id: roomId,
          players: [],
          state: 'free',
          chat: [],
        };
      }
      // Name muss eindeutig sein
      if (rooms[roomId].players.some((p) => p.name === name)) {
        socket.emit('error', { message: 'Name bereits vergeben' });
        return;
      }
      playerId = uuidv4();
      currentRoom = rooms[roomId]!;
      currentRoom.players.push({ id: playerId, name, socketId: socket.id });
      socket.join(roomId);
      broadcastRoomState(currentRoom, io!);
    });

    socket.on('buzz', () => {
      if (!currentRoom || !playerId) return;
      if (currentRoom.state !== 'free') return;
      currentRoom.state = 'buzzed';
      currentRoom.winner = playerId;
      broadcastRoomState(currentRoom, io!);
      // Timeout für 60s
      currentRoom.timeout = setTimeout(() => {
        if (currentRoom) {
          currentRoom.state = 'free';
          currentRoom.winner = undefined;
          broadcastRoomState(currentRoom, io!);
        }
      }, 60000);
    });

    socket.on('input', ({ name, text }: { name: string; text: string }) => {
      if (!currentRoom || !playerId) return;
      if (currentRoom.state !== 'buzzed' || currentRoom.winner !== playerId) return;
      currentRoom.chat.push({ name, text });
      currentRoom.state = 'free';
      currentRoom.winner = undefined;
      if (currentRoom.timeout) {
        clearTimeout(currentRoom.timeout);
        currentRoom.timeout = undefined;
      }
      broadcastRoomState(currentRoom, io!);
    });

    socket.on('leave', () => {
      if (!currentRoom || !playerId) return;
      currentRoom.players = currentRoom.players.filter((p) => p.id !== playerId);
      socket.leave(currentRoom.id);
      if (currentRoom.players.length === 0) {
        delete rooms[currentRoom.id];
      } else {
        broadcastRoomState(currentRoom, io!);
      }
      socket.disconnect(true);
    });

    socket.on('disconnect', () => {
      if (currentRoom && playerId) {
        currentRoom.players = currentRoom.players.filter((p) => p.id !== playerId);
        if (currentRoom.players.length === 0) {
          delete rooms[currentRoom.id];
        } else {
          broadcastRoomState(currentRoom, io!);
        }
      }
    });
  });
}

/*
 Express-Middleware zur Initialisierung von socket.io.

 Diese Middleware versucht, das Node HTTP server-Objekt vom Request zu lesen
 (req.socket.server). Falls vorhanden, wird initSocket mit diesem Server aufgerufen.
 Die Middleware ist idempotent — sie macht nichts, wenn io bereits initialisiert ist.
*/
export function socketMiddleware(req: Request, _res: Response, next: NextFunction) {
  try {
    // Express' Request hat ein 'socket' Feld, das das Node socket enthält.
    const anyReq: any = req as any;
    const potentialServer = anyReq?.socket?.server || anyReq?.raw?.socket?.server || anyReq?.server || undefined;

    if (io) {
      // Bereits initialisiert — nichts zu tun
      return next();
    }

    if (!potentialServer) {
      // Kein Server gefunden — Log und weiter, wir wollen nicht blocken, aber informieren.
      console.warn(
        '[socketMiddleware] Kein HTTP-Server auf req gefunden. Socket.IO wurde nicht initialisiert. ' +
        'Wenn der Host das HTTP-Server-Objekt nicht bereitstellt, funktioniert WebSocket nicht.'
      );
      return next();
    }

    initSocket(potentialServer);
    return next();
  } catch (err) {
    console.error('socketMiddleware failed to init socket:', err);
    // Weiterleiten des Fehlers an Express error handler
    return next(err);
  }
}

export default socketMiddleware;
