// actions are like events

export function list() {
  return {
    type:    'GET_CUSTOMERS',
    // promise: request.get(API_URL)
  }
}
