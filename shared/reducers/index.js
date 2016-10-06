import { combineReducers, compose } from 'redux'
// import getOps from 'immutable-ops'

// import quotationsReducers from './quotations-reducers'
import customersReducers from './customers-reducers'

// reducers handles actions
// create a new state based on action + previous state
// state should be immutable
// We use here `immutable.js` methods to prevent changing accidentally state

// for each action with a payload.request property…
// …redux-axios-middleware will generate 2 others actions at the end of the axios request
// exemple: for GET_CUSTOMERS action redux-axios-middleware will generate:
//  - GET_CUSTOMERS_SUCCESS
//  - GET_CUSTOMERS_FAIL

// Use compose to bundle many reducers at the root level
// combineReducers set reducer state the key of option
// i.e : combineReducers({entities: myReducer}) => myReducer state will be state.entities
// That doens't work well with `normalizred` data

export default compose(
  customersReducers,
)
