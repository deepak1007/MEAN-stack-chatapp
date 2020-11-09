var nodemailer = require('nodemailer');


exports.buildLink= function(hash){
    var emailBody = "<h2><center> Hello FactChecker <center><h2><h3>Please click on the link below to verify your account</h3>";
    emailBody = emailBody + "<a href='http://localhost:4200/verify-account?hash=" + hash + "'>click here to verify</a>";
    return emailBody;
}

exports.sendMail = function(from, to, subject,  htmlmsg){
    let transporter=nodemailer.createTransport(
        {
            host:"smtp.gmail.com",
            port:587,
            secure:false,
            auth:
            {
             
              
    
            }
        }
      );
    let mailOptions=
    {
       from:from ,
       to:to,
       subject:subject,
       html:htmlmsg
    };
    transporter.sendMail(mailOptions ,function(error,info)
    {
      if(error)
      {
        console.log(error);
        emailFlag = 0;
      }
      else
      {  emailFlag = 1;
        console.log('Email sent:'+info.response);
      }
    });
}