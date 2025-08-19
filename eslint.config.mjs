import hmppsConfig from '@ministryofjustice/eslint-config-hmpps'

export default [
  ...hmppsConfig({
    extraIgnorePaths: ['assets'],
  }),
  {
    rules: {
      'dot-notation': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'import/prefer-default-export': 0,
    },
  },
]
