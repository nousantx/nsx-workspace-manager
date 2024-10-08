import { colors } from './color'
import { config } from './config'
import { searchScripts, displaySearchResults } from './search'
import { listScripts } from './script'
import { runScript } from './runner'
import { interactiveMode } from './interactive'
import { packageJson } from './package'

export function run() {
  const [, , action, ...args] = process.argv
  const useWhat = 'wst'
  const command = `${colors.reset}${colors.dim}  ${useWhat}${colors.reset}${colors.yellow}${colors.bright}`
  const workspaceName = `${colors.dim}${colors.reset}${colors.cyan}${colors.bright}${packageJson.name}${colors.reset} ${colors.dim}v${packageJson.version}${colors.reset}`

  // start the script
  console.log(workspaceName)
  if (action === undefined) {
    console.log(`\n${colors.dim}Usage:${colors.reset}`)
    console.log(
      `${command} list${colors.reset}${colors.dim} # List all scripts from all workspaces${colors.reset}`
    )
    console.log(
      `${command} run <workspace> <script>${colors.reset}${colors.dim} # Run a specific script from a workspace${colors.reset}`
    )
    console.log(
      `${command} search <term>${colors.reset}${colors.dim} # Search for a script by name or content${colors.reset}`
    )
    console.log(
      `${command} interactive${colors.reset}${colors.dim} # Start interactive mode${colors.reset}`
    )
    console.log(`\n${colors.reset}${colors.dim}Examples:${colors.reset}`)
    console.log(`${command} list`)
    console.log(`${command} run core build`)
    console.log(`${command} search test`)
    console.log(`${command} interactive`)
  } else if (action === 'list') {
    listScripts()
  } else if (action === 'run' && args.length >= 2) {
    const [workspace, script] = args
    runScript(workspace, script)
  } else if (action === 'search' && args.length > 0) {
    const results = searchScripts(args.join(' '))
    displaySearchResults(results)
  } else if (action === 'interactive') {
    interactiveMode()
  } else {
    console.log(
      `${colors.red}Invalid command or missing arguments. Use without arguments to see usage.${colors.reset}`
    )
  }
}
