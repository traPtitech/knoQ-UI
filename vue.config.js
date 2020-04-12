const webpack = require('webpack')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const { version } = require('./package.json')

const versionInj = {
  'process.env': {
    __APP_VERSION__: JSON.stringify(version),
  },
}

module.exports = {
  transpileDependencies: ['vuetify'],
  configureWebpack: {
    plugins: [new webpack.DefinePlugin(versionInj), new BundleAnalyzerPlugin()],
  },
}
