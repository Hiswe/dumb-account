// actions are like events

export function list() {
  return {
    type:    'GET_CUSTOMERS',
    payload: {
      request:{
        url:'/customers'
      }
    }
    // promise: request.get(API_URL)
  }
}
