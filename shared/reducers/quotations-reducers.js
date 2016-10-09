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

    case 'NEW_QUOTATION_SUCCESS':
      state = state.updateIn(['result', 'quotations'], list => {
        return list.push(data.result.quotations[0])
      })
      state = state.mergeDeepIn(['entities', 'quotations'], data.entities.quotations)
      return state

    case 'REMOVE_QUOTATION_SUCCESS':
      tmp   = state.getIn(['result', 'quotations']).indexOf(data.result.quotations[0])
      state = state.deleteIn(['result', 'quotations', tmp])
      state = state.deleteIn(['entities', 'quotations', data.result.quotations[0]] )
      return state

    default:
      return state
  }
}
