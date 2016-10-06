import { combineReducers } from 'redux'
// import getOps from 'immutable-ops'

// import quotationsReducers from './quotations-reducers'
// import customersReducers from './customers-reducers'

// reducers handles actions
// create a new state based on action + previous state
// state should be immutable
// We use here `immutable.js` methods to prevent changing accidentally state

// for each action with a payload.request property…
// …redux-axios-middleware will generate 2 others actions at the end of the axios request
// exemple: for GET_CUSTOMERS action redux-axios-middleware will generate:
//  - GET_CUSTOMERS_SUCCESS
//  - GET_CUSTOMERS_FAIL

// export default combineReducers({
//   quotationsReducers,
//   customersReducers,
// })

export default function appReducers(state = {}, action) {
  let data = action.payload ? action.payload.data : null
  let tmp
  switch(action.type) {

    //////
    // QUOTATIONS
    //////

    case 'LIST_QUOTATIONS_SUCCESS':
      return state.merge(action.payload.data, {deep: true})
    case 'GET_QUOTATION_SUCCESS':
      tmp   = state.getIn(['result', 'quotations']).indexOf(data.result.quotations[0])
      // Don't add twice the same quotation
      if (tmp !== -1) return state
      return state.mergeDeep(action.payload.data)

    //////
    // CUSTOMERS
    //////

    case 'LIST_CUSTOMERS_SUCCESS':
      return state.merge(action.payload.data)
    case 'GET_CUSTOMER_SUCCESS':
      tmp   = state.getIn(['result', 'customers']).indexOf(data.result.customers[0])
      // Don't add twice the same customer
      if (tmp !== -1) return state
      return state.merge(action.payload.data)
    case 'NEW_CUSTOMER_SUCCESS':
      state = state.result.customers.push(data.result.customers[0])
      state = state.mergeIn(['entities', 'customers'], data.entities.customers)
      return state
    case 'REMOVE_CUSTOMER_SUCCESS':
      tmp   = state.result.customers.indexOf(data.result.customers[0])
      state = state.deleteIn(['result', 'customers', tmp])
      state = state.deleteIn(['entities', 'customers', data.result.customers[0]] )
      return state

    //////
    // DEFAULT
    //////

    default:
      return state
  }
}
