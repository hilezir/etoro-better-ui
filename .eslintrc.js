// Consider running ESLint debug
// npx eslint --debug /Users/pleasurazy/git/life/packages/bot/.eslintrc.js
module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier',
  ],
  env: {
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    // 提升可靠性，但沒有也沒關係。
    '@typescript-eslint/no-explicit-any': 'off',
    // 提升可靠性，但沒有也沒關係。
    '@typescript-eslint/explicit-function-return-type': 'off',
    // 提升可靠性，但沒有也沒關係。
    '@typescript-eslint/require-await': 'off',
    // 適當的 unused-vars 幫助我們快速理解有哪些可用的參數
    '@typescript-eslint/no-unused-vars': 'off',
    // 分號由 prettier 解決
    '@typescript-eslint/member-delimiter-style': 'off',
    // 誤用 return promise 之規則
    '@typescript-eslint/no-misused-promises': [
      'error',
      {
        checksVoidReturn: false,
      },
    ],
    '@typescript-eslint/unbound-method': 'warn',
    // TypeScript Assertion Function 可以不需要 stataments
    '@typescript-eslint/no-empty-function': 'warn',
    // see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-floating-promises.md
    '@typescript-eslint/no-floating-promises': 'off',
    // 這個交由 prettier
    '@typescript-eslint/no-extra-semi': 'off',
    // 我不想每個都寫明 return type 想讓它自行 infer
    '@typescript-eslint/explicit-module-boundary-types': [
      'off',
      { allowDirectConstAssertionInArrowFunctions: true },
    ],
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      parserOptions: {
        project: 'tsconfig.json',
      },
    },
    {
      files: ['**/webpack.config.ts'],
      parserOptions: {
        project: 'tsconfig.webpack.json',
      },
    },
    {
      files: ['**/*.test.js'],
      env: {
        jest: true,
      },
    },
    {
      files: ['src/**/*.js'],
      parser: 'babel-eslint',
    },
  ],
}
