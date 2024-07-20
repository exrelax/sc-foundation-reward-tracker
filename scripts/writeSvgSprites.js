/* eslint-disable */
import { execSync } from 'child_process'
import fs from 'fs'

const svgFolder = './src/assets/svg-sprites'

fs.readdirSync(svgFolder).forEach((folderName) => {
  const folderPath = `${svgFolder}/${folderName}`
  console.log(folderPath)

  if (fs.statSync(folderPath).isDirectory()) {
    const outputFilePath = `./public/images/svg-sprites/${folderName}.svg`
    const command = `./node_modules/.bin/svg-symbol-sprite -i ${folderPath} -o ${outputFilePath} *.svg`
    execSync(command)
    console.log(`Generated ${outputFilePath}`)
  }
})
