var webpack = require('webpack');
var path = require('path');
var autoprefixer = require('autoprefixer');
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
      // 'webpack-hot-middleware/client',
      path.join(process.cwd(), 'components/client/main.js'),
    ],
  },
  output: {
    path: path.join(process.cwd(), 'build'),
    publicPath: '/build/',   // 网站运行时访问目录
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
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
        loaders: ['style-loader', 'css-loader'],
      },
      {
        test: /\.less$/,
        loaders: ['style-loader', 'css-loader', 'postcss-loader', `less-loader?{"modifyVars":{${theme}}}`],
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
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn/),
    new webpack.ProvidePlugin({
      moment: 'moment',
      Immutable: 'immutable',
    }),
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'vendor',
    //   children: true,
    //   minChunks: 2,
    //   async: true
    // }),
    // new HtmlWebpackPlugin({
    //   template: path.join(process.cwd(), 'src/index.html'),
    //   inject: true
    // }),
    new webpack.DefinePlugin({
      'process.env': {
        BASE_PATH_ENTERPRISE: process.env.BASE_PATH_ENTERPRISE ? `"${process.env.BASE_PATH_ENTERPRISE}"` : null,
        NODE_ENV: '"development"',
      },
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
