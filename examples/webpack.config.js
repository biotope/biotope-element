const entry = require('webpack-glob-entry');
const path = require('path');
const getPagePlugins = require('./webpack-page-definition');

const entryPoints = entry(filePath => filePath.split('/').slice(2).join('/').split('.')[0], './src/**/index.js', './src/**/index.ts');

module.exports = {
  mode: 'development',
  entry: entryPoints,
  context: path.resolve(__dirname),
  devServer: {
    port: 8080,
  },
  output: {
    path: `${__dirname}/dist`,
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.ts', '.js', '.scss', '.css'],
  },
  module: {
    rules: [
      {
        test: /\.(j|t)s$/,
        loader: 'babel-loader',
        options: {
          presets: [
            '@babel/preset-env',
            ['@babel/preset-typescript', { allExtensions: true }],
          ],
          plugins: [
            ['@babel/plugin-proposal-class-properties', { loose: true }],
            ['@babel/plugin-transform-classes', { loose: true }],
          ],
        },
      },
      {
        test: /\.s?css$/,
        use: [
          {
            loader: 'css-loader',
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
      {
        test: /\.html$/,
        use: 'raw-loader',
      },
    ],
  },
  plugins: [
    ...getPagePlugins('./src/**/index.html'),
  ],
};
