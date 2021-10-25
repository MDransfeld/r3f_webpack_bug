const fs = require('fs')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { ModuleFederationPlugin } = require('webpack').container
const deps = require('./package.json').dependencies

const isProductionBuild = process.env.NODE_ENV === 'production'

const resolveApp = (...relativePaths) =>
  path.resolve(fs.realpathSync(process.cwd()), ...relativePaths)

const port = 8081

module.exports = {
  mode: isProductionBuild ? 'production' : 'development',
  entry: isProductionBuild
    ? {
        main: resolveApp('src/index.ts'),
        app1: resolveApp('src/setupPublicPath.js'),
      }
    : resolveApp('src/index.ts'),
  output: {
    path: isProductionBuild ? resolveApp('dist') : undefined,
    publicPath: isProductionBuild ? '/' : `http://localhost:${port}/`,
  },
  bail: isProductionBuild,
  devtool: isProductionBuild ? 'source-map' : 'inline-source-map',
  devServer: {
    static: { directory: path.join(__dirname, 'dist') },
    port,
    compress: true,
    hot: 'only',
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.(js|mjs|jsx|ts|tsx)$/,
            include: resolveApp('src'),
            use: [
              {
                loader: 'babel-loader',
                options: {
                  compact: isProductionBuild,
                  cacheDirectory: true,
                  cacheCompression: false,
                },
              },
            ].filter(Boolean),
          },
        ],
      },
    ],
  },
  performance: {
    hints: false,
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
  },
  plugins: [
    isProductionBuild && new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      minify: isProductionBuild
        ? {
            removeComments: true,
            collapseWhitespace: true,
            removeRedundantAttributes: true,
            useShortDoctype: true,
            removeEmptyAttributes: true,
            removeStyleLinkTypeAttributes: true,
            keepClosingSlash: true,
            minifyJS: true,
            minifyCSS: true,
            minifyURLs: true,
          }
        : {},
    }),
    new ModuleFederationPlugin({
      name: 'app1',
      filename: 'remoteEntry.js',
      exposes: {
        './App1': './src/App/App',
      },
      shared: [
        {
          ...deps,
          react: { singleton: true, requiredVersion: deps['react'] },
        },
      ],
    }),
  ].filter(Boolean),
}
