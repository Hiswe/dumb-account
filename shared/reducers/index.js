// reducers handles actions
// create a new state based on action + previous state

export default function appReducers(state = {}, action) {
  switch(action.type) {
    case 'GET_CUSTOMERS':
      return Object.assign({}, state, {
        customers: [ 'pouic', 'clapou', ]
      })
    default:
      return state
  }
}
