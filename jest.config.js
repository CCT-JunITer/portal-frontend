module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  setupFiles: ['./tests/setup.ts'],
  transformIgnorePatterns: ['/node_modules/(?!vuetify)'],

}
