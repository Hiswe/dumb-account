// reducers handles actions
// create a new state based on action + previous state
export default function appReducers(state = {}, action) {
  let data = action.payload ? action.payload.data : null
  switch(action.type) {
    // for each action with a payload.request property…
    // …redux-axios-middleware will generate 2 others actions at the end of the axios request
    // exemple: for GET_CUSTOMERS action redux-axios-middleware will generate:
    //  - GET_CUSTOMERS_SUCCESS
    //  - GET_CUSTOMERS_FAIL
    case 'GET_CUSTOMERS_SUCCESS':
      return state.mergeDeep(action.payload.data)
    case 'NEW_CUSTOMER_SUCCESS':
      state = state.updateIn(['result', 'customers'], list => {
        return list.push(data.result.customers[0])
      })
      state = state.mergeDeepIn(['entities', 'customers'], data.entities.customers)
      return state
    default:
      return state
  }
}
