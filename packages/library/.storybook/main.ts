import type { StorybookConfig } from '@storybook/react-webpack5'
import path, { dirname, join } from 'path'

import tsconfig from '../tsconfig.json'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@storybook/addon-interactions'),
    getAbsolutePath('@storybook/addon-a11y'),
    getAbsolutePath('@storybook/addon-mdx-gfm'),
    getAbsolutePath('storybook-addon-multiselect')
  ],
  framework: {
    name: getAbsolutePath('@storybook/react-webpack5'),
    options: {
      strictMode: true
    }
  },
  docs: {
    autodocs: 'tag'
  },
  staticDirs: ['../msw'],
  webpackFinal: async (config) => {
    // config aliases
    if (config.resolve) {
      const { paths } = tsconfig.compilerOptions
      if (paths) {
        const alias: {
          [key: string]: string
        } = Object.entries(paths).reduce(
          (acc, [key, value]) => ({
            ...acc,
            [key.replace('/*', '')]: path.resolve(
              __dirname,
              `../src/${value[0].replace('/*', '')}`
            )
          }),
          {}
        )
        config.resolve.alias = alias
      }
    }

    // config svg
    const imageRule = config.module!.rules!.find((rule) => {
      if (typeof rule !== 'string' && rule.test instanceof RegExp) {
        return rule.test.test('.svg')
      }
    })
    if (typeof imageRule !== 'string') {
      imageRule!.exclude = /\.svg$/
    }
    config.module!.rules!.unshift({
      test: /\.svg$/,
      use: [
        {
          loader: require.resolve('@svgr/webpack'),
          options: {
            prettier: false,
            svgo: false,
            svgoConfig: {
              plugins: [
                {
                  removeViewBox: false
                }
              ]
            },
            titleProp: true,
            ref: true
          }
        },
        {
          loader: require.resolve('file-loader'),
          options: {
            name: 'static/media/[name].[hash].[ext]'
          }
        }
      ],
      issuer: {
        and: [/\.(ts|tsx|js|jsx|md|mdx)$/]
      }
    })
    return config
  }
}

export default config

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')))
}
