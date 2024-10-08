import path from 'node:path'
import fs from 'node:fs'
import readline from 'node:readline'
import { colors } from './color'
import { searchScripts, displaySearchResults } from './search'
import { listScripts } from './script'
import { runScript } from './runner'

export function interactiveMode(): void {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  console.log(`${colors.bright}Interactive Mode${colors.reset}`)
  console.log(
    "Type 'exit' to quit, 'list' to show all scripts, or 'search <term>' to search scripts."
  )

  rl.prompt()
  rl.on('line', (input) => {
    const [command, ...args] = input.trim().split(' ')

    switch (command.toLowerCase()) {
      case 'exit':
        rl.close()
        break

      case 'list':
        listScripts()
        break

      case 'search':
        if (args.length > 0) {
          const results = searchScripts(args.join(' '))

          displaySearchResults(results)
        } else {
          console.log(`${colors.yellow}Please provide a search term.${colors.reset}`)
        }
        break

      case 'run':
        if (args.length >= 2) {
          const [workspace, script] = args
          runScript(workspace, script)
        } else {
          console.log(
            `${colors.yellow}Please provide both workspace and script name.${colors.reset}`
          )
        }
        break

      default:
        console.log(
          `${colors.yellow}Unknown command. Try 'list', 'search', 'run', or 'exit'.${colors.reset}`
        )
    }

    rl.prompt()
  }).on('close', () => {
    console.log(`${colors.bright}Goodbye!${colors.reset}`)
    process.exit(0)
  })
}
