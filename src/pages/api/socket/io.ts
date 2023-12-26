import { NextApiRequest } from 'next';
import { Server as SocketIOServer } from 'socket.io';
import { Server as NetServer } from 'http';
import { NextApiResponseServerIo } from '@/types';

export const config = {
  api: {
    bodyParser: false
  }
};

const viewerCounts: { [roomId: string]: number } = {};
const rooms: { [roomId: string]: Set<string> } = {};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (!res.socket?.server.io) {
    console.log("Starting Socket.io server...");
    const path = "/api/socket/io";
    const httpServer: NetServer = (res.socket as any).server || {};
    const io = new SocketIOServer(httpServer, { path, addTrailingSlash: false });

    io.on("connection", (socket) => {
      console.log("Socket.io client connected");
      socket.on("newParticipant", ({ roomId, name }) => {
        if (!rooms[roomId]) {
          rooms[roomId] = new Set();
        }
        console.log("New participant")
        console.log(name)
        rooms[roomId].add(name);
        socket.join(roomId);
        io.to(roomId).emit("participantsUpdate", Array.from(rooms[roomId]));
      });

      socket.on("joinRoom", (roomId) => {
        if (!rooms[roomId]) {
          rooms[roomId] = new Set();
          // Initialize viewer count for the room
          viewerCounts[roomId] = 0; 
        }
        console.log("New viewer joined the room");
        // Increment viewer count
        viewerCounts[roomId]++; 
        socket.join(roomId);

        // Broadcast the updated list to all clients in the room
        io.to(roomId).emit("participantsUpdate", Array.from(rooms[roomId]));
      });

      socket.on("leaveRoom", (roomId, participantName) => {
        if (rooms[roomId]) {
          console.log(`${participantName} left the room`)
          rooms[roomId].delete(participantName);
        }

        // Decrement viewer count when a viewer leaves the room
        if (viewerCounts[roomId] > 0) {
          viewerCounts[roomId]--;
        }

        // Broadcast the updated list to all clients in the room
        io.to(roomId).emit("participantsUpdate", Array.from(rooms[roomId]));
        // Check if there are no participants and no viewers in the room
        if (rooms[roomId] && rooms[roomId].size === 0 && viewerCounts[roomId] === 0) {
          delete rooms[roomId];
          delete viewerCounts[roomId]; // Remove viewer count when room is empty
        }

        socket.leave(roomId);
      });

      // Add any additional event listeners as needed
    });

    res.socket.server.io = io;
  } else {
    console.log("Socket.io server already running");
  }
  res.end();
};

export default ioHandler;
