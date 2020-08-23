module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'prettier',
    'prettier/vue',
    'plugin:prettier/recommended',
    'plugin:wdio/recommended',
    'plugin:nuxt/recommended',
    'plugin:jest/recommended',
  ],
  plugins: ['prettier', 'wdio', 'jest'],
  // add your custom rules here
  rules: {},
}
