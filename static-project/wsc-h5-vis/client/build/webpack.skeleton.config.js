const { resolve, join } = require('path');
const { readFileSync, renameSync } = require('fs');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HTMLInlineCSSWebpackPlugin = require('html-inline-css-webpack-plugin').default;
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const genSkeleton = require('./genSkeleton');
const { resolveSkeletonEntry, getFilterPattern } = require('./utils');

const outputPath = resolve(__dirname, '../../static/skeletons/');
const viewsPath = resolve(__dirname, '../../app/views/');

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

class InjectSkeletonPlugin {
  constructor(name) {
    this.name = name;
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('MyPlugin', (compilation) => {
      const hooks = HtmlWebpackPlugin.getHooks(compilation);
      hooks.beforeEmit.tap(
        'InjectSkeletonPlugin',
        (data, cb) => {
          const pathname = data.plugin.options.filename.replace('.html', '');
          const ssrHtml = genSkeleton(pathname, data.html);
          data.html = ssrHtml;
        },
      );
      hooks.afterEmit.tap(
        'InjectSkeletonPlugin',
        (data, cb) => {
          const htmlPath = join(outputPath, data.outputName);
          const distPath = join(viewsPath, data.outputName);
          renameSync(htmlPath, distPath);
        },
      );
    });
  }
}

function getConfig(entryPattern = '') {
  const entry = resolveSkeletonEntry(getFilterPattern(process.argv));

  return {
    stats: 'errors-only',
    mode: 'none',
    watch: process.env.NODE_ENV === 'development',
    entry,
    target: 'node',
    output: {
      path: outputPath,
      filename: '[name]/main.js',
      libraryTarget: 'commonjs2',
      globalObject: 'this',
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
            'vue-loader',
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
        '@': resolve(__dirname),
        'vue': join(__dirname, '../node_modules/vue'),
      },
    },
    optimization: {
      minimize: true,
      minimizer: [
        new OptimizeCSSAssetsPlugin({}),
      ],
    },
    plugins: [
      new VueLoaderPlugin(),
      new MiniCssExtractPlugin({
        filename: '[name]/index.css',
      }),
      ...Object.keys(entry).map(name => {
        let fileContent = readFileSync(
          resolve(__dirname, '../../app/views', `${name}.html`),
          { encoding: 'utf-8' },
        );

        const replaceContent = `{% block page_content %}<div class="container" style="min-height: 812px; min-height: 100vh;"><!--style--><div id="app"><!--vue-ssr-outlet--></div></div>{% endblock %}`;
        const regExp = /\{%\sblock\spage_content(.|\s)+?endblock\s%\}/gm;
        if (regExp.test(fileContent)) {
          fileContent = fileContent.replace(regExp, replaceContent);
        } else {
          fileContent += replaceContent;
        }

        return new HtmlWebpackPlugin({
          filename: `${name}.html`,
          templateContent: fileContent,
          inject: false,
          chunks: [name],
          cache: false,
        });
      }),
      new MyPlugin(inlineCssPlugin),
      inlineCssPlugin,
      new InjectSkeletonPlugin(),
    ],
  };
}

module.exports = getConfig();
