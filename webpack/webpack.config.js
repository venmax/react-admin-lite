const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isEnvProduction = ['production', 'test'].includes(process.env.NODE_ENV)
module.exports = {
  entry: path.resolve(__dirname, '../src/index.tsx'),
  resolve: {
    modules: ['node_modules'],
    extensions: ['.tsx', '.ts', '.js', '.jsx', '.json'],
    alias: {
      '@components': path.resolve(__dirname, '../src/components'),
      '@common': path.resolve(__dirname, '../src/common'),
      '@utils': path.resolve(__dirname, '../src/utils'),
      '@views': path.resolve(__dirname, '../src/views'),
      '@shared': path.resolve(__dirname, '../src/shared'),
      '@config': path.resolve(__dirname, '../src/config'),
      '@store': path.resolve(__dirname, '../src/store'),
      '@api': path.resolve(__dirname, '../src/api'),
      '@assets': path.resolve(__dirname, '../src/assets'),
      '@models': path.resolve(__dirname, '../src/models')
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            cacheCompression: isEnvProduction,
            compact: isEnvProduction,
            presets: [
              "@babel/preset-env",
              "@babel/preset-react",
              "@babel/preset-typescript",
            ],
          }
        }
      },
      {
        test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 4096,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'static/img/[name].[hash:8].[ext]'
                }
              }
            }
          }
        ]
      },
      {
        test: /\.(icon\.svg)(\?.*)?$/,
        use: [
          {
            loader: 'babel-loader'
          },
          {
            loader: '@svgr/webpack',
            options: {
              babel: false,
              icon: true
            }
          }
        ]
      },
      {
        test: /\.(svg)(\?.*)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'static/img/[name].[hash:8].[ext]'
            }
          }
        ]
      },
    ]
  },
  plugins: []
};