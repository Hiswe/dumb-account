// reducers handles actions
// create a new state based on action + previous state
export default function appReducers(state = {}, action) {
  switch(action.type) {
    // for each action with a payload.request property…
    // …redux-axios-middleware will generate 2 others actions at the end of the axios request
    // exemple: for GET_CUSTOMERS action redux-axios-middleware will generate:
    //  - GET_CUSTOMERS_SUCCESS
    //  - GET_CUSTOMERS_FAIL
    case 'GET_CUSTOMERS_SUCCESS':
      return Object.assign({}, state, action.payload.data)
    case 'NEW_CUSTOMER_SUCCESS':
      return Object.assign(
        {},
        state,
        {customers: state.customers.concat([action.payload.data])},)
      return state
    default:
      return state
  }
}
