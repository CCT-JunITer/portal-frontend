const { pathsToModuleNameMapper } = require('ts-jest')

const { compilerOptions } = require('./tsconfig')

module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  setupFiles: ['./tests/setup.ts'],
  transformIgnorePatterns: [
    '/node_modules/(?!vuetify)',
  ],
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': '<rootDir>/tests/__mocks__/styleMock.js',
    ...pathsToModuleNameMapper(compilerOptions.paths , { prefix: '<rootDir>/' }),
  },
  testMatch: [
    '<rootDir>/(tests/unit/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx)|modules/**/tests/*.(js|jsx|ts|tsx))'
  ]
}
