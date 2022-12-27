const express = require('express');
const cors = require('cors')
const userRoute = require('./routes/user')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const path = require('path');
var hbs = require('hbs')
var http = require('http')
let socketio = require('socket.io');

// creating and instance for the express 
const app = express();
let server = http.createServer(app)  //express cant create a server for socket io by using app, it does'nt provide one

var io = socketio(server)   //assigning server for the socket io

// mongo db connection setup
dotenv.config()
mongoose.connect(process.env.mongo_url, (req,res) => {
    console.log("mongo connected");
})

// view engine it is not required, I made it to debug the code in browser
app.set('view engine', 'hbs')
app.set('views', __dirname+"/views")


app.use(express.json());
app.use(cors());


app.use('/',userRoute)

const PORT = process.env.PORT || 3000;


//  socket io setup 
var chatUsers = []

// connection from a client side is handeled here
io.on('connection',(socket) => {

    socket.on('add-new-user',userId => {
        const user = chatUsers.find(user => user.userId == userId) //check user already exist or not
        !user ? (
            chatUsers.push({
                userId,
                socketId:socket.id
            })
            
         ) : console.log("user already exist");
        
       
    })
    // it receives the event from client side which include the userid and text body
    socket.on('send-message-of-doctor', data => {
        console.log(chatUsers);
        const user = chatUsers.find(user => user.userId == data.userId) //find user from the array
        if(user){
            console.log(user.socketId);
            io.to(user.socketId).emit('doctor-message',data.text)
        }
        
    });

    socket.on('disconnect',() => {
        console.log("server disconnected");
        chatUsers = chatUsers.filter((user) => user.socketId !== socket.id); // remove the user from the chat array
    })
})


server.listen((PORT), () => console.log(`Server listening on port ${PORT}`));





