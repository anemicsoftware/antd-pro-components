const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const tailPkgs = ['components'];

const webPackConfigList = [];

tailPkgs.forEach((pkg) => {
  const entry = {};
  entry[`${pkg}`] = `./packages/${pkg}/src/index.tsx`;
  entry[`${pkg}.min`] = `./packages/${pkg}/src/index.tsx`;
  const config = {
    entry,
    output: {
      filename: '[name].js',
      library: `Pro${pkg.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase())}`,
      libraryTarget: 'umd',
      path: path.resolve(__dirname, 'packages', pkg, 'dist'),
      globalObject: 'this',
    },
    mode: 'production',
    resolve: {
      extensions: ['.ts', '.tsx', '.json', '.css', '.js', '.less'],
    },
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          include: /\.min\.js$/,
        }),
        new CssMinimizerPlugin({
          include: /\.min\.js$/,
        }),
      ],
    },
    module: {
      rules: [
        {
          test: /\.(png|jpg|gif|svg)$/i,
          type: 'asset',
        },
        {
          test: /\.jsx?$/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@umijs/babel-preset-umi/app'],
            },
          },
        },
        {
          test: /\.tsx?$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@umijs/babel-preset-umi/app'],
            },
          },
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: 'style-loader', // creates style nodes from JS strings
            },
            {
              loader: 'css-loader', // translates CSS into CommonJS
            },
          ],
        },
        {
          test: /\.less$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: (resourcePath, context) =>
                  `${path.relative(path.dirname(resourcePath), context)}/`,
              },
            },
            {
              loader: 'css-loader', // translates CSS into CommonJS
            },
            {
              loader: 'less-loader',
              options: {
                lessOptions: {
                  javascriptEnabled: true,
                },
              },
            },
          ],
        },
      ],
    },
    externals: [
      {
        react: 'React',
        'react-dom': 'ReactDOM',
        antd: 'antd',
      },
    ],
    plugins: [
      new ProgressBarPlugin(),
      // new BundleAnalyzerPlugin(),
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: '[name].css',
        chunkFilename: '[id].css',
      }),
    ],
  };
  webPackConfigList.push(config);
});

module.exports = webPackConfigList;
