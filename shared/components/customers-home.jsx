import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { connect }  from 'react-redux'

import * as customersActions from '../actions/customers-actions'

const CustomersList = (props) => {
  return (
    <div>
      <h1>Customers</h1>
      <Link to="/customer">new customer</Link>
      <CustomerList {...props}/>
    </div>
  )
}

// in ES6 destructuring can be done on the params…
const CustomerRow = function ({customer, onRemove}) {
  let getRoute = `/customer/${customer.get('_id')}`
  let delRoute = `${getRoute}?_method=DELETE`
  return (
    <li>
      <Link to={getRoute}>{customer.get('name')}</Link>
      {'\u00A0—\u00A0'}
      <a href={delRoute} onClick={e => {
         e.preventDefault()
         onRemove()
      }}>x</a>
    </li>
  )
}

// …or can be done after
let CustomerList = function (props) {
  const {customersId, customers, onRemoveClick} = props
  let body = customersId.map( (customerId, i) => (
    <CustomerRow
      key={ customerId }
      customer={ customers.get(customerId) }
      onRemove={ _ => onRemoveClick(customerId)}
    />
  ))
  return (
    <ul>
      {body}
    </ul>
  )
}

//////
// CONTAINERS
//////

// map state properties to props…
// …this is where our components will have their infos
const mapStateToProps = (state, ownProps) => {
  return {
    customersId:  state.getIn(['result', 'customers']),
    customers:    state.getIn(['entities', 'customers']),
  }
}

// map dispatch properties to props…
// …this is where we can react to user interactions
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onRemoveClick: (id) => {
      dispatch(customersActions.remove(id))
    },
  }
}

const Customers = connect(mapStateToProps, mapDispatchToProps)(CustomersList)

Customers.actionsNeeded = [
  customersActions.list,
]

export default Customers
