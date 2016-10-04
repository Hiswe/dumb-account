import express from 'express'
import util from 'util'
import { normalize, Schema, arrayOf, valuesOf } from 'normalizr'

import { Customers } from './models'

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
//   entities: {
//     A: [/* array of A ids */],
//     B: [/* array of B ids */],
//   },
//   result: {
//     A: { /* ids: values */ },
//     B: { /* ids: values */ },
//   }
// }
// see more on https://www.npmjs.com/package/normalizr#the-problem

const customers  = new Schema('customers', { idAttribute: '_id', })

function normalizeDatas(datas) {
  datas = normalize(datas, {
    customers: valuesOf(customers),
  })
  return datas
}

function sendFormatedResponse(res, datas) {
  res.json(normalizeDatas(datas))
}

//////
// CUSTOMERS
//////

api
.route('/customers')
.get((req, res, next) => {
  Customers
  .find({})
  // Mongoose return mongoose objects
  // Normalize expect plain objects
  // Lean prevent Mongoose from creating mongoose objects
  // http://stackoverflow.com/a/18070111/2193440
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
    // toObject() is the same thing as for lean: going to mongooseObj to plain Obj
    sendFormatedResponse(res, { customers: [customer.toObject()]  })
    sendFormatedResponse(res, { customers: [customer]  })
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
