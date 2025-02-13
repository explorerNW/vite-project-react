import path from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';
import CompressionPlugin from 'compression-webpack-plugin';

import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';

const __dirname = new URL('.', import.meta.url).pathname;

export default {
  entry: ['./src/main.tsx'],
  output: {
    clean: true,
    path: path.join(__dirname, '../dist'),
    filename: '[name].[contenthash:8].js',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      '@': '/src',
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: {
          loader: 'babel-loader',
        },
        exclude: /node_modules/,
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.s[ac]ss$/i,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [autoprefixer, tailwindcss],
              },
            },
          },
          'sass-loader', // compiles Sass to CSS
        ],
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [autoprefixer, tailwindcss],
              },
            },
          },
        ],
      },
      {
        test: /\.txt$/,
        exclude: /node_modules/,
        use: [
          {
            loader: path.resolve(__dirname, 'webpack.custom.loader.js'),
          },
        ],
        type: 'asset/source',
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        exclude: /node_modules/,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: '[name].[contenthash].css' }),
    new HtmlWebpackPlugin({
      template: './index.webpack.html',
    }),
    new webpack.ProvidePlugin({
      React: 'react',
      ReactDOM: 'react-dom',
    }),
    new CompressionPlugin({
      algorithm: 'gzip',
    }),
  ],
};
