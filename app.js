const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const webpack = require('webpack');
const app = express();
const config = require('./webpack/config.dev.js');
const webpackDev = require('webpack-dev-middleware');
const webpackHot = require('webpack-hot-middleware');
const compiler = webpack(config);
const multer = require('multer');
const BlinkDiff = require('blink-diff');
const BASE_DIR = __dirname;
const PENDING_IMAGES = `${BASE_DIR}/pendingImages`;
const UPLOAD_DIR = `${BASE_DIR}/uploads`;
const co = require("co");
var PDFImage = require("pdf-image").PDFImage;
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function(req, file, cb) {
    file.fileName = Date.now() + file.originalname;
    cb(null, file.fileName);
  },
});
const upload = multer({storage});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(webpackDev(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath,
}));
app.use(webpackHot(compiler));
app.get('*', function(req, res) {
  res.sendFile(path.join(process.cwd(), 'components/index.html'));
});
app.post("/upload", upload.single('file'), function(req, res) {
  co(function * () {
    const {file = {}, file: {mimetype, fileName, originalname}} = req;
    console.log(file);
    if (mimetype === "application/pdf") {
      yield pdfToImage(fileName);
    }
  }).then(() => {
    res.send("ok");
  }).catch(e => {
    console.log(e);
    res.send("上传失败");
  });
});
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});
app.use(function(err, req, res) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

function * diffImage(imageA, imageB) {
  var diff = new BlinkDiff({
    imageAPath: `${PENDING_IMAGES}/${imageA}`,
    imageBPath: `${PENDING_IMAGES}/${imageB}`,
    thresholdType: BlinkDiff.THRESHOLD_PERCENT,
    threshold: 0.01,
    imageOutputPath: PENDING_IMAGES,
  });
  diff.run(function(error, result) {
    if (error) {
      throw error;
    } else {
      console.log(diff.hasPassed(result.code) ? 'Passed' : 'Failed');
      console.log('Found ' + result.differences + ' differences.');
    }
  });
}

function * pdfToImage(fileName) {
  var pdfImage = new PDFImage(`${UPLOAD_DIR}/${fileName}`);
  pdfImage.convertPage(0).then(function(imagePath) {
    console.log(imagePath);
  }, function(e) {
    console.log(e);
  });
}
module.exports = app;
