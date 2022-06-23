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
    'indent': ['error', 2],
    'vue/no-v-text-v-html-on-component': 'warn',
    'vue/script-indent': ['error', 2, {'baseIndent': 0}],
    'vue/html-indent': ['error', 2, {'baseIndent': 1}],
    'vue/valid-v-slot': 'off',
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/no-empty-interface': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
    'no-unused-vars': 'off',
    'prefer-rest-params': 'warn',
    'getter-return': 'warn',
    '@typescript-eslint/no-use-before-define': 'warn',
    'vuetify/no-deprecated-classes': 'error'
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        jest: true
      }
    },
    {
      'files': ['*.vue'],
      'rules': {
        'indent': 'off'
      }
    }
  ]
}
