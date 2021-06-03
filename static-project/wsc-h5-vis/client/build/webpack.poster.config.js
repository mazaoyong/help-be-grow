const { resolve, join } = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HTMLInlineCSSWebpackPlugin = require('html-inline-css-webpack-plugin').default;
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { resolvePosterEntry, getFilterPattern } = require('./utils');
const { readFileSync } = require('fs');

const inlineCssPlugin = new HTMLInlineCSSWebpackPlugin({
  replace: {
    target: '<!--style-->',
    position: 'after',
    removeTarget: true,
  },
});

class MyPlugin {
  constructor(inlineCssPlugin) {
    this.inlineCssPlugin = inlineCssPlugin;
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('MyPlugin', (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).afterEmit.tapAsync(
        'MyPlugin',
        (data, cb) => {
          // 清空 inline css plugin 的缓存
          if (inlineCssPlugin.cssStyleMap.get(data.plugin)) {
            inlineCssPlugin.cssStyleMap.delete(data.plugin);
          }
          cb(null, data);
        },
      );
    });
  }
}

function getConfig() {
  const entry = resolvePosterEntry(getFilterPattern(process.argv));

  return {
    stats: 'errors-only',
    mode: 'none',
    watch: true,
    entry,
    target: 'node',
    output: {
      path: resolve(process.cwd(), '../', 'app/views/common/poster/vue/'),
      filename: '[name]/main.js',
      libraryTarget: 'commonjs2',
    },
    module: {
      rules: [
        {
          test: /\.(css|scss)$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'sass-loader',
              options: {
                includePaths: ['assets/styles'],
              },
            },
          ],
        },
        {
          test: /\.vue$/,
          use: [
            {
              loader: 'vue-loader',
              options: {
                productionMode: true,
              },
            },
          ],
        },
        {
          test: /\.(js|ts|jsx|tsx)$/,
          loader: resolve(__dirname, '../node_modules/@youzan/koko-plugin-babel/node_modules/babel-loader/lib/index.js'),
          exclude: /node_modules/,
          options: {
            cwd: resolve(__dirname, '..'),
          },
        },
        {
          test: /\.(png|jpg|jpeg|gif)$/,
          loader: 'url-loader',
          options: {
            limit: 50000,
          },
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.ts', '.vue', 'css', 'scss'],
      modules: [
        resolve(__dirname, '../'),
        resolve(__dirname, '../node_modules'),
        '../node_modules',
      ],
      alias: {
        '@': resolve(__dirname, '../'),
        'vue': join(__dirname, '../node_modules/vue'),
      },
    },
    optimization: {
      moduleIds: 'hashed',
      minimize: true,
      minimizer: [
        new TerserPlugin({
          cache: true,
          parallel: true,
          terserOptions: {
            compress: {
              drop_console: true,
            },
          },
        }),
        new OptimizeCSSAssetsPlugin({}),
      ],
    },
    plugins: [
      new VueLoaderPlugin(),
      new MiniCssExtractPlugin({
        filename: '[name]/index.css',
      }),
      ...Object.keys(entry).map(name => {
        let loadFontHtml = '';
        try {
          const svg = require('../node_modules/@youzan/vis-ui/lib/icon/src/font-lib/svg').default;
          loadFontHtml = readFileSync(
            resolve(__dirname, './loadFont.html'),
            { encoding: 'utf-8' },
          );
          loadFontHtml = loadFontHtml.replace('/*svg*/', `'${svg}'`);
        } catch (err) {
          console.error('海报加载字体失败', err);
        }

        return new HtmlWebpackPlugin({
          filename: `${name}/template.html`,
          templateContent: `<!--style-->\n<!--vue-ssr-outlet-->\n${loadFontHtml}`,
          inject: false,
          chunks: [name],
          cache: false,
        });
      }),
      new MyPlugin(inlineCssPlugin),
      inlineCssPlugin,
    ],
  };
}

module.exports = getConfig();
