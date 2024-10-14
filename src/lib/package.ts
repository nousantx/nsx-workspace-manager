import path from 'node:path'
import fs from 'node:fs'
import { config } from './config'
import { findRootDir } from './dir'
import { resolveWorkspaces } from './pattern'

interface Package {
  name: string
  path: string
}

const readPackageJson = (dir: string): any => {
  const packageJsonPath = path.join(dir, 'package.json')
  return fs.existsSync(packageJsonPath)
    ? JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
    : null
}

export const packageJson = readPackageJson(findRootDir(config.workspacesDirs))

export function getPackages(): Package[] {
  const rootDir = findRootDir(config.workspacesDirs)

  return config.workspacesDirs.flatMap((workspaceDir) => {
    return resolveWorkspaces(workspaceDir, rootDir)
      .filter((dir) => fs.existsSync(dir) && fs.lstatSync(dir).isDirectory())
      .map((dir) => {
        const pkg = readPackageJson(dir)
        return pkg ? { name: pkg.name || path.basename(dir), path: dir } : null
      })
      .filter(Boolean) // Removes null entries
  })
}
