import React, { Component, PropTypes } from 'react'
import { connect }  from 'react-redux'

import * as customersActions from '../actions/customers-actions'

class CustomerForm extends Component {

  static actionsNeeded = [
    customersActions.show,
  ]

  handleSubmit(e) {
    // e.preventDefault()
    // const {customer}  = this.props
    // const name = this.refs['customer-name'].value
    // const address = this.refs['customer-address'].value
    // this.props.dispatchSubmit(customer.get('_id'), {
    //   name,
    //   address,
    // })
  }

  render() {
    const {customer}  = this.props
    const postRoute   = customer ? `/customer/${customer.get('_id')}` : `/customer`
    return (
      <form method="post" action={postRoute} onSubmit={this.handleSubmit}>
        <label htmlFor="name">name</label>
        <br/>
        <input id="name" ref="customer-name" name="name" defaultValue={customer ? customer.get('name') : ''}/>
        <br/>
        <label htmlFor="address">address</label>
        <br/>
        <textarea id="address" ref="customer-address" defaultValue={customer ? customer.get('address') : ''} name="address" />
        <br/>
        <button type="submit">update</button>
      </form>
    )
  }
}

//////
// CONTAINERS
//////

const mapStateToProps = (state, ownProps) => {
  const {customerId} = ownProps.params
  if (!customerId) return {}
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
