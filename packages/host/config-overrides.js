const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

const deps = require("./package.json").dependencies;
module.exports = function override(config) {
  config.output.publicPath = "auto";

  if (!config.plugins) {
    config.plugins = [];
  }

  config.plugins.unshift(
    new ModuleFederationPlugin({
      name: "host",
      filename: "remoteEntry.js",
      remotes: {
        // keep in alphabetical order
        'sub-application-mf': `sub_application@http://localhost:${config.mode === "production" ? 5030 : 3030}/sub-application.js`,
        'library-mf': `library@http://localhost:${config.mode === "production" ? 5333 : 3333}/library.js`,
      },
      exposes: {},
      shared: {
        ...deps,
        react: {
          singleton: true,
          requiredVersion: deps.react,
        },
        "react-dom": {
          singleton: true,
          requiredVersion: deps["react-dom"],
        },
      },
    })
  );
  return config;
};