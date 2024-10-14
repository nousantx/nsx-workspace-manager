import fs from 'node:fs'
import path from 'node:path'
import readline from 'node:readline'
import { getPackages } from './package'
import { colors } from './color'

const versionOptions: { name: string; value: string }[] = [
  { name: 'Patch', value: 'patch' },
  { name: 'Minor', value: 'minor' },
  { name: 'Major', value: 'major' },
  { name: 'Prepatch', value: 'prepatch' },
  { name: 'Preminor', value: 'preminor' },
  { name: 'Premajor', value: 'premajor' },
  { name: 'Custom Version', value: 'custom' }
]

function incrementVersion(version: string, type: string): string {
  const [versionPart, prereleasePart] = version.split('-')
  const [major, minor, patch] = versionPart.split('.').map(Number)
  const isPrerelease = !!prereleasePart
  const [prereleaseName, prereleaseNumber] = (prereleasePart || '').split('.')

  switch (type) {
    case 'patch':
      return isPrerelease ? `${major}.${minor}.${patch}` : `${major}.${minor}.${patch + 1}`
    case 'minor':
      return `${major}.${minor + 1}.0`
    case 'major':
      return `${major + 1}.0.0`
    case 'prepatch':
      if (isPrerelease) {
        const newPrereleaseNumber = parseInt(prereleaseNumber || '0', 10) + 1
        return `${major}.${minor}.${patch}-${prereleaseName}.${newPrereleaseNumber}`
      }
      return `${major}.${minor}.${patch + 1}-alpha.0`
    case 'preminor':
      return `${major}.${minor + 1}.0-alpha.0`
    case 'premajor':
      return `${major + 1}.0.0-alpha.0`
    default:
      return version
  }
}

function isValidVersion(version: string): boolean {
  const validVersionRegex = /^\d+\.\d+\.\d+(-[a-z]+\.\d+)?$/
  return validVersionRegex.test(version)
}

async function promptForVersion(currentVersion: string, rl: readline.Interface): Promise<string> {
  console.log(
    `\n${colors.cyan}Current version:${colors.reset} ${colors.yellow}${currentVersion}${colors.reset}`
  )
  console.log(`${colors.cyan}Select a new version:${colors.reset}`)

  versionOptions.forEach((option, index) => {
    const simulatedVersion =
      option.value !== 'custom' ? incrementVersion(currentVersion, option.value) : '{custom}'
    console.log(
      `${colors.dim}${index + 1})${colors.reset} ${colors.yellow}${option.name}${colors.reset} ${
        colors.dim
      }(${simulatedVersion})${colors.reset}`
    )
  })

  const answer = await new Promise<string>((resolve) => {
    rl.question(`${colors.cyan}Enter number:${colors.reset} `, resolve)
  })

  const choice = parseInt(answer, 10) - 1

  if (choice >= 0 && choice < versionOptions.length - 1) {
    return incrementVersion(currentVersion, versionOptions[choice].value)
  } else if (choice === versionOptions.length - 1) {
    let customVersion: string

    while (true) {
      customVersion = await new Promise<string>((resolve) => {
        rl.question(`${colors.cyan}Enter custom version:${colors.reset} `, resolve)
      })

      // validate the custom version
      if (isValidVersion(customVersion)) {
        break
      } else {
        console.log(
          `${colors.red}Invalid version format. Please enter valid version. (e.g. 1.0.0 or 1.0.0-alpha.0)${colors.reset}`
        )
      }
    }
    return customVersion
  } else {
    console.log(`${colors.red}Invalid choice. Nothing changed.${colors.reset}`)
    return currentVersion
  }
}

export async function versionWorkspace(
  workspaceName: string,
  rl?: readline.Interface
): Promise<void> {
  const packages = getPackages()
  const workspace = packages.find((pkg) => pkg.name === workspaceName)

  if (!workspace) {
    console.log(`${colors.red}Workspace "${workspaceName}" not found.${colors.reset}`)
    return
  }

  const packageJsonPath = path.join(workspace.path, 'package.json')
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
  const currentVersion = packageJson.version || '0.0.0'

  /**
   * Support both interactive mode and direct mode
   *
   * If `rl` argument isn't filled, pretend not using interactive mode, -
   * and if done, only close `readline` for direct mode, not interactive mode.
   */

  let createRl: readline.Interface | undefined
  if (!rl) {
    createRl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })
    rl = createRl
  }
  const newVersion = await promptForVersion(currentVersion, rl)
  // close rl in direct mode
  if (createRl) createRl.close()

  packageJson.version = newVersion
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))

  console.log(`${colors.green}Updated ${workspaceName} to version ${newVersion}${colors.reset}`)
}
