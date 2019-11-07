module.exports = {
  root: true,
  extends: ['plugin:vue/essential', '@vue/prettier', '@vue/typescript'],
  plugins: ['@typescript-eslint'],
  env: { node: true, es6: true },
  rules: {
    'prettier/prettier': [
      2,
      {
        printWidth: 80,
        singleQuote: true,
        semi: false,
        trailingComma: 'es5',
        endOfLine: 'lf',
      },
    ],
  },
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
}
