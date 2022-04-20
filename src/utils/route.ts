import fs from 'fs'
import path from 'path'
import { nestedFileSearch } from './file'

export const generateAppRouteFile = async () => {
  const srcPath = path.resolve(process.cwd(), 'src')
  if (!fs.existsSync(srcPath)) return

  const projectFiles = nestedFileSearch(srcPath)
  const routerFiles = projectFiles.filter((file) =>
    file.subPath.endsWith('routes.ts')
  )

  let code = `\/\/ * (nest-route) index - This file was created automatically. \n`
  const routes: string[] = []
  const modules: string[] = []
  for (const routerFile of routerFiles) {
    const content = fs.readFileSync(routerFile.staticPath, 'utf-8')
    if (!content.includes(`\/\/ * (nest-route) import`)) continue

    const rootNameOfKebabCase = routerFile.subPath.split('/')[1]
    const rootNameOfPascalCase = rootNameOfKebabCase
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))

    const routesName = `${rootNameOfPascalCase}Routes`

    const importStatement = `import { ${routesName} } from '.${routerFile.subPath.replace(
      /\.ts$/,
      ''
    )}';`
    code += `${importStatement}\n`
    routes.push(routesName)

    for (const line of content.split('\n')) {
      if (!line.endsWith(`index.module';`)) continue
      const moduleName = /{(.*)}/.exec(line)![1].trim()
      const modulePath = /['"](.*)['"]/.exec(line)![1].trim()

      const relativeModulePath = `./${path.join(
        `${rootNameOfKebabCase}/${modulePath}`
      )}`
      code += `import { ${moduleName} } from '${relativeModulePath}';\n`
      modules.push(moduleName)
    }
  }

  code += `\nexport const AppRoutes = [\n`
  for (const route of routes) {
    code += `  ...${route},\n`
  }
  code += `];\n`

  code += `\nexport const AppRouteModules = [\n`
  for (const module of modules) {
    code += `  ${module},\n`
  }
  code += `];\n`

  fs.writeFileSync(path.resolve(process.cwd(), 'src/app.routes.ts'), code)
}
