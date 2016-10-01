import React from 'react'
import { Link }     from 'react-router'
import { connect }  from 'react-redux'

import * as customersActions from '../actions/customers-actions'

const Customers = React.createClass({
  statics: {
    actionsNeeded: [
      customersActions.list,
    ],
  },
  render: () =>{
    return (
      <div>
        <h1>Customers</h1>
        <CustomerList />
        <form method="post" action="/customer">
          <input name="name" />
          <button className="btn" type="submit">Add new</button>
        </form>
      </div>
    )
  }
})

const CustomerRow = function (props) {
  let customer = props.customer
  return (
    <li>{customer.name}</li>
  )
}

let CustomerList = function (props) {
  let body = props.customers.map( (customer, i) => (
    <CustomerRow key={customer.name} customer={customer} />
  ))
  return (
    <ul>
      {body}
    </ul>
  )
}

function mapStateToProp(state) {
  return {
    // ids:        state.result.customers,
    customers:  state.customers,
  }
}

CustomerList = connect(mapStateToProp)(CustomerList)

export { Customers as default }
