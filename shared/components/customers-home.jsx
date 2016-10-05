import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
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
        <form method="post" action="/customer" onSubmit={this.handleSubmit}>
          <input name="name" ref="customer-name"/>
          <button type="submit">Add new</button>
        </form>
        <CustomerList />
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
      key={customerId}
      customer={customers.get(customerId)}
      onRemove={() => onRemoveClick(customerId)}
    />
  ))
  return (
    <ul>
      {body}
    </ul>
  )
}

// map state properties to props…
// …this is where our components will have their infos
function mapStateToProp(state) {
  // Immutable make use of accessors
  return {
    customersId:  state.getIn(['result', 'customers']),
    customers:    state.getIn(['entities', 'customers']),
  }
}

// map dispatch properties to props…
// …this is where we can react to user interactions
function mapDispatchToProp(dispatch, ownProps) {
  return {
    onRemoveClick: (id) => {
      dispatch(customersActions.remove(id))
    }
  }
}
// a precious example of what is it to separate view components and states
// http://redux.js.org/docs/basics/ExampleTodoList.html
CustomerList = connect(mapStateToProp, mapDispatchToProp)(CustomerList)

export { Customers as default }
