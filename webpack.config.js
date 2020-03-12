const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const config = require('./config.json');
const environment = process.env.NODE_ENV === 'production' ? 'production' : 'development';

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: [
    "./src/app/vendor.js",
    "./src/app/index.js"
  ],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: './src/public/assets/js/libs',
        to: './assets/js/libs',
      },
    ]),
    new HtmlWebpackPlugin({ template: "./src/public/index.html" }),
    new ExtractTextPlugin("styles.css"),
    new webpack.DefinePlugin({
      API_URL: JSON.stringify(config.API_URL[environment])
    }),
    new UglifyJsPlugin({ uglifyOptions: 
      { mangle: false }
    }),
  ],
  /* resolve: {
      alias: {
          "bower_components": path.resolve(__dirname, "bower_components"),
          // "paper": path.resolve(__dirname, "path/to/bower/file")
      }
  }, */
  devServer: {
    contentBase:  path.join(__dirname, 'src/public'),
    historyApiFallback: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: "babel-loader",
        // exclude: ["/bower_components/", "/node_modules/"]
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