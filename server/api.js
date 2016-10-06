import express from 'express'
import util from 'util'
import createError from 'http-errors'
import { normalize, Schema, arrayOf, valuesOf } from 'normalizr'

import { Customers, Quotations } from './models'

const api = express()
export default api

api
.route('/')
.get((req, res, next) => {
  res.json({
    name:   'dumb-account API',
    version: '1.0.0',
  })
})

//----- NORMALIZR

// we use normalizr to have a coherent api
// this will also benefit to redux and immutable datas
// normalizr will unest object and build indexes. Format look like this:
// {
//   result: {
//     A: [/* array of A ids */],
//     B: [/* array of B ids */],
//   }
//   entities: {
//     A: { /* A ids: values */ },
//     B: { /* B ids: values */ },
//   },
// }
// see more on https://www.npmjs.com/package/normalizr#the-problem

// TODO move this in model?
const customers  = new Schema('customers', { idAttribute: '_id', })
const quotations = new Schema('quotations', { idAttribute: '_id', })

function normalizeDatas(datas) {
  datas = normalize(datas, {
    quotations: valuesOf(quotations),
    customers: valuesOf(customers),
  })
  return datas
}

function sendFormatedResponse(res, datas) {
  res.json(normalizeDatas(datas))
}

//////
// QUOTATIONS
//////

api
.route('/quotations')
.get((req, res, next) => {
  Quotations
  .find({})
  // Mongoose return mongoose objects
  // Normalize expect plain objects
  // Lean prevent Mongoose from creating mongoose objects
  // http://stackoverflow.com/a/18070111/2193440
  .lean()
  .exec()
  .then( quotations => sendFormatedResponse(res, { quotations, }) )
  .catch(next)
})

api
.route('/quotation/:quotationId?')
.post((req, res, next) => {
  console.log('API')
  console.log(req.body)
  const quotationId  = req.params.quotationId
  const dbRequest   = quotationId ?
    Quotations.findByIdAndUpdate(quotationId, req.body, {runValidators: true})
    : Quotations.create(req.body)

  dbRequest
  .then( quotation => {
    // toObject() is the same thing as for lean: going to mongooseObj to plain Obj
    sendFormatedResponse(res, { quotations: [quotation.toObject()]  })
  })
  .catch(next)
})

api
.route('/quotation/:quotationId')
.get((req, res, next) => {
  Quotations
  .findById(req.params.quotationId)
  .lean()
  .then( quotation => {
    sendFormatedResponse(res, { quotations: [quotation]  })
  })
  .catch(next)
})
.delete((req, res, next) => {
  Quotations
  .findByIdAndRemove(req.params.quotationId)
  .lean()
  .then( quotation => {
    sendFormatedResponse(res, { quotations: [quotation]  })
  })
  .catch(next)
})

//////
// CUSTOMERS
//////

api
.route('/customers')
.get((req, res, next) => {
  Customers
  .find({})
  .lean()
  .exec()
  .then( customers => sendFormatedResponse(res, { customers, }) )
  .catch(next)
})

api
.route('/customer/:customerId?')
.post((req, res, next) => {
  const customerId  = req.params.customerId
  const dbRequest   = customerId ?
    Customers.findByIdAndUpdate(customerId, req.body, {runValidators: true})
    : Customers.create(req.body)

  dbRequest
  .then( customer => {
    sendFormatedResponse(res, { customers: [customer.toObject()]  })
  })
  .catch(next)
})

api
.route('/customer/:customerId')
.get((req, res, next) => {
  Customers
  .findById(req.params.customerId)
  .lean()
  .then( customer => {
    sendFormatedResponse(res, { customers: [customer]  })
  })
  .catch(next)
})
.delete((req, res, next) => {
  Customers
  .findByIdAndRemove(req.params.customerId)
  .lean()
  .then( customer => {
    sendFormatedResponse(res, { customers: [customer]  })
  })
  .catch(next)
})

//////
// ERROR HANDLING
//////

// everyhting that go there without an error should be treated as a 404
api.use( (req, res, next) =>  next(createError(404)) )

api.use( (err, req, res, next) => {
  const status = err.status || err.statusCode || (err.status = 500)
  console.log('error handling', status)
  if (status >= 500) {
    console.log(util.inspect(err, {showHidden: true}))
  }
  // force status for morgan to catch up
  res.status(status)
  // different formating
  res.json(err)
})
