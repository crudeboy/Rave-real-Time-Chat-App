"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const bad_words_1 = __importDefault(require("bad-words"));
const messages_1 = require("./utils/messages");
const users_1 = require("./utils/users");
const app = (0, express_1.default)();
const httpserver = http_1.default.createServer(app);
const io = new socket_io_1.Server(httpserver);
const port = process.env.PORT || 3008;
// console.log(process.env)
const publicPath = path_1.default.join(__dirname, "../public");
// console.log(publicPath)
app.use(express_1.default.static(publicPath));
// app.get("/chat.html", (req, res) => {
//     res.render("chat")
// })
//socket.emit, io.emit, socket.braodcast.emit
//io.to.emit, socket.brackcast.to.emit, 
// let count = 0
let message = "Welcome to Lakeman Sage chat application";
io.on("connection", (socket) => {
    console.log("connection to web socket is on");
    //allowing the client to send the username and the room to the server
    socket.on("join", ({ username, room }, callback) => {
        const { error, user } = (0, users_1.addUser)({ id: socket.id, username, room });
        console.log("user1", user);
        if (user) {
            console.log((0, users_1.getUsersInRoom)(room), room);
            if (error) {
                return callback(error);
            }
            socket.join(user.room);
            //Each new user gets a welcome message
            socket.emit("message", (0, messages_1.generateMessage)("Creol", message));
            socket.broadcast.to(user.room).emit("message", (0, messages_1.generateMessage)("Creol", `${user.username} has joined the chat room`));
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: (0, users_1.getUsersInRoom)(user.room)
            });
        }
        callback(error);
    });
    socket.on("textMessage", (message, callback) => {
        // console.log(message)
        const singleUser = (0, users_1.getUser)(socket.id);
        const filter = new bad_words_1.default(message);
        if (filter.isProfane(message)) {
            return callback("Profanity is a sin");
        }
        if (singleUser) {
            io.to(singleUser.room).emit('message', (0, messages_1.generateMessage)(singleUser.username, message));
            callback("Delivered");
        }
    });
    socket.on('disconnect', () => {
        const user = (0, users_1.removeUser)(socket.id);
        if (user) {
            // socket.broadcast.emit("message", "A new user has left the chat room")
            io.to(user.room).emit("message", (0, messages_1.generateMessage)("Creol", `${user.username} has left`));
            //when i change the firts arguement fro message to something else this does not work
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: (0, users_1.getUsersInRoom)(user.room)
            });
        }
    });
    //send in the location of any user to all connected users
    socket.on('location', (position, callback) => {
        let chatClient = (0, users_1.getUser)(socket.id);
        if (chatClient) {
            io.to(chatClient.room).emit("locationMessage", (0, messages_1.generateLocationMessage)(chatClient.username, `https://www.google.com//maps?q=${position.longitude},${position.latitude}`));
            callback("Delivered");
        }
        // io.emit("locationMessage",`https://www.google.com//maps?q=${position.longitude},${position.latitude}`);
    });
});
httpserver.listen(port, () => {
    console.log("server is live");
});
