module.exports = {
  root: true,
  extends: ['plugin:vue/recommended', '@vue/prettier', '@vue/typescript'],
  plugins: ['@typescript-eslint'],
  env: { node: true, es6: true },
  rules: {
    'vue/v-on-function-call': ['error'],
    'vue/v-slot-style': ['error'],
    'vue/component-name-in-template-casing': [
      'error',
      'kebab-case',
      { registeredComponentsOnly: false },
    ],
  },
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
}
