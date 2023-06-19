const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin')

const deps = require('./package.json').dependencies
module.exports = function override(config) {
  config.output.publicPath = 'auto'

  if (!config.plugins) {
    config.plugins = []
  }

  config.plugins.unshift(
    new ModuleFederationPlugin({
      name: 'sub_application',
      filename: 'sub-application.js',
      remotes: {},
      exposes: {
        './app': './src/components/App/App.tsx'
      },
      shared: {
        ...deps,
        react: {
          singleton: true,
          requiredVersion: deps.react
        },
        'react-dom': {
          singleton: true,
          requiredVersion: deps['react-dom']
        }
      }
    })
  )
  return config
}
