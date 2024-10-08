import path from 'node:path'
import fs from 'node:fs'
import { execSync } from 'node:child_process'
import { colors } from './color'
import { config } from './config'

function getPackageManagerCommand(
  packageManager: string,
  workspace: string,
  scriptName: string
): string {
  switch (packageManager.toLowerCase()) {
    case 'npm':
      return `npm run ${scriptName} --workspace=${workspace}`

    case 'yarn':
      return `yarn workspace ${workspace} run ${scriptName}`

    // not too recommended, use pnpm-workspace instead 🗿
    case 'pnpm':
      return `pnpm --filter ${workspace} run ${scriptName}`

    default:
      console.warn(
        `${colors.yellow}Warning: Unknown package manager "${packageManager}". Defaulting to npm.${colors.reset}`
      )

      return `npm run ${scriptName} --workspace=${workspace}`
  }
}

export function runScript(workspace: string, scriptName: string): void {
  const command = getPackageManagerCommand(config.packageManager, workspace, scriptName)
  const startTime = process.hrtime()

  console.log(`${colors.dim}> ${command}${colors.reset}`)

  try {
    execSync(command, { stdio: 'inherit' })
    if (config.packageManager === 'npm' || config.packageManager === 'pnpm') {
      const [seconds, nanoseconds] = process.hrtime(startTime)
      const duration = (seconds * 1000 + nanoseconds / 1e6).toFixed(2)

      console.log(`${colors.green}Done in ${duration}ms${colors.reset}`)
    }
  } catch (error) {
    console.error(`${colors.red}Error executing script: ${(error as Error).message}${colors.reset}`)
  }
}
