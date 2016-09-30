// use babel for ES2015 import & JSX
require('babel-core/register')({
  presets: ['react'],
  // As we use node 6, no need to have the full ES2015 preset for the back
  plugins: ['transform-es2015-modules-commonjs'],
  // ignoring only node_modules is done by default
  // ignore: (filename) => /node_module/.test(filename),
})

// enable node concurrency
// https://devcenter.heroku.com/articles/node-concurrency
const throng  = require('throng')
const WORKERS = process.env.WEB_CONCURRENCY || 1
const start   = require('./server/app').default

throng({
  start:    start,
  workers:  WORKERS,
  lifetime: Infinity,
})
