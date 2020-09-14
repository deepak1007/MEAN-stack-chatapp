const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const soc = require('socket.io');
const bcrypt = require('bcrypt');
const sendMail = require('./mail').sendMail;
const buildLink = require('./mail').buildLink;
const upload = require('./multerConfig'); 
const { connection } = require('mongoose');
//const http = require('http');



const app = express();
const Dbname = "ChatAppDB";
let connectedObj;

const server = app.listen(8000, () => {
    console.log('Server started!')
});

const io = soc.listen(server);
/*var client  = new MongoClient('', {useNewUrlParser:true,useUnifiedTopology: true});
*/
var client  = new MongoClient('mongodb://localhost:27017/', {useNewUrlParser:true,useUnifiedTopology: true});
client.connect((err, con)=>{
    if(!err){
        connectedObj = con;
        console.log("connected to mongoDB");
    }
    else{
        console.log("sorry couldn't connect to MongoDB");
    }
});




app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + '/upload')); 
app.use(cors());


/*app.use(cors({ //set cross origin site for socket
    origin: "http://localhost:4200",
    credentials: true
}));*/
/* 
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "true");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
    next();
});
*/



//socket---------------------------------------------->
var univarsal = {roomName: "General", createdBy: "admin", description:"Random Group for Everyone", category:"general", type:"public", password:"",roomPic:'../../assets/icons/Infinity-1.9s-221px.png', roomCode:"XyzaBc1Kzsxsw3", roomLink:'http://localhost:4200/chat-dashboard/message-area',admin:"", roomMembers:0, memberDetails:{}};
let rooms  = {"XyzaBc1Kzsxsw3" : univarsal}; //room lists room_name : members
let userCount = 0;
let id_to_email = {}; 


let private = {}

io.on('connection',(client)=>{ 
    userCount++;  
    console.log("user connected " + userCount);   
    client.on('join-room', async (data)=>{
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

       // const collection = connectedObj.db(Dbname).collection('users');
       // const userData  = await collection.find({email:email}).toArray();
       // userUniqueId = userData[0]._id;
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
         //inserts the message's form_id in the incoming data.
        // io.sockets.emit("new-message", JSON.stringify(data));

        /* for private msg no client.id */
        room = client.currentRoom;
         if(!data.hasOwnProperty('toPrivate')){
            data['from_id'] = client.id;
            console.log(1);
         }
         else {
            room = client.uniqueId;
            io.sockets.sockets[client.id].emit("new-message", JSON.stringify(data));
         }
         

         io.sockets.in(room).emit("new-message", JSON.stringify(data));  
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
            //console.log(client);
              delete rooms[client.currentRoom].memberDetails[client.id];
              rooms[client.currentRoom].roomMembers = rooms[client.currentRoom].roomMembers - 1;
              io.sockets.in(client.currentRoom).emit('new-member',{memberCount: rooms[client.currentRoom].roomMembers, allMemberDetails:rooms[client.currentRoom].memberDetails});
              //delete id_to_email[client.id]; 
              userCount--; 
        }catch{
            console.log("disconnectoin error for " + client.id);
        }
    })


//private messages

 client.on('join-private', async(metaData)=>{
    try{
     const { senderId, receiverId } = metaData;
     console.log(metaData);
     private[senderId] = {
         receiverId : receiverId,
         messageBuffer: {
             to: [],
             from:[],
         }
     }
     client.join(receiverId);
     client.currentRoom = receiverId;
     client.uniqueId = senderId;
     const collection = connectedObj.db(Dbname).collection('users');
     const data = await collection.find({_id : ObjectId(receiverId)},{projection:{_id: 1, firstname:1, lastname:1}}).toArray();
     io.sockets.in(client.currentRoom).emit("connected", data[0]);
    }catch(e){
     io.sockets.in(metaData.receiverId).emit("error");
    }
 });    
});




//socket------------------------------------------>


//routes----------------------------------------------->
app.post('/login', bodyParser.json(), (req, res)=>{
    var collection = connectedObj.db(Dbname).collection('users');
    var email = req.body.email;
    var password = req.body.password;
    collection.find({email:email, password:password}).toArray((err, data)=> {
        if(!err && data.length>0){
            if(data[0].auth==0){
                var  fullname =  data[0].firstname + data[0].lastname;
                res.send({status:true, data:{FullName: fullname , email:email, password:password, about:data.about, gender:data.gender, uniqueUserId: data[0]._id}}); 
            }else{
                res.send({status:false, data:{err:"please verify your account first with the link in your email"}})
            }
            
        }
        else{
            res.send({status:false,data:{err:"wrong email or password!"}});
        }
    })
    
})


