import { merge } from 'webpack-merge';
import common from './webpack.common.js';
import TercerPlugin from 'terser-webpack-plugin';
import MinimizerWebpackPlugin from 'css-minimizer-webpack-plugin';
import BundleAnalyzerPlugin from 'webpack-bundle-analyzer';

export default merge(common, {
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [
      new TercerPlugin({ terserOptions: { compress: { drop_console: true } } }),
      new MinimizerWebpackPlugin(),
    ],
    splitChunks: {
      chunks: 'all',
    },
  },
  plugins: [],
});
