require("dotenv").config();
const usersRouter = require('./routers/usersRouter');
const authRouter = require('./routers/authRouter');
const postsRouter = require('./routers/postsRouter');
const messagesRouter = require('./routers/messagesRouter');
const messagesBLL = require('./BLL/messagesBLL');
const http = require('http');
const { Server } = require('socket.io');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const mongoDBSession = require('connect-mongodb-session')(session);
const express = require('express');
const cors = require('cors');
const connectDB = require('./configs/connectDB');
let chatMessages = [];
let rooms = [];
let currRoom = "";
const chatUsers = [];
const app = express();

const store = new mongoDBSession({
    uri: process.env.mongoURI,
    collection:'sessions'
})

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.SERVER_NAME+process.env.REACT_PORT,
        methods: ["GET", "POST"]
    }
});

app.use(cookieParser())
app.use(express.json());

app.use(cors({
    // cors: {
    //     origin: process.env.SERVER_NAME+process.env.APP_PORT,
    //     methods: ["GET", "POST"]
    // }
})) ;

app.post('/logout', async (req, res, next) => {
    try {
        // req.session.destroy();
    } catch (err) {
        console.error('Error logging out:', err);
        return next(new Error('Error logging out'));
    }
    res.status(200).send();
})

connectDB();

//routers
app.use("/api/users", usersRouter);
app.use("/api/auth", authRouter);
app.use("/api/posts", postsRouter);
app.use("/api/messages", messagesRouter)

io.on("connection", (socket) => {
    console.log("New client connected " + socket.id);

    socket.on("getRooms", () => {
        rooms = Array.from(socket.rooms).toSpliced(0,1);
        io.to(socket.id).emit("getRooms", rooms);
    });

    // socket.on("join_private", async ( username, room ) => {
    //     socket.username=username;
    //         socket.join(room);
    //         rooms = Array.from(socket.rooms).toSpliced(0,1);
    //         console.log(username + " join room " + room);
    //         let message = ({
    //             sendName: "CHAT_BOT", 
    //             body: username+" has join room "+room,
    //             sendDate: Date.now(),
    //         });
    //         await messagesBLL.getRoomMessages(room).then((response) => {
    //             chatMessages=[...response];
    //             io.to(socket.id).emit("response", chatMessages, rooms, room);
    //         });
    // });

    socket.on("join_room", async ( username, room ) => {
        socket.username=username;
        if (!socket.rooms.has(room)){
            socket.join(room);
            rooms = Array.from(socket.rooms).toSpliced(0,1);
            console.log(username + " join room " + room);
            let message = ({
                sendName: "CHAT_BOT", 
                body: username+" has join room "+room,
                sendDate: Date.now(),
            });
            await messagesBLL.getRoomMessages(room).then((response) => {
                chatMessages=[...response];
                io.to(socket.id).emit("join_room", chatMessages, rooms);
            });
            
        } else {
            console.log (username+" already joined room "+room);
        }
        
    });

    socket.on("roomSelect",  async (username, room) => {
            await messagesBLL.getRoomMessages(room).then((response) => {
                chatMessages=[...response];
                currRoom=room;
            });
            io.to(socket.id).emit("response", chatMessages, rooms, room);
    });

    socket.on("send_message", async ( message , username, room ) => {
        await messagesBLL.createNewMessage(message)
        await messagesBLL.getRoomMessages(room).then((response) => {
            chatMessages=[...response];
        });
        io.in(room).emit("response", chatMessages, rooms, room); 
    });

    socket.on("leaveRoom", ( room, username ) => {
        if (socket.rooms.has(room)){
            socket.leave(room);
            rooms = Array.from(socket.rooms).toSpliced(0,1);
            console.log(username + " left room " + room);
            let message = ({
                sendName: "CHAT_BOT", 
                body: username+" has left room "+room,
                sendDate: Date.now(),
                room: room
            });
            io.to(socket.id).emit("leave_room", rooms);
        }
    });

    socket.on("deleteRoom", async ( room ) => {
        io.in(room).socketsLeave(room);
        rooms = Array.from(socket.rooms).toSpliced(0,1);
        await messagesBLL.deleteRoom(room).then((response) => {
            console.log("room "+room+" is closed!");
        });
        io.to(socket.id).emit("leave_room", rooms);
    });
    
    socket.on("leaveAllRooms", () => {
        console.log("User disconnected from all rooms")
        rooms = Array.from(socket.rooms).toSpliced(0,1);
        rooms.forEach((room)=>{
            socket.leave(room);
        })
        io.to(socket.id).emit("response", [], []);
    });

    socket.on("disconnectSession",  (username) => {
        console.log(`Socket ${socket.id} ${socket.username} disconnected.`);
        chatUsers.splice(chatUsers.findIndex(user=>{return user==username}),1);
        socket.disconnect(true); 
        socket.off("");   
    });

    socket.on("disconnect", async () => {
        console.log(`Socket ${socket.id} disconnected.`);
    });
});

io.of("/").adapter.on("delete-room", (room) => {
    console.log(`room ${room} was deleted`);
  });

// server start
app.listen(process.env.APP_PORT, () => {
    console.log(`Server is running on port ${process.env.APP_PORT}`);
});

server.listen(process.env.HTTP_PORT, () => {
    console.log(`server is running on port ${process.env.HTTP_PORT}`);
});

