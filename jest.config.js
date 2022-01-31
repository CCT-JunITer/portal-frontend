module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  setupFiles: ['./tests/setup.ts'],
  transformIgnorePatterns: ['/node_modules/(?!vuetify)'],
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': '<rootDir>/tests/__mocks__/styleMock.js',
  }
}
