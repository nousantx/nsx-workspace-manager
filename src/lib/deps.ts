import { execSync } from 'node:child_process'
import { colors } from './color'
import { config } from './config'
import { findRootDir } from './dir'

function installCommand(
  packageManager: string,
  workspace: string,
  packages: string[],
  isDev: boolean
): string {
  const devFlag = isDev ? '--save-dev' : ''
  switch (packageManager.toLowerCase()) {
    case 'npm':
      return `npm install ${devFlag} ${packages.join(' ')} --workspace=${workspace}`
    case 'yarn':
      return `yarn workspace ${workspace} ${devFlag} add ${packages.join(' ')}`
    case 'pnpm':
      return `pnpm add --filter ${workspace} ${packages.join(' ')} ${devFlag}`
    default:
      console.warn(
        `${colors.yellow}Warning: Unknown package manager "${packageManager}". Defaulting to npm.${colors.reset}`
      )
      return `npm install ${devFlag} ${packages.join(' ')} --workspace=${workspace}`
  }
}

export function installDependencies(workspace: string, args: string[]): void {
  const isDev = args.includes('-D') || args.includes('--save-dev')
  const packages = args.filter((arg) => arg !== '-D' && arg !== '--save-dev')

  if (packages.length === 0) {
    console.error(`${colors.red}Error: No packages specified for installation.${colors.reset}`)
    return
  }

  const rootDir = findRootDir(config.workspacesDirs)
  // const workspacePath = path.join(rootDir, 'packages', workspace)

  const command = installCommand(config.packageManager, workspace, packages, isDev)
  const startTime = process.hrtime()

  console.log(`${colors.dim}> ${command}${colors.reset}`)

  try {
    execSync(command, { stdio: 'inherit', cwd: rootDir })
    const [seconds, nanoseconds] = process.hrtime(startTime)
    const duration = (seconds * 1000 + nanoseconds / 1e6).toFixed(2)
    console.log(`${colors.green}Packages installed successfully in ${duration}ms${colors.reset}`)
  } catch (error) {
    console.error(
      `${colors.red}Error installing packages: ${(error as Error).message}${colors.reset}`
    )
  }
}

function uninstallCommand(packageManager: string, workspace: string, packages: string[]): string {
  switch (packageManager.toLowerCase()) {
    case 'npm':
      return `npm uninstall ${packages.join(' ')} --workspace=${workspace}`
    case 'yarn':
      return `yarn workspace ${workspace} remove ${packages.join(' ')}`
    case 'pnpm':
      return `pnpm remove --filter ${workspace} ${packages.join(' ')}`
    default:
      console.warn(
        `${colors.yellow}Warning: Unknown package manager "${packageManager}". Defaulting to npm.${colors.reset}`
      )
      return `npm uninstall ${packages.join(' ')} --workspace=${workspace}`
  }
}

export function removeDependencies(workspace: string, packages: string[]): void {
  if (packages.length === 0) {
    console.error(`${colors.red}Error: No packages specified for removal.${colors.reset}`)
    return
  }

  const rootDir = findRootDir(config.workspacesDirs)
  const command = uninstallCommand(config.packageManager, workspace, packages)
  const startTime = process.hrtime()

  console.log(`${colors.dim}> ${command}${colors.reset}`)

  try {
    execSync(command, { stdio: 'inherit', cwd: rootDir })
    const [seconds, nanoseconds] = process.hrtime(startTime)
    const duration = (seconds * 1000 + nanoseconds / 1e6).toFixed(2)
    console.log(`${colors.green}Packages removed successfully in ${duration}ms${colors.reset}`)
  } catch (error) {
    console.error(
      `${colors.red}Error removing packages: ${(error as Error).message}${colors.reset}`
    )
  }
}

export function manageDependencies(
  action: 'add' | 'remove',
  workspace: string,
  args: string[]
): void {
  if (action === 'add') {
    installDependencies(workspace, args)
  } else if (action === 'remove') {
    removeDependencies(workspace, args)
  } else {
    console.error(`${colors.red}Invalid action: ${action}. Use 'add' or 'remove'.${colors.reset}`)
  }
}
