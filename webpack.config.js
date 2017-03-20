const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: [
    path.join(__dirname, '/src/index.js'),
  ],
  devtool: 'source-map',
  output: {
    path: path.join(__dirname, 'build'),
    publicPath: '/build',
    filename: 'bundle.js',
  },
  module: {
    loaders: [{
      exclude: /node_modules/,
      loader: 'babel-loader',
      test: /\.jsx?$/,
      query: {
        presets: ['react', 'es2017', 'stage-0'],
      },
    }],
  },
  plugins: [
     new webpack.optimize.UglifyJsPlugin({
       minimize: true,
       compress: {
         warnings: false
       }
     })
  ]
};
