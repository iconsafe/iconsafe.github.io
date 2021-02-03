const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')
const webpack = require('webpack')

module.exports = (env, argv) => {
  const isDevelopment = argv.mode !== 'production'

  return {
    entry: ['babel-polyfill', './src/main.js'],
    output: {
      path: path.join(__dirname, '/dist'),
      publicPath: isDevelopment ? '/' : '/',
      filename: 'main.[chunkhash:4].js'
    },
    devServer: {
      historyApiFallback: true,
      inline: true,
      port: 8000
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        },
        {
          test: /\.module\.s(a|c)ss$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: {
                  mode: 'local',
                  localIdentName: '[path][name]__[local]--[hash:base64:5]',
                  localIdentContext: path.resolve(__dirname, 'src'),
                  localIdentHashPrefix: 'my-custom-hash'
                }
              }
            },
            {
              loader: 'sass-loader'
            }
          ]
        },
        {
          test: /\.woff(2)?$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 10000,
                name: './font/[hash].[ext]',
                mimetype: 'application/font-woff'
              }
            }
          ]
        },
        {
          test: /\.s(a|c)ss$/,
          exclude: /\.module.(s(a|c)ss)$/,
          use: [
            'style-loader',
            'css-loader',
            {
              loader: 'sass-loader'
            }
          ]
        },
        {
          test: /\.svg$/,
          use: [
            {
              loader: 'svg-url-loader',
              options: {
                limit: 10000
              }
            }
          ]
        },
        {
          test: /\.(png|jpe?g|gif)$/i,
          use: [
            {
              loader: 'file-loader',
              options: {
                esModule: false
              }
            }
          ]
        }
      ]
    },
    resolve: {
      alias: {
        '@components': path.resolve(__dirname, 'src/components'),
        '@src': path.resolve(__dirname, 'src/'),
        '@store': path.resolve(__dirname, 'src/store/')
      },
      extensions: ['.js', '.jsx', '.scss']
    },
    plugins: [
      new webpack.ProvidePlugin({
        process: 'process/browser'
      }),
      new HtmlWebpackPlugin({
        template: './src/index.html'
      }),
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css'
      })
    ]
  }
}
