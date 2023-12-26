import { NextApiRequest, NextApiResponse } from 'next';
import { Server as SocketIOServer } from 'socket.io';
import { Server as NetServer } from 'http';
import { NextApiResponseServerIo } from '@/types';

export const config = {
  api: {
    bodyParser: false
  }
};

const rooms = {};

const ioHandler = (req: NextApiRequest, res: NextApiResponse) => {
  if (!res.socket.server.io) {
    console.log("Starting Socket.io server...");
    const path = "/api/socket/io";
    const httpServer: NetServer = res.socket.server as any;
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
        }
        console.log("New viewer joined the room");
        socket.join(roomId);
        
        // Broadcast the updated list to all clients in the room
        io.to(roomId).emit("participantsUpdate", Array.from(rooms[roomId]));
      });

      socket.on("leaveRoom", (roomId, participantName) => {
        if (rooms[roomId]) {
          rooms[roomId].delete(participantName);
          if (rooms[roomId].size === 0) {
            delete rooms[roomId];
          } else {
            io.to(roomId).emit("participantsUpdate", Array.from(rooms[roomId]));
          }
        }
        socket.leave(roomId);
      });

      socket.on("disconnecting", () => {
        // Handle participant disconnecting from all rooms
        const roomsLeft = socket.rooms;
        roomsLeft.forEach((roomId) => {
          if (rooms[roomId]) {
            rooms[roomId].delete(socket.id);
            if (rooms[roomId].size === 0) {
              delete rooms[roomId];
            } else {
              io.to(roomId).emit("participantsUpdate", Array.from(rooms[roomId]));
            }
          }
        });
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
