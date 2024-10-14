import path from 'node:path'
import fs from 'node:fs'

export function matchPattern(pattern: string, dirName: string): boolean {
  return pattern === '*' || pattern === dirName
}

export function resolveWorkspaces(pattern: string, baseDir: string): string[] {
  const [rootPart, ...restParts] = pattern.split(path.sep)
  const subPattern = restParts.join(path.sep)

  return fs
    .readdirSync(baseDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory() && matchPattern(rootPart, dirent.name))
    .reduce<string[]>((results, dirent) => {
      const fullPath = path.join(baseDir, dirent.name)
      return subPattern
        ? results.concat(resolveWorkspaces(subPattern, fullPath))
        : results.concat(fullPath)
    }, [])
}