app.post('/sign-up', bodyParser.json(), (req, res)=>{
   
    var collection = connectedObj.db(Dbname).collection("users");
    let hash = bcrypt.hashSync(req.body.email+req.body.firstname+req.body.password, 10);
    req.body['hash'] = hash;
    req.body['auth'] = 0;
    collection.find({email:req.body.email}).toArray((err,data)=>{
        if(!err && data.length==0){
            collection.insertOne(req.body,(err, innerdata)=>{
                if(!err){
                   
                    sendMail("verifyBot@ChatingApp.com",req.body.email,"verify your email",buildLink(hash))
                   
                    res.send({status:true, data:{}});
                }
                else{
                    res.send({status:false, data:{err:"sorry an error occured wile signing in"}});
                }
            });
        }else{
            res.send({status:false, data:{err:"An account with this email is already present"}});
        }
    });

});

app.post('/verify-account', bodyParser.json(), (req, res)=>{
    var hash= req.body.hash;
    var collection = connectedObj.db(Dbname).collection('users');
    collection.find({hash:hash}).toArray((err, data)=>{
        if(!err && data.length> 0){
              collection.updateOne({hash:hash}, {$set:{auth:1}}, (innerErr, innerData)=>{
                    if(!innerErr && innerData.modifiedCount>0 && innerData.matchedCount >0){
                        console.log("done");
                        res.send({status:true, data:{email:data[0].email}});
                    }else{
                        console.log(innerErr);
                        console.log(innerData);
                        res.send({status:false, data:{err:"sorry couldn't update your account"}});
                    }
              });
            }else{
                res.send({status:false, data:{err:"sorry couldn't find your account"}});
            }
     })
})

app.get('/get-details/:email', (req, res)=>{
    var collection = connectedObj.db(Dbname).collection("users");
    collection.find({email:req.params['email']}).toArray((err,data)=>{
       if(!err && data.length>0){
           var fullname = data[0].firstname + " " + data[0].lastname;
           res.send({status:"200" , data:{FullName:fullname , email:data[0].email, password: data[0].password, about:data[0].about||"", gender:data[0].gender||''}});
       }
       else{
           res.status(404).send({status:"404", data:{errMsg: "sorry no data found"}});
       }
    });
})

app.post('/save-details/:email', bodyParser.json(), (req, res)=>{
    var collection = connectedObj.db(Dbname).collection("users");
    collection.updateOne({email:req.params['email']}, {$set:{firstname:req.body.firstName, lastname:req.body.lastName,password:req.body.password,about:req.body.about, gender:req.body.gender}}, (err, data)=>{
        if(!err){
            res.send({success:true});
        }else{
            res.send({success:false});
        }
    })
})


app.post("/upload-profile-picture/:email", upload.single('profilePic',), (req, res)=>{
    if (!req.file) {
        console.log("Your request doesn’t have any file");
        return res.send({
          success: false
        });
    
      } else {
        var collection = connectedObj.db(Dbname).collection('users');

        collection.updateOne({email:req.params['email']}, {$set:{proPic: req.file.filename}},(err, data)=>{
            
            if(err)
              res.send({success:false});
            else{
                console.log('Your file has been received successfully');
                return res.send({
                  success: true,
                  proPic_src : "http://localhost:8000/"+req.file.filename
                })
            }
          
        })  
       
      }
});



app.get("/profile-picture/:email", bodyParser.json(), (req, res)=>{
     var collection = connectedObj.db(Dbname).collection('users');
     collection.find({email:req.params['email']}).toArray((err, data)=>{
         if(err){
             res.send({success: false});
         }else{
             res.send({success:true, proPic_src: data[0].proPic}); 
         }
     })
});

