module.exports = {
  '{.nvmrc,Dockerfile}': 'bash .husky/scripts/check-node-version.sh',
  '*.{css,vue}': 'stylelint',
  '*.{json,ts,vue}': 'eslint',
  '*.{ts,vue}': () => ['npm run check-types', 'npm run test:once'],
};
