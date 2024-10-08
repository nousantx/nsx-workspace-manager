import path from 'node:path'
import fs from 'node:fs'
import { colors } from './color'
import { getScripts } from './script'
import { getPackages } from './package'

interface SearchResult {
  workspace: string
  name: string
  command: string
}

// New search scripts function
export function searchScripts(searchTerm: string): SearchResult[] {
  const packages = getPackages()
  const results: SearchResult[] = []

  packages.forEach(({ name, path }) => {
    const scripts = getScripts(path)

    Object.entries(scripts).forEach(([scriptName, scriptCmd]) => {
      if (scriptName.includes(searchTerm) || scriptCmd.includes(searchTerm)) {
        results.push({ workspace: name, name: scriptName, command: scriptCmd })
      }
    })
  })
  return results
}

// Display all available scripts with the term
export function displaySearchResults(results: SearchResult[]): void {
  if (results.length === 0) {
    console.log(`${colors.yellow}No matching scripts found.${colors.reset}`)

    return
  }

  console.log(`${colors.bright}Search results:${colors.reset}\n`)

  results.forEach(({ workspace, name, command }) => {
    console.log(`${colors.cyan}${workspace}${colors.reset} > ${colors.green}${name}${colors.reset}`)
    console.log(`${colors.dim}  ${command}${colors.reset}\n`)
  })
}
