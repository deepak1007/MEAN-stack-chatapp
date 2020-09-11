const MongoClient = require('mongodb').MongoClient;

var client  = new MongoClient('mongodb://localhost:27017/', {useNewUrlParser:true,useUnifiedTopology: true});

let connectedObj;
client.connect((err, con)=>{
    if(!err){
        connectedObj = con;
        console.log("connected to mongoDB");
        
    }
    else{
        console.log("sorry couldn't connect to MongoDB");
        return 1;
    }
});


module.exports = connectedObj;