const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WebpackBar = require('webpackbar')
const CopyPlugin = require('copy-webpack-plugin')

const isDev = process.env.NODE_ENV !== 'production'

module.exports = {
  mode: isDev ? 'development' : 'production',
  devtool: isDev ? 'eval-source-map' : false,
  entry: {
    app: path.resolve(__dirname, 'src/index.tsx'),
  },
  output: {
    filename: `js/[name]${isDev ? '' : '.[hash:8]'}.js`,
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: false,
              sourceMap: isDev,
              importLoaders: 2
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                ident: 'postcss',
                plugins: [
                  require('postcss-flexbugs-fixes'),
                  require('postcss-preset-env')({
                    autoprefixer: {
                      grid: true,
                      flexbox: 'no-2009'
                    },
                    stage: 3,
                  }),
                  require('postcss-normalize'),
                ],
                sourceMap: isDev,
              }
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: isDev,
            },
          }
        ],
      },
      {
        test: /\.(tsx?|js)$/,
        loader: 'babel-loader',
        options: { cacheDirectory: true },
        exclude: /node_modules/,
      },
      {
        test: /\.svg/,
        use: {
          loader: "svg-url-loader",
          options: {
          },
        },
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/index.html'),
      filename: 'index.html',
      cache: false, // 特别重要：防止之后使用v6版本 copy-webpack-plugin 时代码修改一刷新页面为空问题。
      minify: isDev ? false : {
        removeAttributeQuotes: true,
        collapseWhitespace: true,
        removeComments: true,
        collapseBooleanAttributes: true,
        collapseInlineTagWhitespace: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        minifyCSS: true,
        minifyJS: true,
        minifyURLs: true,
        useShortDoctype: true,
      },
    }),
    new WebpackBar({
      name: isDev ? '正在启动' : '正在打包'
    }),
    new CopyPlugin({
      patterns: [
        { from: path.resolve(__dirname, './public/logo.jpeg'), to: path.resolve(__dirname, './dist') },
      ],
    })
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json'],
    alias: {
      '@src': path.resolve(__dirname, './src'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@components': path.resolve(__dirname, './src/components'),
      '@api': path.resolve(__dirname, "./src/api"),
      '@type': path.resolve(__dirname, "./src/typings"),
      '@constants': path.resolve(__dirname, "./src/constants"),
      '@utils': path.resolve(__dirname, "./src/utils")
    }
  },
  devServer: {
    port: 8081,
    compress: true, // 是否启用 gzip 压缩
    hot: true, // 热更新
    proxy: {
      '/api': {
        target: 'http://localhost:8201',
        pathRewrite: { '^/api': '' },
      }
    }
  },
}
