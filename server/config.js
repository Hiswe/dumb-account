'use strict'

import rc from 'rc'

const config    = rc('dumb-account', {})

config.NODE_ENV = config.NODE_ENV || process.env.NODE_ENV || 'development'
config.PORT     = process.env.PORT || 3000

config.isDev    = config.NODE_ENV === 'development'
config.isProd   = config.NODE_ENV === 'production'

export { config as default }
