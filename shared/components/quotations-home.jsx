import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { connect }  from 'react-redux'

import * as quotationsActions from '../actions/quotations-actions'

const QuotationsList = (props) => {
  return (
    <div>
      <h1>Quotations</h1>
      <Link to="/quotation">new quotation</Link>
      <QuotationList {...props}/>
    </div>
  )
}

const QuotationList = (props) => {
  const {quotationsId, quotations} = props
  let body = quotationsId.map( (quotationId, i) => (
    <CustomerRow
      key={quotationId}
      quotation={quotations.get(quotationId)}
    />
  ))
  return (
    <ul>
      {body}
    </ul>
  )
}

const CustomerRow = ({quotation}) =>  {
  let getRoute = `/quotation/${quotation.get('_id')}`
  return (
    <li>
      <Link to={getRoute}>{quotation.get('name')}</Link>
    </li>
  )
}

//////
// CONTAINERS
//////

const mapStateToProps = (state, ownProps) => {
  return {
    quotationsId:  state.getIn(['result', 'quotations']),
    quotations:    state.getIn(['entities', 'quotations']),
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {}
}

const Quotations = connect(mapStateToProps, mapDispatchToProps)(QuotationsList)
Quotations.actionsNeeded = [
  quotationsActions.list,
]

export default Quotations
