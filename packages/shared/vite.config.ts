import { Plugin, defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import path from 'path'
import { libInjectCss } from 'vite-plugin-lib-inject-css'
import libAssetsPlugin from '@laynezh/vite-plugin-lib-assets'

export const alias = {
  // keep in alphabetical order
  '~hooks': '/hooks',
  '~types': '/types',
  '~utils': '/utils'
}

// keep in alphabetical order as in file explorer
const entriesData: Record<string, { code: string; css?: string }> = {
  // hooks
  usePrevious: {
    code: 'hooks/usePrevious/usePrevious.ts'
  },
  useResizeObserver: {
    code: 'hooks/useResizeObserver/useResizeObserver.ts'
  },
  // utils
  classNames: {
    code: 'utils/classNames.ts'
  },
  createContextStore: {
    code: 'utils/createContextStore.tsx'
  },
  debounce: {
    code: 'utils/debounce.ts'
  },
  throttle: {
    code: 'utils/throttle.ts'
  }
}

const entry = Object.values(entriesData).map(({ code }) => code)

export default defineConfig({
  plugins: [
    react(),
    libInjectCss(),
    libAssetsPlugin({
      name: '[name].[ext]',
      outputPath(url, _resourcePath) {
        const currentDirectorySrc = path.basename(path.resolve('.'))
        const resourcePath = _resourcePath.replace(/\\/g, '/')
        const splitPath = resourcePath.split(currentDirectorySrc)

        if (splitPath.length > 1) {
          const removeLastSegment = (path: string) =>
            path.replace(/\/[^/]*$/, '')

          return removeLastSegment(splitPath[1])
        }
        return 'assets'
      }
    }) as Plugin,
    dts()
  ],
  build: {
    target: 'esnext',
    lib: {
      entry,
      formats: ['es']
    },
    copyPublicDir: false,
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        entryFileNames: ({ facadeModuleId }) => {
          const currentDirectory = path.basename(path.resolve('.'))
          const buildPath = facadeModuleId?.split(`${currentDirectory}/`)[1]
          if (buildPath) {
            return buildPath.replace('.tsx', '.js').replace('.ts', '.js')
          } else {
            console.warn('failed to get build path', facadeModuleId, buildPath)
            return '[name].js'
          }
        },
        assetFileNames: (chunkInfo) => {
          const name = chunkInfo.name
          if (name?.endsWith('.css')) {
            const baseName = name.replace(
              '.css',
              ''
            ) as keyof typeof entriesData
            const entryData = entriesData[baseName]

            if (entryData?.css) {
              return entryData.css
            }
            console.warn('failed to get css file data', chunkInfo.name)
          }
          return '[name][extname]'
        },
        chunkFileNames(chunkInfo) {
          const name = chunkInfo.name as keyof typeof entriesData
          const entryData = entriesData[name]
          if (entryData) {
            return `${entryData.code
              .replace('src/', '')
              .replace(`${name}.tsx`, '')
              .replace(`${name}.ts`, '')}[name].[hash].js`
          }
          console.warn('failed to get chunk file data', chunkInfo.name)
          return '[name].[hash].js'
        }
      }
    }
  },
  resolve: {
    alias
  }
})
