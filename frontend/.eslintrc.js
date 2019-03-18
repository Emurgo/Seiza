const path = require('path')

module.exports = {
  extends: ['vacuumlabs', 'plugin:flowtype/recommended'],
  env: {
    es6: true,
    node: true,
    browser: true,
    jest: true,
  },
  plugins: ['react-hooks'],
  rules: {
    semi: [2, 'never'],
    'no-unexpected-multiline': 2,
    'no-duplicate-imports': 0,
    'import/no-duplicates': 'error',
    'import/named': 'error',
    'import/default': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [['@', path.resolve(__dirname, './src')]],
        extensions: ['.ts', '.js', '.jsx', '.json'],
      },
    },
  },
}
