const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const config = require('./config.json')
const environment = process.env.NODE_ENV === 'production' ? 'production' : 'development';

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = {
  // entry: {
  //   'bundle': "./src/app/index.js",
  // },
  entry: [
    // "tether",
    // "bootstrap",
    // "./src/app/vendor.js",
    "./src/app/index.js"
  ],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  plugins: [
    // new webpack.ProvidePlugin({
    //   $: 'jquery',
    //   jQuery: 'jquery',
    //   'window.jQuery': 'jquery',
    //   tether: 'tether',
    //   Tether: 'tether',
    //   'window.Tether': 'tether',
    //   // Alert: 'exports-loader?Alert!bootstrap/js/dist/alert',
    //   // Button: 'exports-loader?Button!bootstrap/js/dist/button',
    //   // Carousel: 'exports-loader?Carousel!bootstrap/js/dist/carousel',
    //   // Collapse: 'exports-loader?Collapse!bootstrap/js/dist/collapse',
    //   // Dropdown: 'exports-loader?Dropdown!bootstrap/js/dist/dropdown',
    //   // Modal: 'exports-loader?Modal!bootstrap/js/dist/modal',
    //   // Popover: 'exports-loader?Popover!bootstrap/js/dist/popover',
    //   // Scrollspy: 'exports-loader?Scrollspy!bootstrap/js/dist/scrollspy',
    //   // Tab: 'exports-loader?Tab!bootstrap/js/dist/tab',
    //   // Tooltip: "exports-loader?Tooltip!bootstrap/js/dist/tooltip",
    //   // Util: 'exports-loader?Util!bootstrap/js/dist/util'
    // }),
    new CopyWebpackPlugin([
      {
        from: './src/public/assets',
        to: './assets',
      },
      {
        from: './src/public/templates',
        to: './templates',
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
      // {
      //   test: /bootstrap\/dist\/js\//, use: 'imports-loader?jQuery=jquery'
      // }
    ]
  }
};