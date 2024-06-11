module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    mocha: true
  },
  extends: [
    "standard",
    "eslint:recommended"
  ],
  ignorePatterns: [
    "node_modules/",
    "dist/"
  ],
  overrides: [
    {
      env: {
        node: true
      },
      files: [
        ".eslintrc.{js,cjs}"
      ],
      parserOptions: {
        sourceType: "script"
      }
    },
    {
      files: ["src/index.js"],
      rules: {
        "no-restricted-exports": ["error", { restrictDefaultExports: { direct: true } }]
      }
    }
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module"
  },
  rules: {
    semi: ["error", "always"],
    quotes: ["error", "double"]
  }
};
