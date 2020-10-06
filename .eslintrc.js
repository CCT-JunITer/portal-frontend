module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    'eslint:recommended',
    '@vue/typescript/recommended'
  ],
  'plugins': [
    'vuetify'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'quotes': ['error', 'single'],
    '@typescript-eslint/camelcase': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
    'prefer-rest-params': 'warn',
    'getter-return': 'warn',
    '@typescript-eslint/no-use-before-define': 'warn',
    '@typescript-eslint/interface-name-prefix': 'warn',
    'vuetify/no-deprecated-classes': 'error'
  }
}
