import React, { Component, PropTypes } from 'react'
import { connect }  from 'react-redux'
import { Field, reduxForm } from 'redux-form/immutable'

import * as quotationsActions from '../actions/quotations-actions'
import * as customersActions from '../actions/customers-actions'



const QuotationBareForm = props => {
  const { handleSubmit, load, pristine, reset, submitting, dispatchSubmit } = props
  const { customersId, customers } = props
  const customersOptions = customersId.map( (customerId, i) => (
    <option
      key={ customerId }
      value={ customerId }
    >{ customers.getIn([customerId, 'name']) }</option>
  ))

  return (
    <form onSubmit={handleSubmit(dispatchSubmit)}>
      <fieldset>
        <legend>General</legend>
        <p>
          <label htmlFor="name">Name</label>
          <br />
          <Field name="name" component="input" type="text" placeholder="Name"/>
        </p>
        <p>
          <label htmlFor="_customer">Customer</label>
          <br />
          <Field name="_customer" component="select">
            { customersOptions }
          </Field>
        </p>
        <p>
          <label htmlFor="tax">Tax</label>
          <br />
          <Field name="tax" component="input" type="number" />
        </p>
      </fieldset>
      <fieldset>
        <legend>detail</legend>
      </fieldset>
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

// Compose QuotationBareForm with reduxForm

const QuotationForm = reduxForm({
  form: 'quotationForm',
})(QuotationBareForm)

const mapStateToProps = (state, ownProps) => {
  // retrieve ID from router params
  const { quotationId } = ownProps.params
  const props = {
    customersId:  state.getIn(['result', 'customers']),
    customers:    state.getIn(['entities', 'customers']),
    // initialValues is a reduxForm requirements
    initialValues: !quotationId ? {} : state.getIn(['entities', 'quotations', quotationId]),
  }
  // if (!quotationId) return props
  // props.initialValues = state.getIn(['entities', 'quotations', quotationId])
  return props
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    dispatchSubmit: (values) => {
      values = values.toJS()
      dispatch(quotationsActions[values._id ? 'update' : 'add' ](values))
    }
  }
}

// Compose Quotation's reduxForm with connect

const Quotation = connect(mapStateToProps, mapDispatchToProps)(QuotationForm)

Quotation.actionsNeeded = [
  quotationsActions.show,
  customersActions.list,
]

export default Quotation
