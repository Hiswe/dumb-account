import React from 'react'
import { Route, IndexRoute, Redirect } from 'react-router'

import Layout           from './components/_layout.jsx'
import Home             from './components/home.jsx'
import QuotationHome    from './components/quotations-home.jsx'
import QuotationNewEdit from './components/quotation-new-edit.jsx'
import CustomersHome    from './components/customers-home.jsx'
import CustomerNewEdit  from './components/customer-new-edit.jsx'

import _404             from './components/404.jsx'


// walk all components used for this route
// look at the static actionsNeeded property
// collect all actions and gather them to consolidate init datas
export function fetchComponentData(dispatch, components, params) {
  const needs = components.reduce( (prev, current) => {
    return current ? (current.actionsNeeded || []).concat(prev) : prev
  }, []);
  const promises = needs.map(need => dispatch(need(params)))
  return Promise.all(promises)
}

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

  // We don't want on the front-end to fetch datas for components when app has just been initialed
  // We check if can go back in history, if not do nothing
  // onEnter is also evaluated server-side, but the check will be sufficient to prevent a double request also
  // https://github.com/ReactTraining/react-router/issues/1938#issuecomment-149089665
  function handleEnter(nextState, replace, cb) {
    if (nextState.location.action !== 'POP') {
      const params = nextState.params
      const components = nextState.routes.map(route => route.component)
      fetchComponentData(store.dispatch, components, params)
    }
    cb()
  }

  return (
    <Route path="/" component={Layout}>
      <IndexRoute component={Home} onEnter={handleEnter} />

      <Route path="quotations" component={QuotationHome} onEnter={handleEnter} />
      <Route path="quotation(/:quotationId)" component={QuotationNewEdit} onEnter={handleEnter} />

      <Route path="customers" component={CustomersHome} onEnter={handleEnter} />
      <Route path="customer(/:customerId)" component={CustomerNewEdit} onEnter={handleEnter} />


      <Route path="404" component={_404} />

    </Route>
  )
}

// Remove * route as the '_404 component'…
// …override renderProps.components legit component
// <Route path="*" component={_404} />
