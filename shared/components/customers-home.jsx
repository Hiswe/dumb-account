import React from 'react'

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
        <h1>Customers larve</h1>
      </div>
    )
  }
})

export { Customers as default }
