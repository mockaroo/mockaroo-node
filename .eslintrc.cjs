module.exports = {
  env: {
    browser: true,
    es2021: true,
    mocha: true
  },
  extends: 'standard',
  overrides: [
    {
      env: {
        node: true
      },
      files: [
        '.eslintrc.{js,cjs}'
      ],
      parserOptions: {
        sourceType: 'script'
      }
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    "semi": ["error", "always"],
    "quotes": ["error", "double"],
  }
}
