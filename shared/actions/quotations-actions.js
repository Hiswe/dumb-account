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