app.get("/view-profile/:id/:userDbId", bodyParser.json(), (req,res)=>{
    
    var collection = connectedObj.db(Dbname).collection('users');
    let email;
    let _id;
    let queryObj;


    if(req.params.id != "false"){
        email = id_to_email[req.params['id']];  
        queryObj = {
            email: email
        }
    }else{
        _id = req.params.userDbId;
        queryObj = {
            _id : ObjectId(_id)
        }
    }
     
    
    collection.find(queryObj).toArray((err,data)=>{
        if(!err && data.length>0){
            var fullname = data[0].firstname + " " + data[0].lastname;
            res.send({status:true , data:{FullName:fullname ,about:data[0].about||"", gender:data[0].gender||'', proPic_src:  data[0].proPic, _id: data[0]._id}});
        }
        else{
            res.status(404).send({status:false, data:{errMsg: "sorry no data found"}});
        }
     });
});

app.post("/query", bodyParser.json(), (req,res)=>{
    var collection = connectedObj.db(Dbname).collection('queries');
    collection.insertOne(req.body,(err,data)=>{
        if(!err){
            res.send({status:true});
        }else{
            res.send({status:false});
        }
    })
});

app.post("/create-room", bodyParser.json(), (req, res)=>{
    var collection = connectedObj.db(Dbname).collection('users');
    collection.find({email:req.body.creator}).toArray((err,data)=>{
        if(!err && data.length > 0){
            var fullname = data[0].firstname + " " + data[0].lastname;
            var roomCode = fullname + req.body.roomName;
            rooms[roomCode] = {roomName: req.body.roomName, createdBy: fullname, description:req.body.roomDescription, category:req.body.roomCategory, type:req.body.roomPrivacy, password:req.body.roomPassword,roomPic:req.body.roomPic, admin:req.body.creator, roomCode:roomCode, roomLink:'http://localhost:4200/chat-dashboard/message-area', roomMembers:0, memberDetails:{}};
            let immediate = JSON.parse(JSON.stringify(rooms[roomCode]));
            delete immediate['admin'];
            res.send({status:true, data:immediate});
        }else{
            res.send({status:false});
        } 
    })
});

app.post("/save-room-changes/:roomId", bodyParser.json(), (req, res)=>{
    try{
        const roomId = req.params.roomId;
        console.log(roomId);
        console.log(rooms);
        if(rooms.hasOwnProperty(roomId)){ 
            const {roomName, roomDescription, roomCategory, roomPasswrod, roomPrivacy, roomPic} = req.body
            rooms[roomId].roomName= roomName;
            rooms[roomId].description = roomDescription;
            rooms[roomId].category = roomCategory;
            rooms[roomId].password = roomPasswrod;
            rooms[roomId].type = roomPrivacy;
            rooms[roomId].roomPic = roomPic;
            let immediate = JSON.parse(JSON.stringify(rooms[roomId]));
            delete immediate['admin'];
            res.send({status:true, data:immediate});
        }else{
            res.send({status:false});
        }
    }catch(e){
        console.error(e);
        res.send({status:false});
    } 
});

app.post('/get-available-rooms', bodyParser.json(), (req, res)=>{
    var data = [];
    if(req.body.all == 1){
        for(var room_code in rooms){
            let immediate = JSON.parse(JSON.stringify(rooms[room_code]));
            delete immediate['admin'];
            data.push(immediate);
            
        }
    if(data[0] == ""){
       res.send({status:false});
    } else{
        res.send({status:true, data: data});
    }
   
        
        
    }else{
       if(req.body.withCode == 1){
        
            if(rooms.hasOwnProperty(req.body.roomCode)){
            data.push(rooms[req.body.roomCode]);
            console.log(rooms[req.body.roomCode]);
            res.send({status:true, data:data});
            }else{
                res.send({status:false});
            }
          
           
           
       }
    }
})


app.get('/room-by-code/:roomCode', bodyParser.json(), (req, res)=>{
    var roomCode = req.params['roomCode'];
    let data = rooms.hasOwnProperty(req.params['roomCode'])?JSON.parse(JSON.stringify(rooms[roomCode])): "";
    if(data != ""){
        delete data['admin'];
        res.send({status:true, data:data});
    }else{
        res.send({status:false});
    }
})


app.post("/room_pictures/:type/:email", upload.single('profilePic',), (req, res)=>{
    if (!req.file) {
        console.log("Your request doesn’t have any file");
        return res.send({
          success: false
        });
    
      } else {
                console.log('Your file has been received successfully');
                return res.send({
                  success: true,
                  roomPic_src : "http://localhost:8000/room_pictures/"+req.file.filename
                })
            }
          
});
       
      

