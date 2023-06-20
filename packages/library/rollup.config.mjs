import resolve from '@rollup/plugin-node-resolve'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'
import commonjs from '@rollup/plugin-commonjs'
import postcss from 'rollup-plugin-postcss'
import url from '@rollup/plugin-url'
import svgr from '@svgr/rollup'
import image from '@rollup/plugin-image'
import json from '@rollup/plugin-json'
import dotenv from 'rollup-plugin-dotenv'
import alias from '@rollup/plugin-alias'

// keep alphabetical (like in file browser)
const paths = [
  'components/Block',
  'components/controls/Button',
  'hoc/withLazyLoad',
  'hoc/withLazyHooks',
  'hooks/usePrevious',
  'hooks/useResizeObserver'
]

// TODO: learn how to use rollup-plugin-visualizer
// TODO: learn how to launch rollup in watch mode (application, not library)
// TODO: learn module federation in rollup
// TODO: code splitting in rollup

export default paths.map((path) => ({
  input: `src/${path}/index.ts`,
  output: [
    {
      file: `build/${path}/index.js`,
      format: 'es',
      sourcemap: true
    },
    {
      /*
      CommonJS (cjs) here for require() support. Unlike ES Modules (esm), CommonJS has dynamic module structure.
      This makes tree shaking impossible, and importing one module will import all other modules in the dependency tree.
    */
      file: `build/${path}/index.cjs.js`,
      format: 'cjs',
      sourcemap: true
    }
  ],
  plugins: [
    // import modules using aliases import batman from '../../../batman'; -> import batman from '@batman';
    alias({
      entries: [
        // keep alphabetical (like in file browser)
        // TODO: aliases configured in many places (tsconfig, rollup.config, jest.config, .storybook/main) - it's better to have an array of aliases in one place
        { find: '@api/**/*.*', replacement: './src/api' },
        { find: '@components/**/*.*', replacement: './src/components' },
        { find: '@hoc/**/*.*', replacement: './src/hoc' },
        { find: '@hooks/**/*.*', replacement: './src/hooks' },
        { find: '@tests/**/*.*', replacement: './src/tests' },
        { find: '@utils/**/*.*', replacement: './src/utils' }
      ]
    }),
    dotenv(), // import .env variables
    peerDepsExternal(), // this looks into peerDependencies and removes it from bundle, so the bundle will be smaller
    resolve(), // locate third-party modules used inside project (node_modules)
    commonjs(), // commonJS modules to ES6 modules
    typescript({
      // ts compiler
      tsconfig: './tsconfig.json',
      useTsconfigDeclarationDir: true
    }),
    postcss({
      // css, css-modules
      modules: true,
      sourcemap: true,
      minimize: true
    }),
    json(), // import json files
    image(), // images i.e. .jpg, .png (will be converted to base64; keep image() before url() so src path will be correct in output)
    url(), // url + svgr allows to compile `import { ReactComponent as SvgIcon } from './pathTo/svgIcon.svg'`
    svgr({ icon: true }),
    terser() // minifier
  ]
}))
