import path from 'node:path'
import fs from 'node:fs'
import { colors } from './color'
import { findRootDir } from './dir'

interface Config {
  packageManager: string
  workspacesDirs: string[]
}

// default config
export const defaultConfig: Config = {
  packageManager: 'npm',
  workspacesDirs: ['packages/*']
}

// Load config
export function loadConfig(): Config {
  const rootDir = findRootDir(defaultConfig.workspacesDirs)
  const configPath = path.join(rootDir, 'workspace.json')
  let config: Config = defaultConfig

  if (fs.existsSync(configPath)) {
    try {
      const userConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
      config = { ...config, ...userConfig }
    } catch (error) {
      console.error(
        `${colors.red}Error reading config file: ${(error as Error).message}${colors.reset}`
      )
    }
  }

  return config
}

export const config = loadConfig()
