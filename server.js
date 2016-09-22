const express = require('express');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackConfig = require('./webpack.config');
const app = express();
const port = process.env.PORT || 8080;

app.set('port', port);

app.use(webpackMiddleware(compiler, {
  stats: {
    colors: true,
    reasons: true,
  },
  
  publicPath: webpackConfig.output.publicPath,
}));
app.use(express.static(__dirname + '/'));

app.get('/', function(req, res){
  console.log('Serving /');
  res.sendFile(__dirname + '/client/index.html');
});

const server = app.listen(port);
console.log('Listening on port ', port);

