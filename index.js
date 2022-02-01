const express = require('express');
const app= express();
const http = require('http');
const server = http.createServer(app);
const {Server} = require("socket.io");
const io = new Server(server);
const users={};
const messagesarray = [];
const fs = require('fs');
// app.use(express.static(__dirname + '/public'));
var dateTime = require('node-datetime');
var typingPeople = [];

const getCurrentTime= ()=>{
    var dt = dateTime.create();
    var formatted = dt.format('H:Mp');
    return formatted;
}

const checkIfThisUserAlreadyExist = (data)=>{
    let x = 0;
    for(var i  = 0 ;i<Object.keys(users).length;i++){
    let key = Object.keys(users)[i];
        if(users[key]==data){
      x = 1
    break;
        }
    }
    if(x==1){
        return true
    }else{
        return false
    }
    }

io.on("connection", (socket)=>{
// console.log("New user Has joined");
socket.on("new-user",(name)=>{
    users[socket.id] = name;
    socket.broadcast.emit('users-noti', name + " Joined")
    // if(!checkIfThisUserAlreadyExist(name)){
    //     console.log("No exist")
    //     users[socket.id] = name;
    //     socket.broadcast.emit('users-noti', name + " Joined")
    //     socket.broadcast.emit('user-exist', false)
    // }else{
    //     socket.broadcast.emit('user-exist', true)
    // }
  })
   socket.on('sendfile', (data)=>{
            socket.broadcast.emit('img', {user:users[socket.id], file:data.file,time:getCurrentTime()} 
            );            
      })
socket.on('send-message', (data)=>{
data['time'] = getCurrentTime();
data['user']= users[socket.id]
            socket.broadcast.emit('load-message', data)
            messagesarray.push(data)
        })

        socket.on('typing', (data)=>{
            if(data.typing==false){
                console.log("stop typing " +users[socket.id] )
            }
            if(data.typing==true){
                if(!typingPeople.includes(users[socket.id])  && (users[socket.id]!=undefined) ){
                    typingPeople.push(users[socket.id])
                }
                data['users'] = typingPeople;
                socket.broadcast.emit('display', data)
            }else{
                if(typingPeople.includes(users[socket.id])){
                    console.log("stop typing " +users[socket.id] )
                    var index = typingPeople.indexOf(users[socket.id]);
                    if (index > -1) {
                        typingPeople.splice(index, 1); // 2nd parameter means remove one item only
                    }
                 }
                data['users'] = typingPeople;
                socket.broadcast.emit('display', data)
            }
           
          console.log(typingPeople)
          })
          socket.emit('messagesall', messagesarray)
socket.on("disconnect", ()=>{
    if(typeof users[socket.id]!="undefined" ){
        socket.broadcast.emit('users-noti', users[socket.id]+" Left")
       delete users[socket.id];
    }
 })
});



app.get("/", (req, res)=>{
    res.sendFile(__dirname+ '/public/index.html');
});

server.listen(3000, ()=>{
    console.log("listening Port 3000");
})