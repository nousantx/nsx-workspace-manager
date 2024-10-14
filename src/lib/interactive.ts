// interactive.ts
import readline from 'node:readline'
import { colors } from './color'
import { searchScripts, displaySearchResults } from './search'
import { listScripts, runScript } from './script'
import { manageDependencies } from './deps'
import { versionWorkspace } from './versioning'

export async function interactiveMode(): Promise<void> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  console.log(`${colors.bright}Interactive Mode${colors.reset}`)
  console.log(
    "Type 'exit' to quit, 'list' to show all scripts, 'search <term>' to search scripts, 'run <workspace> <script>' to run a script, 'add <workspace> [-D] <...packages>' to add dependencies, 'remove <workspace> <...packages>' to remove dependencies, or 'version <workspace>' to update version."
  )

  const promptUser = () => {
    rl.question('> ', async (input) => {
      const [command, ...args] = input.trim().split(' ')

      try {
        switch (command.toLowerCase()) {
          case 'exit':
            rl.close()
            return
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
              await runScript(workspace, script)
            } else {
              console.log(
                `${colors.yellow}Please provide both workspace and script name.${colors.reset}`
              )
            }
            break
          case 'add':
          case 'remove':
            if (args.length >= 2) {
              const [workspace, ...packages] = args
              await manageDependencies(command === 'add' ? 'add' : 'remove', workspace, packages)
            } else {
              console.log(
                `${colors.yellow}Please provide workspace and at least one package name.${colors.reset}`
              )
            }
            break
          case 'version':
            if (args.length === 1) {
              const [workspace] = args
              await versionWorkspace(workspace, rl)
            } else {
              console.log(`${colors.yellow}Please provide a workspace name.${colors.reset}`)
            }
            break
          default:
            console.log(
              `${colors.yellow}Unknown command. Try 'list', 'search', 'run', 'add', 'remove', 'version', or 'exit'.${colors.reset}`
            )
        }
      } catch (error) {
        console.error(`${colors.red}An error occurred:${colors.reset}`, error)
      }

      promptUser() // Prompt for the next command
    })
  }

  promptUser() // Start the prompt loop

  return new Promise((resolve) => {
    rl.on('close', () => {
      console.log(`${colors.bright}Goodbye!${colors.reset}`)
      resolve()
    })
  })
}
