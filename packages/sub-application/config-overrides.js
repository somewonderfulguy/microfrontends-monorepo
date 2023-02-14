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
      remotes: {
        'library-mf': `library@http://localhost:${config.mode === "production" ? 5333 : 3333}/library.js`,
      },
      exposes: {
        './app': './src/App.tsx',
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