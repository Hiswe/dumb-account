import Immutable from 'immutable'

export default function appReducers(state = Immutable.Map(), action) {

  let data = action.payload ? action.payload.data : null
  let tmp

  switch(action.type) {

    case 'LIST_QUOTATIONS_SUCCESS':
      return state.mergeDeep(action.payload.data)

    case 'GET_QUOTATION_SUCCESS':
      tmp   = state.getIn(['result', 'quotations']).indexOf(data.result.quotations[0])
      // Don't add twice the same quotation
      if (tmp !== -1) return state
      return state.mergeDeep(action.payload.data)

    default:
      return state
  }
}
