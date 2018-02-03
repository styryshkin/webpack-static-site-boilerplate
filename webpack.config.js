const path = require("path");
const webpack = require("webpack");
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const OccurrenceOrderPlugin = webpack.optimize.OccurrenceOrderPlugin;
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
const layouts = require("reshape-layouts");
const include = require("reshape-include");

module.exports = {
  devtool: false,
  context: path.join(__dirname, "src"),
  entry: {
    index: "./js/index.js",
    vendor: "./js/vendor/index.js"
  },
  output: {
    path: path.join(__dirname, "public"),
    filename: "js/[name].[chunkhash].js",
    chunkFilename: "js/[name].[chunkhash].js"
  },
  plugins: [
    new ExtractTextPlugin("css/[name].[contenthash].css"),
    new CommonsChunkPlugin({
      name: "vendor",
      minChunks: Infinity
    }),
    new UglifyJsPlugin(),
    new OccurrenceOrderPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src/views", "index.html"),
      chunks: ["vendor", "main"],
      hash: false,
      cache: true,
      minify: {
        collapseWhitespace: true,
        removeComments: true
      }
    }),
    new webpack.optimize.OccurrenceOrderPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.html$/,
        use: [
          {
            loader: "reshape-loader",
            options: {
              plugins: [layouts(), include()]
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        exclude: /node_modules$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: ["css-loader", "postcss-loader", "sass-loader"]
        })
      },
      {
        test: /\.css$/,
        exclude: /node_modules$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: ["css-loader", "postcss-loader"]
        })
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        exclude: /node_modules$/,
        use: [
          "file-loader?name=/images/[name].[ext]",
          {
            loader: "image-webpack-loader",
            options: {
              mozjpeg: {
                progressive: true,
                quality: 65
              },
              // optipng.enabled: false will disable optipng
              optipng: {
                enabled: false
              },
              pngquant: {
                quality: "65-90",
                speed: 4
              },
              gifsicle: {
                interlaced: false
              },
              // the webp option will enable WEBP
              webp: {
                quality: 75
              }
            }
          }
        ]
      }
    ]
  }
};
