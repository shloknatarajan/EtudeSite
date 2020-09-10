// const send = require('gmail-send')({
//   user: 'etudereaderllc@gmail.com',
//   pass: 'ibeabazbbdlwnurk',
//   to:   'etashthebomb@gmail.com',
//   subject: 'test subject',
// });
// send({
//   text:    'gmail-send example 1',  
// }, (error, result, fullResult) => {
//   if (error) console.error(error);
//   console.log(result);
// })

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
 service: 'gmail',
 auth: {
        user: 'etudereaderllc@gmail.com',
        pass: 'ibeabazbbdlwnurk'
    }
});
const mailOptions = {
  from: 'etudereaderllc@gmail.com', // sender address
  to: 'etashthebomb@gmail.com', // list of receivers
  subject: 'Subject of your email', // Subject line
  html: '<p>Your html here</p>'// plain text body
};

transporter.sendMail(mailOptions, function (err, info) {
   if(err)
     console.log(err)
   else
     console.log(info);
});