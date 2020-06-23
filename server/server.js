const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

var Dbname = "ChatAppDB";

/*var client  = new MongoClient('mongodb+srv://deepaksharma:deepak12333@deepak-adqsa.mongodb.net/ChatAppDB?retryWrites=true&w=majority', {useNewUrlParser:true,useUnifiedTopology: true});
*/

var client  = new MongoClient('mongodb://localhost:27017/', {useNewUrlParser:true,useUnifiedTopology: true});

var connectedObj;

client.connect((err, con)=>{
    if(!err){
        connectedObj = con;
        console.log("connected to mongoDB");
    }
    else{
        console.log("sorry couldn't connect to MongoDB");
    }
});




const app = express();
app.use(bodyParser.json())
app.use(cors());


app.listen(8000, () => {
    console.log('Server started!')
});



app.post('/login', bodyParser.json(), (req, res)=>{
    var collection = connectedObj.db(Dbname).collection('users');
    var email = req.body.email;
    var password = req.body.password;
    collection.find({email:email, password:password}).toArray((err, data)=> {
        if(!err && data.length>0){
            console.log(data);
            console.log(data.length);
            var  fullname =  data[0].firstname + data[0].lastname;
            res.status(200).send({status:"ok", data:{FullName: fullname , email:email, auth:1}});
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
           console.log(data);
           var fullname = data[0].firstname + data[0].lastname;
           res.send({status:"200" , data:{FullName:fullname , email:data[0].email, password: "xyhsyxsahfhasdf"}});
       }
       else{
           res.status(404).send({status:"404", data:{errMsg: "sorry no data found"}});
       }
    });
})




