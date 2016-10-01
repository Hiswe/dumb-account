import mongoose from 'mongoose'
import autoIncrement from 'mongoose-auto-increment'

import config from './config'

// Use native promises
mongoose.Promise  = global.Promise
const Schema      = mongoose.Schema
const ObjectId    = Schema.Types.ObjectId
const connection  = mongoose.connect(config.database)
const db          = mongoose.connection
// Add auto increment
// https://www.npmjs.com/package/mongoose-auto-increment#getting-started
autoIncrement.initialize(connection)

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  console.log('DB connection OK')
})

//////
// CUSTOMERS
//////

const CustomerModel   = 'Customer'
const CustomerSchema  = Schema({
  name: {
    type:     String,
    unique:   true,
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

