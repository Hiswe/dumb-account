// reducers handles actions
// create a new state based on action + previous state
export default function appReducers(state = {}, action) {
  switch(action.type) {
    // some actions come from redux-axios-middleware middleware
    // for each action like GET_CUSTOMERS…
    // …it will generate 2 others at the end of the axios request:
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
