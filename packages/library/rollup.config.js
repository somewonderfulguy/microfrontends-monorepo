/* eslint-disable import/no-anonymous-default-export */
import resolve from '@rollup/plugin-node-resolve'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'
import commonjs from '@rollup/plugin-commonjs'
import postcss from 'rollup-plugin-postcss'
import url from '@rollup/plugin-url'
import svgr from '@svgr/rollup'
import image from '@rollup/plugin-image'

// keep alphabetical (like in file browser)
const paths = [
  'components/Block',
  'components/formLike/Button',
  'hoc/withLazyLoad',
  'hoc/withLazyHooks',
  'hooks/usePrevious',
  'hooks/useResizeObserver'
]

export default paths.map(path => ({
  input: `src/${path}/index.ts`,
  output: [{
    file: `build-npm/${path}/index.js`,
    format: 'es',
    sourcemap: true
  }],
  plugins: [
    peerDepsExternal(), // this looks into peerDependencies and removes it from bundle, so the bundle will be smaller
    resolve(), // to locate third-party modules used inside our project (node_modules)
    commonjs(), // commonJS modules to ES6 modules
    typescript({ tsconfig: './tsconfig.json' }), // ts compiler
    postcss({ // css, css-modules
      modules: true,
      sourcemap: true,
      minimize: true
    }),
    image(), // images i.e. .jpg, .png (will be converted to base64; keep image() before url() so src path will be correct in output)
    url(), // url + svgr allows to compile `import { ReactComponent as SvgIcon } from './assets/svgIcon.svg'`
    svgr({ icon: true }),
    terser(), // minifier
  ],

  // duplicate from peerDependencies (in package.json) - without it using bundles won't work
  external: ['react', 'react-dom', 'react-error-boundary', 'react-query']
}))
