// actions are like events

export function list() {
  return {
    type:    'GET_CUSTOMERS',
    payload: {
      request:{
        url:'/customers'
      }
    }
  }
}

export function add(data) {
  console.log('action new customer')
  console.log(data)
  return {
    type:       'NEW_CUSTOMER',
    payload: {
      request: {
        method: 'post',
        url:    '/customer',
        data,
      }
    }
  }
}
