import express from 'express'

import { Customers } from './models'

const api = express()
export default api

api
.route('/')
.get((req, res, next) => {
  res.json({
    name: 'dumb-account API',
    version: '1.0.0'
  })
})

//----- HOME PAGES


//----- CUSTOMER

api
.route('/customers')
.get((req, res, next) => {
  Customers
  .find({})
  .then( customers => res.json({ customers, }) )
  .catch(next)
})

api
.route('/customer/:customerId?')
.post((req, res, next) => {
  const customerId  = req.params.customerId
  const dbRequest   = customerId ?
    Customers.findByIdAndUpdate(customerId, req.body, {runValidators: true})
    : new Customers(req.body).save()

  dbRequest
  .then( user => res.json(user) )
  .catch(next)
})
