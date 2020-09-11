const soc = require('socket.io');

var univarsal = {roomName: "General", createdBy: "admin", description:"Random Group for Everyone", category:"general", type:"public", password:"",roomPic:'../../assets/icons/Infinity-1.9s-221px.png', roomCode:"XyzaBc1Kzsxsw3", roomLink:'http://localhost:4200/chat-dashboard/message-area',admin:"", roomMembers:0, memberDetails:{}};

let rooms  = {"XyzaBc1Kzsxsw3" : univarsal}; //room lists room_name : members
let userCount = 0;
let id_to_email = {}; 
io.on('connection',(client)=>{ 
     userCount++;  
    console.log("user connected " + userCount);    
     
    client.on('join-room', (data)=>{
        //client sends request to join perticular room (room_name)
        //rooms[room_name] = rooms[room_name]? rooms[room_name]++ : 0; //shows all the rooms and members in each room
        if(!rooms[data.room_name] || !rooms[data.room_name].hasOwnProperty('banList') || !rooms[data.room_name].banList.hasOwnProperty(data.email)){
            client.join(data.room_name);
        client.currentRoom = data.room_name; //new property to client socket that tells current room
        id_to_email[client.id] = data.email; //didn't find use till now.
        let auda_or_rutba = (data.email == rooms[client.currentRoom].admin)?"admin" : "member";
        console.log(client.id + " joined " + client.currentRoom); 
       // console.log(rooms[client.currentRoom]);

        rooms[client.currentRoom].roomMembers = rooms[client.currentRoom].roomMembers + 1;

        rooms[client.currentRoom].memberDetails[client.id] = {memberName: data.memberName, memberPropic:"", member_role: auda_or_rutba};
        if(auda_or_rutba != 'admin')
       {
         client.emit('uniqueIdReceive', {unique_id : client.id}); //sending unique client id.
       }else{
           client.emit('uniqueIdReceive', {unique_id : client.id , setAdmin: 1, group:rooms[client.currentRoom].roomName});
       }

 

        io.sockets.in(client.currentRoom).emit('new-member',{memberCount: rooms[client.currentRoom].roomMembers, allMemberDetails:rooms[client.currentRoom].memberDetails}); 
    }else{
        client.emit('rejected', {message:"Sorry can't join the room, seems like you are banned by the admin"});
    }
        
    });

 
    client.on("create-message",(data)=>{
         data['from_id'] = client.id; //inserts the message's form_id in the incoming data.
        // io.sockets.emit("new-message", JSON.stringify(data));
         io.sockets.in(client.currentRoom).emit("new-message", JSON.stringify(data));  
    });
    
    client.on('member_remove_req', (data)=>{ 
        admin_id = client.id;
        if(rooms[client.currentRoom].admin == id_to_email[client.id]){
            if(!rooms[client.currentRoom].hasOwnProperty('banList')){
                rooms[client.currentRoom]['banList'] = {};
              
            }
            rooms[client.currentRoom]['banList'][id_to_email[data.id]] = 1;
            io.sockets.sockets[data.id].emit('banned', {ban:1, roomName:rooms[client.currentRoom].roomName, message:"you were removed by the admin"});
            io.sockets.sockets[data.id].disconnect();

            io.sockets.in(client.currentRoom).emit('new-member',{memberCount: rooms[client.currentRoom].roomMembers, allMemberDetails:rooms[client.currentRoom].memberDetails}); 
        }
    });
    
    client.on("disconnect", ()=>{ 
        //console.log('user disconnected, client_id :' + client.id);  
        try{
            console.log("disconnected" + client.currentRoom + " id " + client.id);
            //  console.log(client);
              delete rooms[client.currentRoom].memberDetails[client.id];
              rooms[client.currentRoom].roomMembers = rooms[client.currentRoom].roomMembers - 1;
              io.sockets.in(client.currentRoom).emit('new-member',{memberCount: rooms[client.currentRoom].roomMembers, allMemberDetails:rooms[client.currentRoom].memberDetails});
              //delete id_to_email[client.id]; 
              userCount--; 
        }catch{
            console.log("disconnectoin error for " + client.id);
        }
       
    })
});