const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin')

const deps = require('./package.json').dependencies
module.exports = function override(config) {
  config.output.publicPath = 'auto'

  if (!config.plugins) {
    config.plugins = []
  }

  config.plugins.unshift(
    new ModuleFederationPlugin({
      name: 'library',
      filename: 'library.js',
      remotes: {},
      exposes: {
        // keep in alphabetical order
        './Block': './src/components/Block',
        './Button': './src/components/formLike/Button',
        './usePrevious': './src/hooks/usePrevious',
        './useResizeObserver': './src/hooks/useResizeObserver',
      },
      shared: {
        ...deps,
        react: {
          singleton: true,
          requiredVersion: deps.react,
        },
        'react-dom': {
          singleton: true,
          requiredVersion: deps['react-dom'],
        },
      },
    })
  )
  return config
}