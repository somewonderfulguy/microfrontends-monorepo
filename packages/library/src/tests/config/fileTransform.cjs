/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const camelcase = require('camelcase')

/*
 * EVERYTHING EXCEPT SVG, given:
 * import cybercat from './assets/cybercat.jpg'
 * ...
 * <img src={cybercat} alt="cybercat" />
 * ...
 * 
 * Output in tests:
 * ...
 * <img src="cybercat.jpg" alt="cybercat" />
 * ...
 * 
 * It transforms imports to strings
 * 
 * ----------------------------------------------------------------------------------------
 *
 * FOR SVG, given:
 * import { ReactComponent as PreviewIcon } from './assets/eye.svg'
 * ...
 * <PreviewIcon className={styles.preview} />
 * ...
 * 
 * Output in tests:
 * ...
 * <svg class="preview">eye.svg</svg>
 * ...
 * 
 * It transforms svg JSX tags, so you'll see file name and be able to search in tests this way:
 * expect(screen.getByText('eye.svg', { selector: 'svg' }).toBeInTheDocument()
*/
module.exports = {
  process(src, filename) {
    const assetFilename = JSON.stringify(path.basename(filename))

    if (filename.match(/\.svg$/)) {
      const pascalCaseFilename = camelcase(path.parse(filename).name, {
        pascalCase: true
      })
        
      const componentName = `Svg${pascalCaseFilename}`

      return {
        code:
          `const React = require('react')
          module.exports = {
            __esModule: true,
            default: ${assetFilename},
            ReactComponent: React.forwardRef(function ${componentName}(props, ref) {
              return {
                $$typeof: Symbol.for('react.element'),
                type: 'svg',
                ref: ref,
                key: null,
                props: Object.assign({}, props, {
                  children: ${assetFilename}
                })
              }
            })
          }`
      }
    }

    return { code: `module.exports = ${assetFilename}` }
  }
}