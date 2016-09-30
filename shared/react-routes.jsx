import React from 'react'
import { Route, IndexRoute, Redirect } from 'react-router'

import Layout         from './components/_layout.jsx'
import Home           from './components/home.jsx'

import QuotationHome  from './components/quotations-home.jsx'

import CustomersHome  from './components/customers-home.jsx'

import _404           from './components/404.jsx'

// wrap in a function for router to have access the state
export default function provideRouter(store) {

  // function onEnter(type) {
  //   const paramName = type === 'customers' ? 'customerId' : 'fakeId';

  //   return function (nextState, replace) {
  //     const state       = store.getState()
  //     const hasParam    = nextState.params[paramName] != null
  //     const isUnvalidId = state.result[type].indexOf(nextState.params[paramName]) < 0
  //     if (hasParam && isUnvalidId) return replace('/404')
  //   }
  // }

  return (
    <Route path="/" component={Layout}>
      <IndexRoute component={Home} />

      <Route path="quotations" component={QuotationHome} />

      <Route path="customers" component={CustomersHome} />

      <Route path="404" component={_404} />
      <Route path="*" component={_404} />
    </Route>
  )
}
