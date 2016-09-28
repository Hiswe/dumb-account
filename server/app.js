import path from 'path'
import chalk from 'chalk'
import util from 'util'
import express from 'express'
import bodyParser from 'body-parser'
import compression from 'compression'
import morgan from 'morgan'
import favicon from 'serve-favicon'
import createError from 'http-errors'

import React from 'react'
import { renderToString } from 'react-dom/server'
import { RouterContext, match } from 'react-router'
// Redux
import { createStore }      from 'redux'
import { Provider }         from 'react-redux'

import config from './config'
import reactRoutes from '../shared/react-routes'
// import reactRoutingMiddleware from './react-routing-middleware'

export default () => {

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

  app.use(function reactRoutingMiddleware(req, res, next) {
    // In case of async operations (like DB queries)
    Promise.resolve({datas: {}})
    .then(mapReactRoutingToExpress)
    .catch(next)

    function mapReactRoutingToExpress(initialState) {

      const store = createStore(function reducer(state) {
        return state
      }, initialState)

      // Make the mapping from react routing to express
      match({
        routes:   reactRoutes(store),
        location: req.url,
      }, reactMatchRoute)

      function reactMatchRoute(error, redirectLocation, renderProps) {
        if (error) return next(err)
        if (redirectLocation) {
          return res.redirect(redirectLocation.pathname + redirectLocation.search)
        }
        if (!renderProps) return next()
        // use jade to render all wrapping markup
        return res.render('_layout', {
          dom: renderToString(
            <Provider store={store}>
              <RouterContext {...renderProps} />
            </Provider>
          ),
          // send initial state for front app initialization
          initialState: initialState,
        })
      }
    }
  })

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

}
