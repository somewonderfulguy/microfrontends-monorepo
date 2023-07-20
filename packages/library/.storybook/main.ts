import type { StorybookConfig } from '@storybook/react-webpack5'
import path from 'path'

import tsconfig from '../tsconfig.json'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    '@storybook/addon-mdx-gfm',
    'storybook-addon-multiselect'
  ],
  framework: {
    name: '@storybook/react-webpack5',
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
        const alias: { [key: string]: string } = Object.entries(paths).reduce(
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
