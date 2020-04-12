const webpack = require('webpack')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const { version } = require('./package.json')

const versionInj = {
  'process.env': {
    __APP_VERSION__: JSON.stringify(version),
  },
}

module.exports = {
  configureWebpack: {
    plugins: [
      new BundleAnalyzerPlugin(),
      new webpack.DefinePlugin(versionInj),
      new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /ja/),
    ],
  },
}
