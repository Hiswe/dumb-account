import express from 'express'

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

let customers = [{name: 'pouic'}, {name: 'clapou'}]

api
.route('/customers')
.get((req, res, next) => {
  res.json({
    customers,
  })
})

api
.route('/customer')
.post((req, res, next) => {
  customers.push(req.body)
  res.json(req.body)
})
