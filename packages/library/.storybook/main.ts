import type { StorybookConfig } from '@storybook/react-webpack5'
import path from 'path'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y'
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {}
  },
  docs: {
    autodocs: 'tag'
  },
  webpackFinal: async (config) => {
    // config aliases
    if (config.resolve) {
      config.resolve.alias = {
        '@components': path.resolve(__dirname, '../src/components'),
        '@hoc': path.resolve(__dirname, '../src/hoc'),
        '@hooks': path.resolve(__dirname, '../src/hooks'),
        '@utils': path.resolve(__dirname, '../src/utils')
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
              plugins: [{ removeViewBox: false }]
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
