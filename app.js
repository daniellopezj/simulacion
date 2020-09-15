var express = require('express');
const helmet = require('helmet')
var path = require('path');
const cors = require('cors')
const bodyParser = require('body-parser')
var logger = require('morgan')
const morgan = require('morgan')

var app = express()

// for parsing json
app.use(
  bodyParser.json({
    limit: '20mb'
  })
)
// for parsing application/x-www-form-urlencoded
app.use(
  bodyParser.urlencoded({
    limit: '20mb',
    extended: true
  })
)

app.set('port', process.env.PORT || 3000)

// view engine setup
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(cors())
app.use(helmet())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', require('./app/routes'))
app.listen(app.get('port'))
console.log('****************************')
console.log('*    Starting Server')
console.log(`*    Port: ${process.env.PORT || 3000}`)
console.log(`*    NODE_ENV: ${process.env.NODE_ENV}`)
console.log('****************************')
module.exports = app;
