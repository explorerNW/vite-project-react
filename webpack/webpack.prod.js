import { merge } from 'webpack-merge';
import common from './webpack.common.js';
import TercerPlugin from 'terser-webpack-plugin';
import MinimizerWebpackPlugin from 'css-minimizer-webpack-plugin';
import BundleAnalyzerPlugin from 'webpack-bundle-analyzer';
import CustomPlugin from './webpack.custom.plugin.js';

export default merge(common, {
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [
      new TercerPlugin({ terserOptions: { compress: { drop_console: true } } }),
      new MinimizerWebpackPlugin(),
    ],
    splitChunks: {
      chunks: 'all', // 将所有类型的代码块都进行分割
      minSize: 20000, // 最小代码块大小（字节）
      // maxSize: 0, // 最大代码块大小（字节），0表示不限制
      // minChunks: 1, // 最小被引入次数，引入超过这个次数的模块会被分割
      // maxAsyncRequests: 30, // 按需加载时的最大请求数
      // maxInitialRequests: 30, // 入口点的最大请求数
      usedExports: true,
      automaticNameDelimiter: '~', // 文件名称分隔符
      cacheGroups: {
        // 缓存组，可以自定义将哪些模块分组到一起
        // 默认的缓存组配置，可以将node_modules中的模块打包到一起
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10, // 缓存组的优先级
        },
        // 你可以添加更多的缓存组配置
      },
    },
  },
  plugins: [new CustomPlugin()],
});
