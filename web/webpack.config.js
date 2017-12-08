var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");



module.exports = {
  context: __dirname,
  devtool: debug ? "inline-sourcemap" : null,
  entry: {
        script:"./js/base.js",
    },
  output: {
    path: __dirname + "/js",
    filename: "[name].js"
  },
  plugins: 
    [
        new ExtractTextPlugin('style.css', {
            allChunks: true
        })
    ], /*+ 
  (debug ? [] : [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
  ]),*/

  module: {
    loaders: [
      {test: /\.js$/, include: __dirname+ '/js',loader: 'babel-loader', query: {presets: ["es2015"],}},
      { test: /\.less$/, exclude: /node_modules/, loader: ExtractTextPlugin.extract("css-loader!less-loader") }

      
    ]

   
  },



};