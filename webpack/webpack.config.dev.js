"use strict";

const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const baseConfig = require("./webpack.config");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

const { module: _module } = baseConfig;

function _resolve(track) {
  return path.join(__dirname, "..", track);
}

module.exports = Object.assign(baseConfig, {
  mode: "development",
  output: {
    path: _resolve("public"),
    publicPath: "/",
    filename: "static/js/bundle.js",
    chunkFilename: "static/js/[name].chunk.js",
  },
  module: {
    rules: [
      ..._module.rules,
      {
        test: /\.css|\.less$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
          {
            loader: "less-loader",
            options: {
              lessOptions: {
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      filename: "index.html",
      inject: "body",
      template: _resolve("src/index.html"),
    }),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("development"),
      },
    }),
    new ForkTsCheckerWebpackPlugin({
      async: false,
      eslint: {
        files: "./src/**/*",
      },
    }),
  ],
  devServer: {
    open: true,
    clientLogLevel: 'error',
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 9000
  },
});
