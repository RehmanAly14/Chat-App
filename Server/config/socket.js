import { Server } from "socket.io";
import http from "http";

import express from "express";

const app = express();
const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin:'http://localhost:5173',
    }
});

export function getRecieverSocketId(userId){
    return userSocketMap[userId]
}
//use to store online users
const userSocketMap = {}  //userID: socketID

io.on('connection', (socket) => {
    console.log('a user connected');

    const userId = socket.handshake.query.userId;
    if(userId) userSocketMap[userId] = socket.id

    //io.emit() is used to send events to all connected user
    io.emit("getOnlineUsers", Object.keys(userSocketMap))
    socket.on('disconnect', () => {
        console.log('user disconnected');
        delete userSocketMap[userId]
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    });
});

export {io,server,app}
