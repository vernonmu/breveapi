const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const massive = require('massive')
const db = require('./db')
const session = require('express-session')
const nodemailer = require('nodemailer');
const config = require('./config.js')
const port = config.port
const db = require('./db.js')
require ('dotenv').config()

const app = express()


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

app.get('/ptcd/cal', (req,res,next) => {
  axios.get(`https://www.googleapis.com/calendar/v3/calendars/${process.env.calendarid}/events?key=${process.env.mykey}`)
  .then((response) => {
      let items = response.data.items.map( (val, idx) => {
        if (val.start) {
          val.date = moment(val.start.dateTime).format('dddd, MMMM DD, YYYY')
          // console.log(val.date);
        }
      })
    res.status(200).json(response.data)
  })
  .catch( error => {
    return console.log(error);
  })
})

app.post('/ptcd/', (req,res,next) => {
  console.log(req.body);
  console.log(req.body.gender);
  let date = Date.now()

  db.createAthlete([
    req.body.athlete_first,
    req.body.athlete_last,
    req.body.dob,
    req.body.gender,
    req.body.school,
    req.body.parent_first,
    req.body.parent_last,
    req.body.street,
    req.body.city,
    req.body.zip,
    req.body.role,
    req.body.telephone,
    req.body.email,
    req.body.emergency_one_first, req.body.emergency_one_last, req.body.emergency_one_relationship,
    req.body.emergency_one_phone,
    req.body.emergency_two_first,
    req.body.emergency_two_last,
    req.body.emergency_two_relationship,
    req.body.emergency_two_phone,
    req.body.medications,
    req.body.emergency_choice,
    date], (err, data) => {
      if (err) {next(err)}
      return res.status(200).json(data)
  })
})

app.post('/ptcd/message', (req,res,next) => {
  console.log(req.body);
  let tempDate = Date.now()
  let date = moment(tempDate).format('dddd, MMMM DD, YYYY h:mm:ss')

  db.createMessage([
    req.body.first_name,
    req.body.last_name,
    req.body.message,
    date
  ], (err, message) => {
    if (err) {next(err)}
    else {return res.status(200).json(message)}
  })
})




app.listen(port, () => {
  console.log(`listenin' on ${port} port. WERK, Yah.`);
})
