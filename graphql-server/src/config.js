import assert from 'assert'

assert(process.env.NODE_ENV)
export const isProduction = process.env.NODE_ENV === 'production'
