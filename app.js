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
const NODE_ENV = process.env.NODE_ENV;
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

app.use("/build", express.static(path.join(__dirname, '/build')));
app.use("/uploads", express.static(path.join(__dirname, '/uploads')));

if (NODE_ENV !== "production") {
  app.use(webpackDev(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath,
  }));
  app.use(webpackHot(compiler));
}

if (NODE_ENV === "production") {
  app.get('*', function(req, res) {
    res.sendFile(path.join(process.cwd(), 'build'));
  });
  app.get('/', function(req, res) {
    res.sendFile(path.join(process.cwd(), 'components/index.html'));
  });
} else {
  app.get('*', function(req, res) {
    res.sendFile(path.join(process.cwd(), 'components/index.html'));
  });
}

app.post("/upload", upload.single('file'), function(req, res) {
  co(function * () {
    let {file: {mimetype, fileName}} = req;
    if (mimetype === "application/pdf") {
      fileName = yield pdfToImage(fileName);
    }
    return fileName;
  }).then((fileName) => {
    res.send({fileName});
  }).catch(e => {
    console.log(e);
    res.send("上传失败");
  });
});

app.post("/compare", function(req, res) {
  const {fileList} = req.body;
  const [fileA, fileB] = fileList;
  co(function * () {
    yield diffImage(fileA, fileB, function(fileName) {
      res.send({fileName});
    });
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

function * diffImage(imageA, imageB, cb) {
  const resImage = `diff${imageA}`;
  var diff = new BlinkDiff({
    imageAPath: `${UPLOAD_DIR}/${imageA}`,
    imageBPath: `${UPLOAD_DIR}/${imageB}`,
    thresholdType: BlinkDiff.THRESHOLD_PERCENT,
    threshold: 0.01,
    imageOutputPath: `${UPLOAD_DIR}/diff${imageA}`,
  });
  diff.run(function(error, result) {
    if (error) {
      throw error;
    } else {
      cb(resImage);
      console.log(diff.hasPassed(result.code) ? 'Passed' : 'Failed');
      console.log('Found ' + result.differences + ' differences.');
    }
  });
}

function * pdfToImage(fileName) {
  var pdfImage = new PDFImage(`${UPLOAD_DIR}/${fileName}`);
  var imagePath = yield pdfImage.convertPage(0);
  imagePath = imagePath.split("/").pop();
  return imagePath;
}
module.exports = app;
