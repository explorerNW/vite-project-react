const { default: merge } = require('webpack-merge');
const common = require('./webpack.common');
const TercerPlugin = require('terser-webpack-plugin');
const MinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = merge(common, {
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [new TercerPlugin(), new MinimizerWebpackPlugin()],
    splitChunks: {
      chunks: 'all',
    },
  },
  plugins: [new BundleAnalyzerPlugin()],
});
