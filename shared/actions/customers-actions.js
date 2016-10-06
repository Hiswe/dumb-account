// actions are like events

export function list() {
  return {
    type:    'LIST_CUSTOMERS',
    payload: {
      request:{
        url: '/customers',
      },
    },
  }
}

// url params are passed to fetchComponentData on the front & backend
export function show(params) {
  if (!params.customerId) return { type: 'NONE', }
  return {
    type: 'GET_CUSTOMER',
    payload: {
      request:{
        url: `/customer/${params.customerId}`,
      },
    },
  }
}

export function add(data) {
  return {
    type:       'NEW_CUSTOMER',
    payload: {
      request: {
        method: 'post',
        url:    '/customer',
        data,
      },
    },
  }
}

export function remove(id) {
  return {
    type:       'REMOVE_CUSTOMER',
    payload: {
      request: {
        method: 'delete',
        url:    `/customer/${id}`,
      },
    },
  }
}


export function update(id, data) {
  return {
    type:       'UPDATE_CUSTOMER',
    payload: {
      request: {
        method: 'post',
        url:    `/customer/${id}`,
        data,
      },
    },
  }
}
