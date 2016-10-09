export default function customersReducers(state, action) {

  let data = action.payload ? action.payload.data : null
  let tmp

  switch(action.type) {

    case 'LIST_CUSTOMERS_SUCCESS':
      return state.mergeDeep(action.payload.data)

    case 'GET_CUSTOMER_SUCCESS':
      tmp   = state.getIn(['result', 'customers']).indexOf(data.result.customers[0])
      // Don't add twice the same customer
      if (tmp !== -1) return state
      return state.merge(action.payload.data)

    case 'NEW_CUSTOMER_SUCCESS':
      state = state.updateIn(['result', 'customers'], list => {
        return list.push(data.result.customers[0])
      })
      state = state.mergeDeepIn(['entities', 'customers'], data.entities.customers)
      return state

    case 'REMOVE_CUSTOMER_SUCCESS':
      tmp   = state.getIn(['result', 'customers']).indexOf(data.result.customers[0])
      state = state.deleteIn(['result', 'customers', tmp])
      state = state.deleteIn(['entities', 'customers', data.result.customers[0]] )
      return state

    default:
      return state
  }
}
