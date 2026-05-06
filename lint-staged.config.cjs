module.exports = {
  '{.nvmrc,Dockerfile}': 'bash .husky/scripts/check-node-version.sh',
  '*.{css,vue}': 'stylelint',
  '*.{json,ts,vue}': 'eslint',
  '*.{ts,vue}': () => ['yarn check-types', 'yarn test:once'],
};
