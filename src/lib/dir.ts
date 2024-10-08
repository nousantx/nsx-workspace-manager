import path from 'node:path'
import fs from 'node:fs'

export function findRootDir(workspacesDirs: string[] = ['packages/*']): string {
  let currentDir = process.cwd()
  const root = path.parse(currentDir).root

  // Check for any directory that matches the workspace directories
  while (
    !workspacesDirs.some((wsDir) =>
      fs.existsSync(path.join(currentDir, wsDir.replace(/\*/g, '')))
    ) &&
    currentDir !== root
  ) {
    currentDir = path.dirname(currentDir)
  }

  return currentDir !== root ? currentDir : process.cwd()
}
