import React            from 'react'
import { render }       from 'react-dom'
import {
  Router,
  browserHistory,
}                       from 'react-router'
import {
  createStore,
  applyMiddleware,
  compose,
}                       from 'redux'
import { Provider }     from 'react-redux'
import createLogger     from 'redux-logger'
import axios            from 'axios'
import axiosMiddleware  from 'redux-axios-middleware'
import Immutable        from 'immutable'

import reducer        from '../shared/reducers'
import routes         from '../shared/react-routes.jsx'

const $root             = document.querySelector('#react-main-mount')
const initialState      = Immutable.fromJS(window.__INITIAL_STATE__ || {})
const apiCall           = axios.create({
  baseURL:      `/api/v1`,
  responseType: 'json',
})
const middleware        = [
  axiosMiddleware(apiCall),
  createLogger(),
]

// emable redux-devtools-extension when installed on chrome
// https://github.com/zalmoxisus/redux-devtools-extension#12-advanced-store-setup
const store             = createStore(reducer, initialState, compose(
  applyMiddleware(...middleware),
  window.devToolsExtension ? window.devToolsExtension() : f => f,
))

render((
  <Provider store={store}>
    <Router history={browserHistory}>
      {routes(store)}
    </Router>
  </Provider>
), $root)
