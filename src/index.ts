import inquirer from 'inquirer'
import chalk from 'chalk'
import fs from 'fs'
import { nestedFileSearch } from './utils/file'
import path from 'path'

const main = async () => {
  console.log(chalk.green('This command creates a sub-router module.'))

  const { rootNameOfKebabCase } = await inquirer.prompt({
    type: 'input',
    name: 'rootNameOfKebabCase',
    message: `Enter the name of the parent root folder. ${chalk.gray(
      '(Just below the src folder)'
    )}`
  })
  const rootNameOfPascalCase = rootNameOfKebabCase.replace(
    /-([a-z])/g,
    (match, group1) => group1.toUpperCase()
  )

  const { routeNameOfKebabCase } = await inquirer.prompt({
    type: 'input',
    name: 'routeNameOfKebabCase',
    message: `Please enter the subroutine name you want to create. ${chalk.gray(
      '(e.g. user/token/check -> user-token-check)'
    )}`
  })

  const routeNameOfPascalCase = (routeNameOfKebabCase as string)
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
  const routeNameOfCamelCase =
    routeNameOfPascalCase.charAt(0).toLowerCase() +
    routeNameOfPascalCase.slice(1)

  const routeGeneratePath = path.resolve(
    `${process.cwd()}/src/${rootNameOfKebabCase}/${routeNameOfKebabCase}`
  )

  const addRouteTemplatePath = path.resolve(
    __dirname,
    '../src/template/add-route'
  )

  fs.mkdirSync(routeGeneratePath, {
    recursive: true
  })

  const rootRouteFilePath = path.resolve(
    `${process.cwd()}/src/${rootNameOfKebabCase}/${rootNameOfKebabCase}.routes.ts`
  )
  if (fs.existsSync(rootRouteFilePath)) {
    const content = fs.readFileSync(rootRouteFilePath, 'utf8')
    const newContent = content
      .replace(
        `\/\/ * (nest-route) import - do not remove this comment.`,
        `import { ${routeNameOfPascalCase}Module } from './${routeNameOfKebabCase}/index.module';\n` +
          `\/\/ * (nest-route) import - do not remove this comment.`
      )
      .replace(
        `\/\/ * (nest-route) define - do not remove this comment.`,
        `{\n    path: '/${routeNameOfKebabCase}',\n    module: ${routeNameOfPascalCase}Module,\n  },\n  ` +
          `\/\/ * (nest-route) define - do not remove this comment.`
      )
    fs.writeFileSync(rootRouteFilePath, newContent)
  }

  const files = nestedFileSearch(addRouteTemplatePath)
  for (const { subPath } of files) {
    const templateFilePath = path.join(addRouteTemplatePath, subPath)
    const content = fs
      .readFileSync(templateFilePath, 'utf8')
      .replace(/TemplateRouteName/g, routeNameOfPascalCase)
      .replace(/templateRouteName/g, routeNameOfCamelCase)
      .replace(/TemplateParentRouteName/g, rootNameOfPascalCase)
      .replace(/sub-route-path/g, routeNameOfKebabCase.replace(/-/g, '/'))
      .replace(/sub-route-name/g, routeNameOfKebabCase)
      .replace(/root-name/g, rootNameOfKebabCase)

    const generateFilePath = path.join(
      `${process.cwd()}/src/${rootNameOfKebabCase}`,
      subPath
        .replace(/sub-route-name/g, routeNameOfKebabCase)
        .replace(/root-name/g, rootNameOfKebabCase)
    )

    if (!fs.existsSync(generateFilePath))
      fs.writeFileSync(generateFilePath, content, 'utf8')
  }

  console.log(``)
  console.log(
    chalk.green(
      `The sub-router module has been created. ${chalk.gray(routeGeneratePath)}`
    )
  )
  console.log(
    chalk.green(
      `Please add the sub-router module to the app.module. ${chalk.gray(
        path.resolve(`${process.cwd()}/src/app.module.ts`)
      )}`
    )
  )
  console.log(
    chalk.green(
      `(Example code: ${chalk.gray(
        `RouterModule.register([...${rootNameOfPascalCase}Module])`
      )})`
    )
  )
}

main()
