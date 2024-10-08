import path from 'node:path'
import fs from 'node:fs'
import { config } from './config'
import { findRootDir } from './dir'
import { resolveWorkspaces } from './pattern'

interface Package {
  name: string
  path: string
}

export const packageJson = JSON.parse(
  fs.readFileSync(path.join(findRootDir(config.workspacesDirs), 'package.json'), 'utf-8')
)

export function getPackages(): Package[] {
  const rootDir = findRootDir(config.workspacesDirs)
  let allPackages: Package[] = []

  config.workspacesDirs.forEach((workspaceDir) => {
    const matchedDirs = resolveWorkspaces(workspaceDir, rootDir)

    matchedDirs.forEach((dir) => {
      if (fs.existsSync(dir) && fs.lstatSync(dir).isDirectory()) {
        const packageJsonPath = path.join(dir, 'package.json')
        if (fs.existsSync(packageJsonPath)) {
          const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
          allPackages.push({
            name: packageJson.name || path.basename(dir),
            path: dir
          })
        }
      }
    })
  })

  return allPackages
}
