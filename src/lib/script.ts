import fs from 'node:fs'
import path from 'node:path'
import { colors } from './color'
import { getPackages } from './package'

export function getScripts(packagePath: string): { [key: string]: string } {
  const packageJsonPath = path.join(packagePath, 'package.json')

  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
    return packageJson.scripts || {}
  }

  return {}
}

export function listScripts(): void {
  const packages = getPackages()

  packages.forEach(({ name, path: packagePath }) => {
    const scripts = getScripts(packagePath)

    console.log(
      `${colors.dim}— workspace:${colors.reset}${colors.bright}${colors.cyan}${name}${colors.reset}`
    )
    if (Object.keys(scripts).length > 0) {
      Object.entries(scripts).forEach(([scriptName, scriptCmd]) => {
        console.log(
          `${colors.dim}> ${colors.reset}${colors.green}${scriptName}${colors.reset}${colors.dim}: ${scriptCmd}${colors.reset}`
        )
      })
    } else {
      console.log(`${colors.yellow}─ No scripts found.${colors.reset}`)
    }
    console.log()
  })
}
