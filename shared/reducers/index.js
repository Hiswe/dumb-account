import { combineReducers, compose } from 'redux'
import Immutable from 'immutable'
import { reducer as formReducer } from 'redux-form/immutable'

import quotationsReducers from './quotations-reducers'
import customersReducers from './customers-reducers'

// [A] Reducer presentation:

//  reducers handles actions
//    - They create a NEW state based on an action + previous state
//    - state should be immutable
//    - We use here `immutable.js` methods to prevent changing accidentally state

// [B] Reducer handling non defined actions (as in shared/actions):

//  for each action with a payload.request property…
//  …redux-axios-middleware will generate 2 others actions at the end of the axios request
//  exemple: for GET_CUSTOMERS action redux-axios-middleware will generate:
//    - GET_CUSTOMERS_SUCCESS
//    - GET_CUSTOMERS_FAIL
//  This explain why there in reducers there is unspecified actions poping in

// [C] Combining reducers (splitting code):

//  We Use a custome combinedReduction to bundle many reducers at the root level:
//    redux original combineReducers set reducer state the key of option
//    i.e : combineReducers({entities: myReducer}) => myReducer state will be state.entities
//  coming from:
//    https://github.com/jokeyrhyme/wow-healer-bootcamp/blob/master/utils/combineReducers.js
//    https://github.com/reactjs/redux/issues/601#issuecomment-136059031

// [D] Handling temporary form states

//  redux-form will be in charge of maintaining fields datas in the redux-state
//  this allow to not store datas in a react's component state


function combinedReduction(keyedReducers = {}, ...reducers) {
  return (state = Immutable.Map(), action) => {
    let result  = state
    // run reducers that are specific to top-level keys
    result      = Object.keys(keyedReducers).reduce((prev, key) => {
      let reducer = keyedReducers[key]
      return prev.set(key, reducer(prev.get(key), action))
    }, result)
    // run reducers that access the complete state
    result      = reducers.reduce((prev, reducer) => {
      return reducer(prev, action)
    }, result)
    return result
  }
}

export default combinedReduction(
  {
    form: formReducer,
  },
  customersReducers,
  quotationsReducers,
)
