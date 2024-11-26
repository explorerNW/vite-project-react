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
    path: path.join(__dirname, '../dist'),
    filename: '[name].[contenthash:8].js',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
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
        use: [
          {
            loader: path.resolve(__dirname, 'webpack.custom.loader.js'),
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: ['file-loader', 'url-loader'],
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
