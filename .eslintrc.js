module.exports = {
  ...require('@ackee/styleguide-backend-config/eslint'),
  ignorePatterns: [
    'dist',
    'src/openapi-gen',
    'docs',
    'src/declarations.ts',
    'docs/api/generated',
    'src/openapi-gen/api-openapi.ts',
  ],
  parserOptions: {
    project: '.eslint.tsconfig.json',
  },
}
