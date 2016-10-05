import path from 'path'
import chalk from 'chalk'
import util from 'util'
import express from 'express'
import bodyParser from 'body-parser'
import methodOverride from 'method-override'
import compression from 'compression'
import morgan from 'morgan'
import favicon from 'serve-favicon'
import createError from 'http-errors'
// React
import React from 'react'
import { renderToString } from 'react-dom/server'
import { RouterContext, match } from 'react-router'
// Redux
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import createLogger from 'redux-logger'
import axios from 'axios'
import axiosMiddleware from 'redux-axios-middleware'
// redux handle immutable state…
// …add a lib to help not messing with object mutations
// a better alternative could be https://github.com/substantial/updeep
import Immutable from 'immutable'


import config from './config'
import {default as reactRoutes, fetchComponentData} from '../shared/react-routes'
import api from './api'
import reducers from '../shared/reducers'

export default () => {

  console.log(util.inspect(config))

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
  // enable other methods from request (PUT, DELETE…)
  app.use(methodOverride('_method', {methods: ['GET', 'POST']}))
  app.use(compression())
  // app.use(favicon(path.join(__dirname, '../res/favicon.png')))
  // app.use(cookieParser())

  //----- TEMPLATES

  app.set('views', path.join(__dirname, './views'))
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

  //----- JSON API

  app.use('/api/v1', api)

  // expose axios to req, so we can make api call easily server-side
  // can't create it outside a middleware because we need req.protocol
  app.use((req, res, next) => {
    req.apiCall = axios.create({
      baseURL:      `${req.protocol}://${config.host}/api/v1`,
      responseType: 'json',
    })
    next()
  })

  //----- NO-JS BACKUP

  // In order to have a real isomorphic app…
  // …we need to take care of no-AJAX request

  app.post('/quotation/:quotationId?', (req, res, next) => {
    console.log(req.body)
    const {quotationId} = req.params
    req.apiCall
    .post(req.path, req.body)
    .then(() => {
      if (quotationId) return res.redirect(`/quotation/${quotationId}`)
      res.redirect('/quotations')
    })
    .catch(next)
  })


  app.post('/customer/:customerId?', (req, res, next) => {
    const {customerId} = req.params
    req.apiCall
    .post(req.path, req.body)
    .then(() => {
      if (customerId) return res.redirect(`/customer/${customerId}`)
      res.redirect('/customers')
    })
    .catch(next)
  })
  app.delete('/customer/:customerId', (req, res, next) => {
    req.apiCall
    .delete(req.path)
    .then( () => res.redirect('/customers'))
    .catch(next)
  })

  //----- REACT ROUTER INTEGRATION

  app.use(function reactRoutingMiddleware(req, res, next) {
    // Add a middleware to Redux to avoid doing manual async functions
    // This middleware use promises :)
    // https://github.com/svrcekmichal/redux-axios-middleware#use-middleware
    const middleware = [
      axiosMiddleware(req.apiCall),
      // createLogger({ colors: false, }),
    ]
    // Define a coherent empty state
    // TODO could be done by counting models on ./models.js
    const emptyState = Immutable.fromJS({
      entities: {
        quotations: {},
        customers:  {},
      },
      result: {
        quotations: [],
        customers:  [],
      },
    })
    const store = createStore(reducers, emptyState, applyMiddleware(...middleware) )

    // Map routing from express to react
    match({
      routes:   reactRoutes(store),
      location: req.url,
    }, reactMatchRoute)

    function reactMatchRoute(err, redirectLocation, renderProps) {
      if (err) return next(err)
      if (redirectLocation) {
        return res.redirect(redirectLocation.pathname + redirectLocation.search)
      }
      if (!renderProps) return next()

      // fetch datas from components
      // present in the react-routes file, as it is used front-end & back-end
      fetchComponentData(store.dispatch, renderProps.components, renderProps.params)
      .then(renderView)
      .catch(next)

      function renderView() {
        // Redux store should be up date to that at this time
        // we can safely get current sate
        // const initialState = store.getState()
        // needed for not putting functions in HTML body
        const initialState = store.getState().toJS()
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
