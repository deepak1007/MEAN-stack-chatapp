const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const soc = require('socket.io');
//const http = require('http');


const app = express();
const Dbname = "ChatAppDB";
const DIR = './server/upload';
let connectedObj;

const server = app.listen(8000, () => {
    console.log('Server started!')
});

//const server = http.Server(app);
const io = soc.listen(server);

/*const io = soc(server, {
    handlePreflightRequest: (req, res)=>{
        const headers = {
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Oringin" : "http://localhost:4200",
            "Access-Control-Allow-Credentials" : true

        };

        res.writeHead(200,headers);
        res.end();
    }

});*/


let storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, DIR);
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now() + "-"+  file.originalname.split('@')[0] + '.' + "jpg");
    }
});
let upload = multer({storage: storage});



/*var client  = new MongoClient('mongodb+srv://deepaksharma:deepak12333@deepak-adqsa.mongodb.net/ChatAppDB?retryWrites=true&w=majority', {useNewUrlParser:true,useUnifiedTopology: true});
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
let userCount = 0;
io.on('connection',(client)=>{
     userCount++;
    console.log("user connected " + userCount);


    client.on("create-message",(data)=>{
        
        io.emit("new-message", JSON.stringify(data));

    });

    client.on("disconnect", ()=>{
        console.log('user disconnected');
        userCount--;
    })
})




//socket------------------------------------------>


//routes----------------------------------------------->
app.post('/login', bodyParser.json(), (req, res)=>{
    var collection = connectedObj.db(Dbname).collection('users');
    var email = req.body.email;
    var password = req.body.password;
    collection.find({email:email, password:password}).toArray((err, data)=> {
        if(!err && data.length>0){
            console.log(data);
            console.log(data.length);
            var  fullname =  data[0].firstname + data[0].lastname;
            res.status(200).send({status:"ok", data:{FullName: fullname , email:email, password:password, about:data.about, gender:data.gender, auth:1}}); 
        }
        else{
            res.status(404).send({status:"not ok",data:{err:"couldn't find any data sorry!"}});
        }
    })
    
})


app.post('/sign-up', bodyParser.json(), (req, res)=>{
    var collection = connectedObj.db(Dbname).collection("users");
    collection.insertOne(req.body,(err, data)=>{
        if(!err){
            res.status(201).send({status:"ok", data:{name:req.body.firstname, email: req.body.email}});
        }
        else{
            console.log("ghhh");
            res.status(204).send({status:"not ok", data:{err:"sorry an error occured wile signing in"}})
        }
    })
})


app.get('/get-details/:email', (req, res)=>{
    var collection = connectedObj.db(Dbname).collection("users");
    collection.find({email:req.params['email']}).toArray((err,data)=>{
       if(!err && data.length>0){
           var fullname = data[0].firstname + " " + data[0].lastname;
           res.send({status:"200" , data:{FullName:fullname , email:data[0].email, password: data[0].password, about:data[0].about||"", gender:data[0].gender||'', public_id: data[0]._id}});
       }
       else{
           res.status(404).send({status:"404", data:{errMsg: "sorry no data found"}});
       }
    });
})

app.post('/save-details/:email', bodyParser.json(), (req, res)=>{
    var collection = connectedObj.db(Dbname).collection("users");
    collection.updateOne({email:req.params['email']}, {$set:{password:req.body.password,about:req.body.about, gender:req.body.gender}}, (err, data)=>{
        if(!err){
            res.send({success:true});
        }else{
            res.send({success:false});
        }
    })
})


app.post("/upload-profile-picture/:email", upload.single('profilePic'), (req, res)=>{
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
})