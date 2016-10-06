import mongoose from 'mongoose'
import autoIncrement from 'mongoose-auto-increment'

import config from './config'

// Use native promises
mongoose.Promise    = global.Promise
const Schema        = mongoose.Schema
const { ObjectId }  = Schema.Types
const connection    = mongoose.connect(config.database)
const db            = mongoose.connection
// Add auto increment
// https://www.npmjs.com/package/mongoose-auto-increment#getting-started
autoIncrement.initialize(connection)

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () =>  console.log('DB connection OK') )

const CustomerModel   = 'Customer'
const QuotationModel  = 'Quotation'

//////
// QUOTATIONS
//////

const ProductSchema  = Schema({
  name: {
    type:     String,
  },
  quantity: {
    type:     Number,
    default:  0,
  },
  price: {
    type:     Number,
    default:  350,
  },
})

const QuotationSchema = Schema({
  name: {
    type:     String,
    required: [true, 'Quotation name is required'],
  },
  _customer: {
    type:       ObjectId,
    ref:        CustomerModel,
  },
  tax: {
    type:     Number,
    default:  0,
  },
  products: {
    type:     [ProductSchema],
    default:  [],
  },
  send: {
    type:     Date,
  },
  validated: {
    type:     Date,
  },
  done: {
    type:     Date,
  },
}, { timestamps: true })

QuotationSchema.plugin(autoIncrement.plugin, { model: QuotationModel, field: 'count' })

//////
// INVOICES
//////

//////
// CUSTOMERS
//////

const CustomerSchema  = Schema({
  name: {
    type:     String,
    required: [true, 'Customer name is required'],
  },
  address: {
    type:     String,
  }
}, { timestamps: true })

CustomerSchema.plugin(autoIncrement.plugin, { model: CustomerModel, field: 'count' })

//////
// COMPILE SCHEMAS
//////

export const Customers  = mongoose.model(CustomerModel, CustomerSchema)
export const Quotations = mongoose.model(QuotationModel, QuotationSchema)
