// reducers handles actions
// create a new state based on action + previous state
export default function appReducers(state = {}, action) {
  switch(action.type) {
    // handle by https://github.com/svrcekmichal/redux-axios-middleware
    // case 'GET_CUSTOMERS':
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
