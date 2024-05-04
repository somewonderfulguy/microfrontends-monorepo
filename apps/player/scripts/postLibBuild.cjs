/* eslint-disable */

const fs = require('fs')
const path = require('path')

// Define the paths for the source and destination files
const srcPath = path.join(__dirname, '..', 'dist', 'styles', 'reset2.css')
const destPath = path.join(__dirname, '..', 'dist', 'styles', 'reset.css')

const colors = {
  red: '\x1b[31m%s\x1b[0m',
  green: '\x1b[32m%s\x1b[0m',
  yellow: '\x1b[33m%s\x1b[0m',
  nav: '\x1b[34m%s\x1b[0m'
}

console.log(colors.blue, '\nStarting post build script...')

// Check if the source file exists
fs.exists(srcPath, function (exists) {
  if (exists) {
    // If the file exists, rename it to the destination path
    fs.rename(srcPath, destPath, function (err) {
      if (err) {
        // If there's an error, log it to the console
        console.error(colors.red, 'Error renaming the file:', err)
      } else {
        // If the operation is successful, log a success message
        console.log(
          colors.green,
          'File renamed successfully from reset2.css to reset.css'
        )
      }
    })
  } else {
    // If the source file doesn't exist, log a message
    console.log(
      colors.yellow,
      'The file reset2.css does not exist, no action taken.'
    )
  }
})
