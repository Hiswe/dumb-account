export function list() {
  return {
    type:    'LIST_QUOTATIONS',
    payload: {
      request:{
        url: '/quotations',
      },
    },
  }
}

export function show(params) {
  // No request if we initialize an empty form
  if (!params.quotationId) return { type: 'NONE', }
  return {
    type: 'GET_QUOTATION',
    payload: {
      request:{
        url: `/quotation/${params.quotationId}`,
      },
    },
  }
}


export function add(data) {
  return {
    type:       'NEW_QUOTATION',
    payload: {
      request: {
        method: 'post',
        url:    '/quotation',
        data,
      },
    },
  }
}

export function remove(id) {
  return {
    type:       'REMOVE_QUOTATION',
    payload: {
      request: {
        method: 'delete',
        url:    `/quotation/${id}`,
      },
    },
  }
}

export function update(data) {
  return {
    type:       'UPDATE_QUOTATION',
    payload: {
      request: {
        method: 'post',
        url:    `/quotation/${data._id}`,
        data,
      },
    },
  }
}
