const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './index.js',
  target: 'node',
  mode: 'production',
  plugins: [
    new webpack.IgnorePlugin(/^pg-native$/)
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js'
  }
};
