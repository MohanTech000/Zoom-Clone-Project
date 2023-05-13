const express = require("express");
const app = express();
const server = require("http").Server(app);
const {v4: uuidv4} = require("uuid");  //{v4: uuidv4} thats the library, that we gonna import;
const io = require("socket.io")(server);
const {ExpressPeerServer} = require("peer");
const peerServer = ExpressPeerServer(server,{
    debug:true
});



app.set("view engine", "ejs");
app.use(express.static("public")); //Public folder: it will store all the script of frontend;
app.use("/peerjs", peerServer)



app.get("/", (req, res)=>{
    res.redirect(`/${uuidv4()}`);  //it will create a new uuid and redirect you to the url of uuid;
})

app.get("/:room", (req, res)=>{
    res.render("room", {roomId: req.params.room}); //Now we pass this id to room.ejs file;
}) 





io.on("connection", socket =>{ //for another person Room joining;
    socket.on("join-room", (roomId, userId)=>{
    socket.join(roomId); //we join the room with the room id;
    socket.broadcast.to(roomId).emit("user-connected", userId);

    //for recieving msg from server

    socket.on("message", message =>{
        io.to(roomId).emit("createMessage", message)
    })
    
    })
}) 






server.listen(3000, ()=>{
    console.log("server is listening") 
});