
import { createFileRoute } from '@tanstack/react-router';
import { Server as IOServer } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

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

 The previous implementation attempted to create a standalone io instance when no
 server object was discoverable on the request. That fallback has been removed:
 the socket now requires an existing HTTP server (provided via the request).
 This avoids ambiguous behavior and the need to manage a separate listener here.
*/
function initSocket(existingServer: any) {
  if (io) return;

  if (!existingServer) {
    // Fail fast: require the hosting environment to expose the server object.
    throw new Error(
      'Unable to initialize socket.io: no existing HTTP server provided. ' +
      'Ensure your server exposes the Node HTTP server object on the request (e.g. request.socket.server).'
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
      currentRoom = rooms[roomId];
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

// TanStack Start file-route: initiiert socket.io beim ersten GET-Aufruf und versucht, an vorhandenen Server anzuhängen.
// Falls das Framework Request-Objekt eine server-Referenz enthält (wie in manchen Node-Server-Hosts), wird diese verwendet.
export const Route = createFileRoute('/api/socket')({
  server: {
    handlers: {
      GET: ({ request }: { request: Request }) => {
        try {
          // Try to discover an existing Node HTTP server:
          // Some platforms expose it as (request as any).socket.server or request['socket']?.server
          // This is environment-dependent; we pass it to initSocket if present.
          const anyReq = request as any;
          const potentialServer = anyReq?.socket?.server || anyReq?.raw?.socket?.server || anyReq?.server || undefined;

          if (io) {
            return Response.json({ success: true, message: 'Socket is already running' });
          }

          // Require an existing HTTP server to attach the socket to.
          if (!potentialServer) {
            return Response.json({
              success: false,
              error:
                'No HTTP server found on request. Socket initialization requires the hosting environment to expose the server object on the request (e.g. request.socket.server).',
            }, { status: 500 });
          }

          // Initialize and attach to the discovered server
          initSocket(potentialServer);

          return Response.json({ success: true, message: 'Socket started and attached' });
        } catch (err) {
          console.error('Failed to start socket:', err);
          return Response.json({ success: false, error: String(err) }, { status: 500 });
        }
      },
    },
  },
});
