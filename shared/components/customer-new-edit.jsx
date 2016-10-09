import React, { Component, PropTypes } from 'react'
import { connect }  from 'react-redux'
import { Field, reduxForm } from 'redux-form/immutable'

import * as customersActions from '../actions/customers-actions'

const CustomerBareForm = props => {
  const { handleSubmit, load, pristine, reset, submitting, dispatchSubmit } = props
  return (
    <form onSubmit={handleSubmit(dispatchSubmit)}>
      <div>
        <label>First Name</label>
        <div>
          <Field name="name" component="input" type="text" placeholder="Full Name"/>
        </div>
      </div>
      <div>
        <label>Address</label>
        <div>
          <Field name="address" component="textarea" placeholder="address"/>
        </div>
      </div>
      <div>
        <button type="submit" disabled={pristine || submitting}>Submit</button>
        <button type="button" disabled={pristine || submitting} onClick={reset}>Undo Changes</button>
      </div>
    </form>
  )
}

//////
// CONTAINERS
//////

// Decorate with reduxForm(). It will read the initialValues prop provided by connect()
const CustomerForm = reduxForm({
  form:     'customerForm',  // a unique identifier for this form
  // Don't use onSubmit function
  // We want to have access to redux's dispatch
  // onSubmit: data => { },
})(CustomerBareForm)

const mapStateToProps = (state, ownProps) => {
  const {customerId} = ownProps.params
  if (!customerId) return {
    initialValues: {}
  }
  return {
    initialValues: state.getIn(['entities', 'customers', customerId])
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    dispatchSubmit: (values) => {
      values = values.toJS()
      dispatch(customersActions[values._id ? 'update' : 'add' ](values))
    }
  }
}

const Customer = connect(mapStateToProps, mapDispatchToProps)(CustomerForm)

Customer.actionsNeeded = [
  customersActions.show,
]

export default Customer
