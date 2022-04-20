import fs from 'fs'

export const nestedFolderSearch = (staticPath: string, subPath = '/') => {
  const files = fs.readdirSync(staticPath)
  const folders = [{ subPath, staticPath }]

  for (const file of files) {
    const stats = fs.statSync(staticPath + '/' + file)
    if (!stats.isDirectory()) continue
    const items = nestedFolderSearch(
      staticPath + '/' + file,
      subPath + file + '/'
    )
    for (const item of items) folders.push(item)
  }

  return folders
}

export const nestedFileSearch = (staticPath: string) => {
  const folders = nestedFolderSearch(staticPath)
  const files: { staticPath: string; subPath: string }[] = []

  for (const folder of folders) {
    const filesInFolder = fs.readdirSync(folder.staticPath)
    for (const file of filesInFolder) {
      const stats = fs.statSync(folder.staticPath + '/' + file)
      if (stats.isDirectory()) continue
      files.push({
        staticPath: folder.staticPath + '/' + file,
        subPath: folder.subPath + file
      })
    }
  }

  return files
}
