const path = require('path')
const {override, addBabelPlugin} = require('customize-cra')

const addAbsolutePathImport = (config) => {
  config.resolve = {
    ...config.resolve,
    alias: {'@': path.resolve(__dirname, 'src')},
  }

  return config
}

module.exports = override(addBabelPlugin('react-intl-auto'), addAbsolutePathImport)
