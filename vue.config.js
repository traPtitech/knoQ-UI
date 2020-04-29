const webpack = require('webpack')
const { version } = require('./package.json')

const versionInj = {
  'process.env': {
    __APP_VERSION__: JSON.stringify(version),
  },
}

const tsconfigFile =
  process.env.NODE_ENV === 'development'
    ? 'tsconfig.dev.json'
    : 'tsconfig.prod.json'

module.exports = {
  productionSourceMap: false,
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin(versionInj),
      new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /ja/),
    ],
  },
  chainWebpack: config => {
    config.module
      .rule('ts')
      .use('ts-loader')
      .loader('ts-loader')
      .tap(options => {
        options.configFile = tsconfigFile
        return options
      })
    config.plugin('fork-ts-checker').tap(args => {
      args[0].tsconfig = tsconfigFile
      return args
    })
  },
}
