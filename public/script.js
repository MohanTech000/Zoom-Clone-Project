const socket = io("/");
const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement('video');


myVideo.muted = true;

var peer = new Peer(undefined, {
    path: "/peerjs",
    host: "/",
    port: "3000"
});


let myVideoStream;

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream)


    peer.on("call", call =>{
        call.answer(stream); //this strem is mine, bcz reciever is me;
        const video = document.createElement("video"); 
        call.on("stream", userVideoStream =>{
            addVideoStream(video, userVideoStream)
        });
    })

    
socket.on("user-connected", (userId) => {  //when user with (userID) commes acyually to our rooom USER CONNECTED and then go to the CTNUSER  and then log;
    connectToNewUser(userId, stream); //listen for that new user is connected to our room;
})

});



peer.on("open", id => { //the ID is for the person who is joining (e.g) me; 
    socket.emit("join-room", ROOM_ID, id);
    console.log(id)
})



const connectToNewUser = (userId, stream) => {
    const call = peer.call(userId, stream);
    const video = document.createElement("video"); 
    call.on("stream", userVideoStream =>{
        addVideoStream(video, userVideoStream)
    });
}

//when i call to hamza with my stream actually my video, then i will create his video with creating video element after that
// i have to recieve his stream (video) and add them into  addVideoStream (which plays video) to easily communicate with each other;

const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
        video.play();
    })

    videoGrid.append(video);
}   

//Getting input message:

let text = $('input');
console.log(text);

$("html").keydown((e)=>{
    if(e.which == 13 && text.val().length !== 0){
        console.log(text.val())
        socket.emit("message", text.val());
        text.val('');
    }
})


socket.on("createMessage", message =>{
    $(".messages").append(`<li class="message"><b>user</b><br>${message}</li>`)
    scrollToBottom();
})

const scrollToBottom = ()=>{
    let d = $(".main__chat_window");
    d.scrollTop(d.prop("scrollHeight"));
}

//Mute unMute video



const muteUnmute = ()=>{
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if(enabled){
        myVideoStream.getAudioTracks()[0].enabled = false; //for muting video
        setUnmuteButton();       
    }else{
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled = true;       //for unMuting 

    }
}


const setMuteButton = ()=>{
    const html = `<i class="fas fa-microphone"></i>
    <span>Mute</span>
    `
    document.querySelector(".main__mute__button").innerHTML = html;
}

const setUnmuteButton = ()=>{
  const html = `<i class="unmute fas fa-microphone-slash"></i>
  <span>Unmute</span>
  `
    document.querySelector(".main__mute__button").innerHTML = html;
}  



//Video play / stop

const playStop = ()=>{
    const enabled = myVideoStream.getVideoTracks()[0].enabled;
    if(enabled){
        myVideoStream.getVideoTracks()[0].enabled = false; //for stop video
        setPlayVideo();       
    }else{
        setStopVideo();
        myVideoStream.getVideoTracks()[0].enabled = true;       //for playing 

    }
}


const setStopVideo = ()=>{
    const html = `<i class="fas fa-video"></i>
    <span>Stop Video</span>
    `
    document.querySelector(".main__video__button").innerHTML = html;
}

const setPlayVideo = ()=>{
  const html = `<i class="stop fas fa-video-slash"></i>
  <span>Play Video</span>
  `
    document.querySelector(".main__video__button").innerHTML = html;
}  
