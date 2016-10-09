import React, { Component, PropTypes } from 'react'
import { connect }  from 'react-redux'
import { Field, reduxForm } from 'redux-form/immutable'

import * as quotationsActions from '../actions/quotations-actions'
import * as customersActions from '../actions/customers-actions'

const QuotationBareForm = props => {
  const { handleSubmit, load, pristine, reset, submitting, dispatchSubmit } = props
  return (
    <form onSubmit={handleSubmit(dispatchSubmit)}>
      <div>
        <label>Name</label>
        <div>
          <Field name="name" component="input" type="text" placeholder="Name"/>
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

const QuotationForm = reduxForm({
  form: 'quotationForm',
})(QuotationBareForm)

const mapStateToProps = (state, ownProps) => {
  const {quotationId} = ownProps.params
  if (!quotationId) return {
    initialValues: {},
  }
  // console.log('quotationId', state.getIn(['entities', 'quotations', quotationId]).toJS())
  return {
    initialValues: state.getIn(['entities', 'quotations', quotationId])
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    dispatchSubmit: (values) => {
      values = values.toJS()
      dispatch(quotationsActions[values._id ? 'update' : 'add' ](values))
    }
  }
}

const Quotation = connect(mapStateToProps, mapDispatchToProps)(QuotationForm)

Quotation.actionsNeeded = [
  quotationsActions.show,
  customersActions.list,
]

export default Quotation
