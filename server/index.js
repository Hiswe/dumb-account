'use strict'

const path        = require('path')
const chalk       = require('chalk')
const util        = require('util')
const express     = require('express')
const bodyParser  = require('body-parser')
const compression = require('compression')
const morgan      = require('morgan')
const favicon     = require('serve-favicon')
const createError = require('http-errors')

const config      = require('./config')

//////
// SERVER CONFIG
//////

const app = express()

app.set('trust proxy', true)
app.use(bodyParser.json({
  limit: '5mb'
}))
app.use(bodyParser.urlencoded({
  limit: '5mb',
  extended: true,
}))
app.use(compression())
// app.use(favicon(path.join(__dirname, '../res/favicon.png')))
// app.use(cookieParser())

//----- TEMPLATES

app.set('views', path.join(__dirname, '../views'))
app.set('view engine', 'pug')

//----- STATIC

app.use(express.static( path.join(__dirname, '../public') ))

//////
// LOGGING
//////

function logRequest(tokens, req, res) {
  const method  = chalk.blue(tokens.method(req, res))
  const url     = chalk.grey(tokens.url(req, res))
  return `${method} ${url}`
}

function logResponse(tokens, req, res) {
  const method      = chalk.blue(tokens.method(req, res))
  const url         = chalk.grey(tokens.url(req, res))
  const status      = tokens.status(req, res)
  const statusColor = status >= 500
    ? 'red' : status >= 400
    ? 'yellow' : status >= 300
    ? 'cyan' : 'green';
  return `${method} ${url} ${chalk[statusColor](status)}`
}
app.use(morgan(logRequest, {immediate: true}))
app.use(morgan(logResponse))

//////
// ROUTING
//////

app.get('/', (req, res, next) => res.send('home'))

//////
// ERROR HANDLING
//////

// everyhting that go there without an error should be treated as a 404
app.use( (req, res, next) =>  next(createError(404)) )

app.use( (err, req, res, next) => {
  const status = err.status || err.statusCode || (err.status = 500)
  console.log('error handling', status)
  if (status >= 500) {
    console.log(util.inspect(err, {showHidden: true}))
    console.trace(err)
  }

  // force status for morgan to catch up
  res.status(status)
  // different formating
  if (req.xhr) return res.send(err)
  if (!err.stacktrace) err.stacktrace = err.stack || new Error(err).stack
  return res.render('error', {err})
})

//////
// LAUNCHING
//////

const server = app.listen(config.PORT, function endInit() {
  console.log(
    chalk.green('Server is listening on port'), chalk.cyan(server.address().port),
    chalk.green('on mode'), chalk.cyan(config.NODE_ENV)
  )
})
