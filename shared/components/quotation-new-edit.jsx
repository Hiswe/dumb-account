import React, { Component, PropTypes } from 'react'
import { connect }  from 'react-redux'
import { Field, reduxForm } from 'redux-form'

import * as quotationsActions from '../actions/quotations-actions'
import * as customersActions from '../actions/customers-actions'

const QuotationForm = React.createClass({
  statics: {
    actionsNeeded: [
      quotationsActions.show,
      customersActions.list,
    ],
  },
  handleSubmit: function (e) {
    // e.preventDefault()
    // const {customer}  = this.props
    // const name = this.refs['customer-name'].value
    // const address = this.refs['customer-address'].value
    // this.props.dispatchSubmit(customer.get('_id'), {
    //   name,
    //   address,
    // })
  },
  render: function () {
    const {quotation} = this.props
    const postRoute   = quotation ? `/quotation/${quotation.get('_id')}` : `/quotation`
    const btnMessage  = quotation ? `update` : `create`
    return (
      <form method="post" action={postRoute} onSubmit={this.handleSubmit}>
        <h1>New Quotation</h1>
        <label htmlFor="name">name</label>
        <br/>
        <input id="name" ref="quotation-name" name="name" defaultValue={quotation ? quotation.get('name') : ''}/>
        <br/>
        <button type="submit">{btnMessage}</button>
      </form>
    )
  },
})

//////
// CONTAINERS
//////

const mapStateToProps = (state, ownProps) => {
  const {quotationId} = ownProps.params
  if (!quotationId) return {}
  return {
    quotation: state.getIn(['entities', 'quotations', quotationId])
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    // dispatchSubmit: (id, data) => dispatch(quotationsActions.update(id, data))
  }
}

const Customer = connect(mapStateToProps, mapDispatchToProps)(QuotationForm)

export default Customer
