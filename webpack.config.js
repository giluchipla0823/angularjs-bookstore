const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const config = require('./config.json')
const environment = process.env.NODE_ENV === 'production' ? 'production' : 'development';

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const CopyPlugin = require('copy-webpack-plugin');

console.log('__dirname', __dirname);

module.exports = {
  entry: "./src/app/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js"
  },
  plugins: [
    new HtmlWebpackPlugin({ template: "./src/public/index.html" }),
    new ExtractTextPlugin("styles.css"),
    new webpack.DefinePlugin({
      API_URL: JSON.stringify(config.API_URL[environment])
    }),
    new UglifyJsPlugin({ uglifyOptions: 
      { mangle: false }
    }),
    new CopyPlugin([
      { from: '/assets/**', to: '/assets/luiggi/' }
    ])
  ],
  devServer: {
    contentBase: "./src/public",
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
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
      },
      {
        test: /\.html$/,
        use: "raw-loader"
      }
    ]
  }
};