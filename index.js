const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const massive = require('massive')
const db = require('./db')
const session = require('express-session')
const nodemailer = require('nodemailer');

const config = require('./config.js')

const app = express()

const port = config.port

app.use(bodyParser());
app.use(cors({
  origin: ['http://www.brevetech.com', 'http://localhost:4217', 'http://127.0.0.1:8080', 'http://www.wedofuels.com', 'http://www.wedofuels.net'],
  credentials: true
}))
app.use(session({
  secret: config.sessionSecret,
  saveUninitialized: true,
  resave: true
}))

app.get('/api/', (req, res, next) => {
  db.getAll([], (err, inq) => {
    if (err) {return next(err)}
    return res.status(200).json(inq)
  })
})
app.post('/gfg/', (req,res,next) => {
  db.createMessage([req.body.name, req.body.email, req.body.details, req.body.date], (err, data) => {
    if (err) {return next(err)}
    return res.status(200).json(data)
  })
})

app.post('/api/', (req,res,next) => {
  db.createInq([req.body.firstname, req.body.lastname, req.body.email, req.body.comment, req.body.date, req.body.phone, req.body.typeofproj], (err, data) => {
    if (err) {return next(err)}
    console.log(req.body.firstname, data[0].firstname);
    let text = 'TEXT: A form has been submitted with the following details ' + data[0].firstname + ' ' + req.body.firstname + ' ' + req.body.email
    // setup email data with unicode symbols
    let mailOptions = {
        from: 'Inquiry Form', // sender address
        to: 'vernonmu@gmail.com', // list of receivers
        subject: 'New Inquiry from BreveTech ✔',
        // Subject line
        // text: 'Check your mail!',
        // html: '<b>Hello world ?</b>'
        text: text,

        html: 'TEXT: A form has been submitted with the following details: '
            + ' ' + '<p> Name: ' + data[0].firstname + ' ' + data[0].lastname + '</p>'
            + '<p> Email: ' + data[0].email + '</p>'
            + '<p> Phone: ' + data[0].phone + '</p>'
            + '<p> Date: ' + data[0].date + '</p>'
            + '<p> Type of Project: ' + data[0].typeofproj + '</p>'
            + '<p> Comment: ' + data[0].comment + '</p>'
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }

        console.log('Message %s sent: %s', info.messageId, info.response);
    });

    return res.status(200).json(data)
  })
})


let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.mail,
        pass: config.mailer
    }
});






app.listen(port, () => {
  console.log(`listenin' on ${port} port. WERK, Yah.`);
})
