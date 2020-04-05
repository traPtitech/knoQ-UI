const webpack = require('webpack')
const { version } = require('./package.json')

const versionInj = {
  'process.env': {
    __APP_VERSION__: JSON.stringify(version),
  },
}

module.exports = {
  transpileDependencies: ['vuetify'],
  configureWebpack: {
    plugins: [new webpack.DefinePlugin(versionInj)],
  },
}
