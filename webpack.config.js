const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const config = require('./config.json');
const ENVIRONMENT_PRODUCTION = 'production';
const ENVIRONMENT_DEVELOPMENT = 'development';
const environment = process.env.NODE_ENV === ENVIRONMENT_PRODUCTION ? ENVIRONMENT_PRODUCTION : ENVIRONMENT_DEVELOPMENT;
let API_URL = config.API_URL[environment];

let plugins = [
  new HtmlWebpackPlugin({ template: "./src/public/index.html" }),
  new ExtractTextPlugin("styles.css"),
  new webpack.DefinePlugin({
    API_URL: JSON.stringify(API_URL),
    API_URL_V1: JSON.stringify(`${API_URL}v1/`)
  }),
  new UglifyJsPlugin({ uglifyOptions: 
    { mangle: false }
  }),
];

if (environment === ENVIRONMENT_PRODUCTION) {
  plugins.push(
    new CopyWebpackPlugin([
      {
        from: './src/public/assets/js/libs',
        to: './assets/js/libs',
      },
      {
        from: './src/public/templates',
        to: './templates',
      },
    ])
  );
}

module.exports = {
  entry: [
    "./src/app/vendor.js",
    "./src/app/index.js"
  ],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  plugins,
  devServer: {
    contentBase:  path.join(__dirname, 'src/public'),
    historyApiFallback: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.woff2?$|\.ttf$|\.eot$|\.svg$/,
            use: [{
                loader: "file-loader"
            }]
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {},
          },
        ],
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
      },
      {
        test: /\.html$/,
        use: "raw-loader"
      },
    ]
  }
};