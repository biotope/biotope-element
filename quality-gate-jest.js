const config = require('@biotope/quality-gate');
 
module.exports = {
  logic: {
    ...config.logic,
    plugins: ['jest'],
    env: {
      ...config.logic.env,
      'jest/globals': true,
    },
  },
  style: {
    ...config.style,
  },
};
