// TODO: think of moving it somewhere in the root of monorepo, so it can be reused in other projects

import { Plugin } from 'vite'
import copy from 'rollup-plugin-copy'
import fs from 'fs-extra'
import path from 'path'

/** For those use cases when the app uses some files from /public directory and these files are needed in library built components - handling copying whole public dir & resolving paths */
export const copyPublicDirDeps = (): Plugin => {
  const publicDirPath = path.resolve('public')
  const publicDirExists = fs.existsSync(publicDirPath)

  const copyPluginInstance = copy({
    targets: [{ src: 'public/*', dest: 'dist/public' }],
    hook: 'writeBundle'
  })

  if (!publicDirExists) {
    console.warn(
      '\x1b[33m%s\x1b[0m',
      `Public directory not found at ${publicDirPath}\nSkipping copying public directory.`
    )
  }

  return {
    name: 'vite-plugin-copy-public-dir-deps',
    apply: 'build',
    enforce: 'pre',
    writeBundle(...args) {
      if (!publicDirExists) {
        return
      }

      const writeBundle = copyPluginInstance.writeBundle
      if (writeBundle) {
        if (typeof writeBundle === 'function') {
          writeBundle.apply(this, args)
        } else {
          writeBundle.handler.apply(this, args)
        }
      } else {
        console.warn('writeBundle not implemented in copy plugin')
      }
    },
    resolveId(source, importer) {
      if (!publicDirExists) {
        return null
      }

      if (source.startsWith('/')) {
        const publicAssetPath = path.resolve('dist/public', source.slice(1))
        if (fs.existsSync(publicAssetPath)) {
          const distPath = path.resolve('.')
          const assetFinalPath = path.join(
            distPath,
            'dist/public',
            source.slice(1)
          )

          const importerRelativePath = path
            .relative(path.dirname(importer ?? ''), assetFinalPath)
            .split(path.sep)
            .join('/') // Normalize to Unix-style paths

          const importerRelativePathWithoutDist =
            importerRelativePath.startsWith('../dist')
              ? importerRelativePath.replace('../dist', '.')
              : importerRelativePath.replace('../dist/', '')

          return { id: importerRelativePathWithoutDist, external: true } // Mark as external to avoid Rollup trying to bundle it
        }
      }
      return null
    }
  }
}
