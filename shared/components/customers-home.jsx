import React from 'react'
// import { Link } from 'react-router'
// import { bindActionCreators }  from 'redux'
import { connect }  from 'react-redux'

import * as customersActions from '../actions/customers-actions'

let Customers = React.createClass({
  statics: {
    actionsNeeded: [
      customersActions.list,
    ],
  },
  handleSubmit: function (e) {
    e.preventDefault()
    let node = this.refs['customer-name']
    this.props.dispatch(customersActions.add({
      name: node.value,
    }))
    node.value = ''
  },
  // Don't put an arrow function… we want to keep track of `this`
  render: function() {
    return (
      <div>
        <h1>Customers</h1>
        <CustomerList />
        <form method="post" action="/customer" onSubmit={this.handleSubmit}>
          <input name="name" ref="customer-name"/>
          <button type="submit">Add new</button>
        </form>
      </div>
    )
  }
})

// connect to have access to dispatch
// TODO use bindActionCreators
// http://redux.js.org/docs/api/bindActionCreators.html
Customers = connect(
  state => ({ customers:  state.customers, })
)(Customers)

//

const CustomerRow = function (props) {
  let customer = props.customer
  return (
    <li>{customer.get('name')}</li>
  )
}

let CustomerList = function (props) {
  let body = props.customerIds.map( (customerId, i) => (
    <CustomerRow key={customerId} customer={props.customers.get(customerId)} />
  ))
  return (
    <ul>
      {body}
    </ul>
  )
}

function mapStateToProp(state) {
  // Immutable make use of accessors
  return {
    customerIds:  state.getIn(['result', 'customers']),
    customers:    state.getIn(['entities', 'customers']),
  }
}

CustomerList = connect(mapStateToProp)(CustomerList)

export { Customers as default }
