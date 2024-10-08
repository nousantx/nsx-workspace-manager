import path from 'node:path'
import fs from 'node:fs'

export function matchPattern(pattern: string, dirName: string): boolean {
  if (pattern === '*') return true
  return pattern === dirName
}

export function resolveWorkspaces(pattern: string, baseDir: string): string[] {
  const parts = pattern.split(path.sep)
  const rootPart = parts[0]
  const subPattern = parts.slice(1).join(path.sep)

  let results: string[] = []

  // Read all directories from the baseDir
  const dirContent = fs.readdirSync(baseDir, { withFileTypes: true })

  dirContent.forEach((dirent) => {
    if (dirent.isDirectory() && matchPattern(rootPart, dirent.name)) {
      const fullPath = path.join(baseDir, dirent.name)

      // If there's no more sub-pattern to match, it's a final match
      if (!subPattern) {
        results.push(fullPath)
      } else {
        // Recurse into the directory to match the rest of the pattern
        results = results.concat(resolveWorkspaces(subPattern, fullPath))
      }
    }
  })

  return results
}
