/* eslint-disable import/no-anonymous-default-export */
import resolve from '@rollup/plugin-node-resolve'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'
import commonjs from '@rollup/plugin-commonjs'
import postcss from 'rollup-plugin-postcss'
// TODO images
// TODO ? svg ? (test first)

const sharedConf = {
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
    terser() // minifier
  ],

  // duplicate from peerDependencies - without it using bundles won't work
  external: ['react', 'react-dom', 'react-query']
}

export default [{
  input: 'src/hoc/federatedComponent/index.ts',
  output: [
    {
      file: 'build-npm/hoc/federatedComponent/index.js',
      format: 'es',
      sourcemap: true
    }
  ],
  ...sharedConf
}]