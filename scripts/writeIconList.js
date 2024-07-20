/* eslint-disable */
import fs from 'fs'
import path from 'path'

const baseFolder = './src/assets/svg-sprites'

// Read the contents of the base folder
const subFolders = fs.readdirSync(baseFolder)

const result = []

subFolders.forEach((subFolder) => {
  const folderPath = path.join(baseFolder, subFolder)

  // Check if the "subFolder" is a directory
  if (fs.statSync(folderPath).isDirectory()) {
    const files = fs.readdirSync(folderPath)

    const items = files.filter((file) => file.endsWith('.svg')).map((file) => file.replace('.svg', ''))

    result.push({
      title: subFolder === 'ui' ? 'UI' : subFolder.charAt(0).toUpperCase() + subFolder.slice(1),
      path: subFolder,
      items,
    })
  }
})

const jsonContent = JSON.stringify(result, null, 2)

fs.writeFileSync('./src/components/dev/icons.json', jsonContent)
