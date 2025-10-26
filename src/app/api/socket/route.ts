/* eslint-disable @typescript-eslint/no-explicit-any */
import { Server as IOServer } from "socket.io";
import { createServer, Server as HTTPServer } from "http";
import { v4 as uuidv4 } from "uuid";

// Typdefinitionen wie im Original
type Player = {
  id: string;
  name: string;
  socketId: string;
};

type Room = {
  id: string;
  players: Player[];
  state: "free" | "buzzed" | "input";
  winner?: string; // player id
  chat: { name: string; text: string }[];
  timeout?: NodeJS.Timeout;
};

// Räume im Speicher
const rooms: Record<string, Room> = {};
let io: IOServer;
let httpServer: HTTPServer;

// Socket.io-Server nur einmal pro Prozess initialisieren
export async function GET(request: Request) {
  if (io) {
    return Response.json({ success: true, message: "Socket is already running" });
  }

  console.log("Starting Socket.IO server");

  httpServer = createServer();
  io = new IOServer(httpServer, {
    path: "/api/buzzer-socket",
    addTrailingSlash: false,
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    let currentRoom: Room | null = null;
    let playerId: string | null = null;

    socket.on("join", ({ roomId, name }) => {
      if (!rooms[roomId]) {
        rooms[roomId] = {
          id: roomId,
          players: [],
          state: "free",
          chat: [],
        };
      }
      // Name muss eindeutig sein
      if (rooms[roomId].players.some((p) => p.name === name)) {
        socket.emit("error", { message: "Name bereits vergeben" });
        return;
      }
      playerId = uuidv4();
      currentRoom = rooms[roomId];
      currentRoom.players.push({ id: playerId, name, socketId: socket.id });
      socket.join(roomId);
      broadcastRoomState(currentRoom, io);
    });

    socket.on("buzz", () => {
      if (!currentRoom || !playerId) return;
      if (currentRoom.state !== "free") return;
      currentRoom.state = "buzzed";
      currentRoom.winner = playerId;
      broadcastRoomState(currentRoom, io);
      // Timeout für 60s
      currentRoom.timeout = setTimeout(() => {
        if (currentRoom) {
          currentRoom.state = "free";
          currentRoom.winner = undefined;
          broadcastRoomState(currentRoom, io);
        }
      }, 60000);
    });

    socket.on("input", ({ name, text }) => {
      if (!currentRoom || !playerId) return;
      if (currentRoom.state !== "buzzed" || currentRoom.winner !== playerId) return;
      currentRoom.chat.push({ name, text });
      currentRoom.state = "free";
      currentRoom.winner = undefined;
      if (currentRoom.timeout) {
        clearTimeout(currentRoom.timeout);
        currentRoom.timeout = undefined;
      }
      broadcastRoomState(currentRoom, io);
    });

    socket.on("leave", () => {
      if (!currentRoom || !playerId) return;
      currentRoom.players = currentRoom.players.filter((p) => p.id !== playerId);
      socket.leave(currentRoom.id);
      if (currentRoom.players.length === 0) {
        delete rooms[currentRoom.id];
      } else {
        broadcastRoomState(currentRoom, io);
      }
      socket.disconnect(true);
    });

    socket.on("disconnect", () => {
      if (currentRoom && playerId) {
        currentRoom.players = currentRoom.players.filter((p) => p.id !== playerId);
        if (currentRoom.players.length === 0) {
          delete rooms[currentRoom.id];
        } else {
          broadcastRoomState(currentRoom, io);
        }
      }
    });
  });

  httpServer.listen(8081, () => {
    console.log("Buzzer Socket.io-Server läuft auf Port 8081");
  });

  return Response.json({ success: true, message: "Socket is started" })
}

// Hilfsfunktion für Broadcast
function broadcastRoomState(room: Room, io: IOServer) {
  const state = {
    type: "room_state",
    players: room.players.map((p) => p.name),
    state: room.state,
    winner: room.winner
      ? room.players.find((p) => p.id === room.winner)?.name
      : undefined,
    chat: room.chat,
  };
  io.to(room.id).emit("room_state", state);
}
