import React from 'react'
import { connect }  from 'react-redux'

import * as customersActions from '../actions/customers-actions'

const CustomerForm = React.createClass({
  statics: {
    actionsNeeded: [
      customersActions.show,
    ],
  },
  handleSubmit: function (e) {
    e.preventDefault()
    const {customer}  = this.props
    const name = this.refs['customer-name'].value
    const address = this.refs['customer-address'].value
    this.props.dispatchSubmit(customer.get('_id'), {
      name,
      address,
    })
  },
  render: function () {
    const {customer}  = this.props
    const postRoute   = `/customer/${customer.get('_id')}`
    return (
      <form method="post" action={postRoute} onSubmit={this.handleSubmit}>
        <label htmlFor="name">name</label>
        <br/>
        <input id="name" ref="customer-name" name="name" defaultValue={customer.get('name')}/>
        <br/>
        <label htmlFor="address">address</label>
        <br/>
        <textarea id="address" ref="customer-address" defaultValue={customer.get('address')} name="address" />
        <br/>
        <button type="submit">update</button>
      </form>
    )
  },
})

//////
// CONTAINERS
//////

const mapStateToProps = (state, ownProps) => {
  const {customerId} = ownProps.params
  return {
    customer: state.getIn(['entities', 'customers', customerId])
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    dispatchSubmit: (id, data) => dispatch(customersActions.update(id, data))
  }
}

const Customer = connect(mapStateToProps, mapDispatchToProps)(CustomerForm)

export default Customer
