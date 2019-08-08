// eslint-disable-next-line import/no-extraneous-dependencies
const HtmlWebpackPlugin = require('html-webpack-plugin');
// eslint-disable-next-line import/no-extraneous-dependencies
const glob = require('glob');

module.exports = pattern => glob.sync(pattern, {}).map(
  filePath => new HtmlWebpackPlugin({
    filename: filePath.split('/').slice(2).join('/'),
    template: `${__dirname}/${filePath}`,
    chunks: [filePath.split('/').slice(2).join('/').split('.')[0]],
  }),
);
