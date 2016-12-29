var webpack = require('webpack');
var path = require('path');
var autoprefixer = require('autoprefixer');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var theme = `"primary-color": "#3eae6d",` +
  `"warning-color": "#e83617",` +
  `"border-color": "#dcdcdc",` +
  `"font-size-base": "14px",` +
  `"text-color": "#333333",` +
  `"border-radius-base": "0",` +
  `"link-color": "#3eae6d"`;

module.exports = {
  devtool: 'eval',
  entry: {
    main: [
      'babel-polyfill',
      path.join(process.cwd(), 'components/client/main.js'),
    ],
    vendor: [
      'antd/lib/table', 'antd/lib/message', 'antd/lib/modal', 'antd/lib/form', 'antd/lib/input',
      'antd/lib/select', 'antd/lib/date-picker', 'antd/lib/col', 'antd/lib/row', 'antd/lib/button',
      'antd/lib/pagination', 'antd/lib/spin',
      path.join(process.cwd(), 'components/util/asyncInjectors'),
    ],
  },
  output: {
    path: path.join(process.cwd(), 'build'),
    publicPath: '/build/',   // 网站运行时访问目录
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].chunk.js',
  },
  module: {
    loaders: [
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'eslint-loader',
        query: {
          configFile: path.join(process.cwd(), '.eslintrc.js'),
        },
        exclude: [/node_modules/],
      },
      {
        test: [/\.js$/, /\.jsx$/],
        exclude: /node_modules/,
        loader: 'babel-loader',
      },

      {
        test: /\.css$/,
        loaders: ExtractTextPlugin.extract({
          fallbackLoader: "style-loader",
          loader: "css-loader",
        }),
      },
      {
        test: /\.less$/,
        loaders: ExtractTextPlugin.extract({
          fallbackLoader: "style-loader",
          loader: ['css-loader', 'postcss-loader', `less-loader?{"modifyVars":{${theme}}}`],
        }),
      },
      {
        test: /\.(jpg|png|gif)$/,
        loaders: [
          'file-loader',
          'image-webpack-loader?{progressive:true, optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}}',
        ],
      },
    ],
  },
  resolve: {
    modules: ['components', 'node_modules'],
    extensions: ['.js', '.jsx', '.less'],
  },

  plugins: [
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn/),
    new webpack.ProvidePlugin({
      moment: 'moment',
      Immutable: 'immutable',
    }),
    new webpack.DefinePlugin({
      'process.env': {
        BASE_PATH_ENTERPRISE: process.env.BASE_PATH_ENTERPRISE ? `"${process.env.BASE_PATH_ENTERPRISE}"` : null,
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
      filename: "vendor.bundle.js",
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'commons.bundle.js',
      children: true,
      minChunks: 2,
      async: true,
    }),
    // Minify and optimize the index.html
    new HtmlWebpackPlugin({
      template: path.join(process.cwd(), 'components/index.html'),
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
      inject: true,
    }),
    new ExtractTextPlugin({
      filename: 'style.css',
      allChunks: true,
      disable: false,
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: [
          autoprefixer({
            browsers: ['last 2 versions'],
          }),
        ],
      },
    }),
  ],
};
