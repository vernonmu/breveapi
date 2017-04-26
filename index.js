const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const massive = require('massive')
const db = require('./db')
const session = require('express-session')

const config = require('./config.js')

const app = express()

const port = config.port

app.use(bodyParser());
app.use(cors({
  origin: ['http://www.brevetech.com', 'http://localhost:4217'],
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

app.post('/api/', (req,res,next) => {
  db.createInq([req.body.firstname, req.body.lastname, req.body.email, req.body.comment, req.body.date, req.body.phone, req.body.typeofproj], (err, data) => {
    if (err) {return next(err)}
    return res.status(200).json(data)
  })
})



app.listen(port, () => {
  console.log(`listenin' on ${port} port. WERK, Yah.`);
})
