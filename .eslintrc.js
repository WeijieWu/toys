module.exports = {
    "extends": "google",
    "installedESLint": true,
    "parser": "babel-eslint",
    "standard": {
      "parser": "babel-eslint"
    },
    "plugins": [
      "react"
    ],
    "settings": {
      "react": {
        "createClass": "createClass", // Regex for Component Factory to use, default to "createClass"
        "pragma": "React",  // Pragma to use, default to "React"
        "version": "15.0" // React version, default to the latest React stable release
      }
    },
    "parserOptions": {
      "ecmaFeatures": {
        "jsx": true
      }
    },
    "rules": {
      "react/jsx-uses-react": "error",
      "react/jsx-uses-vars": "error",
      "arrow-parens": 0,
      "valid-jsdoc": 0,
      "comma-dangle": ["error", "always"],
      "comma-dangle": ["error", "always-multiline"],
      "require-jsdoc": 0,
      "max-len": 0,
      "camelcase": 0,
      "new-cap": 0,
      "generator-star": 0,
      "generator-star-spacing": 0
    },
    "globals": {
      "window": true,
      "document": true,
      "location": true,
      "void": true,
      "process": true,
      "moment": true,
      "Immutable": true,
      "fetch": true
    }
};