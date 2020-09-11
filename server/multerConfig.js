const multer = require('multer');

let DIR = './server/upload';
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        try{
            DIR = './upload/';
            if(req.params.type == "room"){
                DIR = './upload/room_pictures';
            }
            cb(null, DIR);
        }catch{
            cb(null, DIR);
        }
     
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now() +  '.' + "jpg");
    }
});
 
let upload = multer({storage: storage});

module.exports = upload;