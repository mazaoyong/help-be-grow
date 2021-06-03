const isProduction = process.env.SUPERMAN_BUILD_TYPE === 'prd';
const path = require('path');

module.exports = {
  devtool: 'none',
  output: {
    publicPath: 'https://b.yzcdn.cn/wsc-pc-vis/h5/',
    chunkFilename: isProduction ? '[name]_[chunkhash].js' : '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        loaders: ['babel-loader', 'ts-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx'],
    alias: {
      '@': __dirname,
      common: path.join(__dirname, 'common'),
      'pages-api': path.join(__dirname, 'pages-api'),
      components: path.join(__dirname, 'components'),
      store: path.join(__dirname, 'store'),
      styles: path.join(__dirname, 'styles'),
      utils: path.join(__dirname, 'utils'),
      domain: path.join(__dirname, 'domain'),
      fns: path.join(__dirname, 'fns')
    }
  }
};
