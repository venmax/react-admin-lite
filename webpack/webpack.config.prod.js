"use strict";

const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const safePostCssParser = require("postcss-safe-parser");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const baseConfig = require("./webpack.config");
const bundleAnalyzer = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const { module: _module } = baseConfig;

function _resolve(track) {
  return path.join(__dirname, "..", track);
}

module.exports = Object.assign(baseConfig, {
  mode: "development",
  output: {
    path: _resolve("public"),
    publicPath: "/",
    filename: "static/js/bundle.[hash:8].js",
    chunkFilename: "static/js/[name].[contenthash:8].chunk.js",
  },
  module: {
    rules: [
      ..._module.rules,

      {
        test: /\.less/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: "css-loader",
          },
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
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          // 如果不抽离 css 可以使用此 loader
          // {
          //   loader: 'style-loader',
          // },
          {
            loader: "css-loader",
          },
        ],
      },
    ],
  },
  plugins: [
    // new bundleAnalyzer(),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      filename: "index.html",
      inject: "body",
      template: "src/index.html",
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
    }),
    new MiniCssExtractPlugin({
      filename: "static/css/[name].[contenthash:8].css",
      chunkFilename: "static/css/[name].[contenthash:8].chunk.css",
    }),

    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ],
  optimization: {
    splitChunks: {
      chunks: "initial", // 默认只对入口文件进行split chunks，使用 all 时会引起路由懒加载拆出过多子组件，增加请求数
      name: true,
      cacheGroups: {
        // 体积较大的chunk单独打包
        npmLib: {
          chunks: "async",
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            const packageName = module.context.match(
              /[\\/]node_modules[\\/](.*?)([\\/]|$)/
            )[1];
            return `npm.${packageName.replace("@", "")}`;
          },
          minSize: 4000000,
          priority: 20,
        },
        // 入口共享chunks
        vendors: {
          chunks: "initial",
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          name: "vendors",
        },
        // 异步共享chunks
        "async-vendors": {
          chunks: "async",
          test: /[\\/]node_modules[\\/]/,
          name: "async-vendors",
          priority: 5,
        },
        // 组件chunks
        components: {
          chunks: "all",
          test: _resolve("./src/components"),
          name: "components",
          minChunks: 2,
          reuseExistingChunk: true,
          priority: 15,
        },
      },
    },
    runtimeChunk: {
      name: "manifest",
    },
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          parse: {
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false,
            inline: 2,
          },
          mangle: {
            safari10: true,
          },
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true,
          },
        },
        extractComments: false,
        cache: true,
        sourceMap: false,
        parallel: true,
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          parser: safePostCssParser,
          map: false,
        },
      }),
    ],
  },
});