/* 
 * add friends mechanism.
 */

app.post('/request-connection/:email',bodyParser.json(), async(req, res)=>{
    try{     
        const userEmail = req.params.email;
        const friendId = req.body.connectToId;
        var collection = connectedObj.db(Dbname).collection('users');
        const userData = await collection.findOne({email:userEmail});
        if(!userData) throw new Error("user Data not present");
        
        let _idUser = userData._id;
        var data = await collection.updateOne({_id:  ObjectId(friendId)},{$push: {"requests": {friendId:_idUser}}});

        if(data.nModified == 0) throw new Error("sorry could andd the connection");   
             
        
        res.send({
            status: 200,
            message: "request was sent"
        });

    }catch(e){
        console.error(e);
        res.send({
            status:300,
            message:"sorry request wasn't sent"
        });
    }  
})
app.post('/add-friend/:email',bodyParser.json(), async(req, res)=>{
    try{     
        const userEmail = req.params.email;
        const friendId = req.body.connectToId;
        const userId = req.body.ownId;
        var collection = connectedObj.db(Dbname).collection('users');
        var data = await collection.updateOne({email:userEmail},{$push: {"connections": {friendId: ObjectId(friendId)}}});

        var data = await collection.updateOne({_id: ObjectId(friendId)},{$push: {"connections": {friendId: ObjectId(userId)}}});

        if(data.nModified == 0) throw new Error("sorry could and the connection");   
            
        var data = await collection.updateOne({email:userEmail},{"$pull": {"requests": {"friendId": ObjectId(friendId)}}});
        
        console.log(data);
        res.send({
            status: 200,
            message: "new connection was added",
            data 
        })
    }catch(e){
        console.error(e);
        res.send({
            status:300,
            message:"sorry could add the connection"
        });
    }
    
})

app.get('/get-requests-list/:email', bodyParser.json(), async(req, res)=>{
    try{
       const userEmail = req.params.email;
       let collection = connectedObj.db(Dbname).collection('users');
       const userData = await collection.findOne({email: userEmail});
       const requestList = userData.requests;
       if(!requestList.length) throw new Error("no friends");
    
       const requestIds = [];
       if(requestList instanceof Array){
           requestList.forEach(x => {
               if(!x.friendId) return;               
               requestIds.push(ObjectId(x.friendId));
           });

           const requestListWithDetails = await collection.find({_id: {$in: requestIds}},{ projection :{'firstname':1 , 'lastname':1, 'proPic':1 , 'about': 1, '_id':1}}).toArray();
           if (requestListWithDetails.length > 0)
           res.status(200).send({
               status:200, 
               message:"connection requests", 
               data:requestListWithDetails
            });
           else
           res.status(200).send({ 
               status:false,
               message:"sorry no data received",
               data:null
           });
       }
    }catch(e){
        console.error(e);
        res.status(200).send({
            status:false,  
            message:"there was an error in retrieving connection requests", 
            data:null
        });
    }
})


app.get('/get-connection-list/:email', bodyParser.json(), async(req, res)=>{
    try{
       const userEmail = req.params.email;
       let collection = connectedObj.db(Dbname).collection('users');
       const userData = await collection.findOne({email: userEmail});
       const connectionList = userData.connections;
       if(!connectionList.length) throw new Error("no friends");
    
       const connectionIds = [];
       if(connectionList instanceof Array){
           connectionList.forEach(x => {
               if(!x.friendId) return;               
               connectionIds.push(ObjectId(x.friendId));
           });

           const connectionListWithDetails = await collection.find({_id: {$in: connectionIds}},{ projection :{'firstname':1 , 'lastname':1, 'proPic':1 , 'about': 1, '_id':1}}).toArray();
           
           if (connectionListWithDetails.length > 0)
           res.status(200).send({
               status:200, 
               message:"connection requests", 
               data:connectionListWithDetails
            });
           else
           res.status(200).send({ 
               status:false,
               message:"sorry no data received",
               data:null
           });
       }
    }catch(e){
        res.status(200).send({
            status:false, 
            message:"there was an error in retrieving connection requests", 
            data:null
        });
    }
})

app.get("/get", bodyParser.json(), async(req, res)=>{
    var collection = connectedObj.db(Dbname).collection('users');
    const userData = await collection.find({email: "just@gmail.com"}).toArray();

    res.send({data: userData});
})

