const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const webpack = require('webpack');
const index = require('./routes/index');
const users = require('./routes/users');
const app = express();
const config = require('./webpack/config.dev.js');
const webpackDev = require('webpack-dev-middleware');
const webpackHot = require('webpack-hot-middleware');
const compiler = webpack(config);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(webpackDev(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));
app.use(webpackHot(compiler));
app.get('*', function(req, res) {
  res.sendFile(path.join(process.cwd(), 'components/index.html'));
});
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});
module.exports = app;
