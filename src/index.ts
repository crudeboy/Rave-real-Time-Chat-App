import express from "express";
import path from 'path';
import http from "http";
import { Server } from "socket.io";
import Filter from "bad-words";
import { generateMessage, generateLocationMessage } from "./utils/messages"
import { getUser, addUser, removeUser, getUsersInRoom } from "./utils/users"

const app = express()
const httpserver = http.createServer(app)
const io = new Server(httpserver)
const port = process.env.PORT || 3008;

// console.log(process.env)

const publicPath = path.join(__dirname, "../public")
// console.log(publicPath)

app.use(express.static(publicPath))


// app.get("/chat.html", (req, res) => {
//     res.render("chat")
// })
//socket.emit, io.emit, socket.braodcast.emit
//io.to.emit, socket.brackcast.to.emit, 

// let count = 0
let message = "Welcome to Lakeman Sage chat application"

io.on("connection", (socket) => {
    console.log("connection to web socket is on")
  
    //allowing the client to send the username and the room to the server
    socket.on("join", ({username, room}, callback) => {
        const { error, user } = addUser({ id: socket.id, username, room})
        console.log("user1",user)
        if(user){
            console.log(getUsersInRoom(room), room)
            if(error){
                return callback(error)
            }
            
            socket.join(user.room)

            //Each new user gets a welcome message
            socket.emit("message", generateMessage("Creol", message))
            socket.broadcast.to(user.room).emit("message", generateMessage("Creol", `${user.username} has joined the chat room`));
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
           
        }
         callback(error)
    })


    socket.on("textMessage", (message, callback) => {
        // console.log(message)
        const singleUser = getUser(socket.id)

        const filter = new Filter(message)

        if(filter.isProfane(message)){
            return callback("Profanity is a sin")
        }
        if(singleUser){
            io.to(singleUser.room).emit('message', generateMessage(singleUser.username, message))
            callback("Delivered")
        }
    })

    

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if(user){
            // socket.broadcast.emit("message", "A new user has left the chat room")
            io.to(user.room).emit("message", generateMessage("Creol", `${user.username} has left`))
            //when i change the firts arguement fro message to something else this does not work
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }

  
    })

    //send in the location of any user to all connected users
    socket.on('location', (position, callback) => {
        let chatClient = getUser(socket.id) 

        if(chatClient){
          io.to(chatClient.room).emit("locationMessage",generateLocationMessage(chatClient.username,`https://www.google.com//maps?q=${position.longitude},${position.latitude}`));
          callback("Delivered")
        }

        // io.emit("locationMessage",`https://www.google.com//maps?q=${position.longitude},${position.latitude}`);
    })



});

httpserver.listen(port, () => {
    console.log("server is live")
})



