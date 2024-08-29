const config = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recess-order',
    'stylelint-config-recommended-vue',
  ],
  rules: {
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['mixin', 'mixin-content', 'define-mixin', 'composes'],
      },
    ],
    'selector-class-pattern': [
      /^[a-z][a-zA-Z0-9]+$/,
      {
        message: 'Expected class to be camelCase',
      },
    ],
    'selector-max-id': 0,
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global'],
      },
    ],
  },
};

export default config;
