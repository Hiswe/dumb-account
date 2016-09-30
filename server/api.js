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

api
.route('/customers')
.get((req, res, next) => {
  res.json({
    customers: ['pouic', 'clapou'],
  })
})
