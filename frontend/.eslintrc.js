const path = require("path");

module.exports = {
  extends: ["vacuumlabs", "plugin:flowtype/recommended"],
  env: {
    es6: true,
    node: true,
    browser: true,
    jest: true
  },
  rules: {
    semi: [2, "never"],
    "no-unexpected-multiline": 2,
    "no-duplicate-imports": 0,
    "import/no-duplicates": "error"
  },
  settings: {
    "import/resolver": {
      alias: {
        map: [["@", path.resolve(__dirname, "./src")]],
        extensions: [".ts", ".js", ".jsx", ".json"]
      }
    }
  }
};
