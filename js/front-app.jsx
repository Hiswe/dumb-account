import React          from 'react'
import { render }     from 'react-dom'
import {
  Router,
  browserHistory
}                     from 'react-router'

import {
  createStore,
  applyMiddleware
}                     from 'redux'
import { Provider }   from 'react-redux'
// import createLogger   from 'redux-logger'
// import reducer        from '../shared/redux-reducers'

import routes         from '../shared/react-routes.jsx'

const $root             = document.querySelector('#react-main-mount')
const initialState      = window.__INITIAL_STATE__ || {}
// const loggerMiddleware  = createLogger()
const store             = createStore(function reducer(state) {
        return state
      }, initialState)
// const store             = createStore(reducer, initialState, applyMiddleware(loggerMiddleware))

// console.log(initialState)

render((
  <Provider store={store}>
    <Router history={browserHistory}>
      {routes(store)}
    </Router>
  </Provider>
), $root)
