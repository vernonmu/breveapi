const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const massive = require('massive')
const db = require('./db')
const session = require('session')

const config = require('./config.js')

const app = express()

app.use(express.static(__dirname + '/public'))

app.use(json());
app.use(cors({
  origin: 'http://www.brevetech.com',
  credentials: true
}))
app.use(session({
  secret: config.sessionSecret,
  saveUninitialized: true,
  resave: true
}))



app.listen(port, () => {
  console.log(`listenin' on ${port} port. WERK, Yah.`);
})
