// @ts-check
/* eslint-disable @typescript-eslint/no-var-requires, import/no-extraneous-dependencies */
const webpack = require('webpack');
const path = require('path');
const _ = require('lodash');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const isDevelopment = process.env.NODE_ENV !== 'production';
/** @type {import('webpack').Configuration} */
const config = {
  entry: {
    main: './src/index.jsx',
  },

  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      ..._.fromPairs(_.map([
        'react',
        'react-dom',
      ], (pkg) => [pkg, path.resolve(`node_modules/${pkg}`)])),
      '@relyzer/client': '@relyzer/client/lib',
    },
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: require.resolve('babel-loader'),
            options: {
              presets: [
                '@babel/preset-react',
              ],
              plugins: [
                isDevelopment && require.resolve('@relyzer/babel'),
                isDevelopment && require.resolve('react-refresh/babel'),
              ].filter(Boolean),
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
        ],
      },
      {
        test: /\.ttf$/,
        type: 'asset/resource',
      },
    ],
  },

  plugins: [
    isDevelopment && new ReactRefreshWebpackPlugin(),
    new webpack.DefinePlugin({
      'window.__RELYZER_DEV__': process.env.__RELYZER_DEV__,
    }),
  ].filter(Boolean),
};

module.exports = config;
