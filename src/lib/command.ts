import { colors } from './color'
import { searchScripts, displaySearchResults } from './search'
import { listScripts, runScript } from './script'
import { interactiveMode } from './interactive'
import { packageJson } from './package'
import { manageDependencies } from './deps'
import { versionWorkspace } from './versioning'

export function run() {
  const [, , action, ...args] = process.argv
  const useWhat = 'nwm'
  const command = `${colors.reset}${colors.dim}  ${useWhat}${colors.reset}${colors.yellow}${colors.bright}`
  const workspaceName = `${colors.dim}${colors.reset}${colors.cyan}${colors.bright}${packageJson.name}${colors.reset} ${colors.dim}v${packageJson.version}${colors.reset}`

  console.log(workspaceName)

  if (action === undefined || action === 'help') {
    console.log(`\n${colors.dim}Usage:${colors.reset}`)
    console.log(
      `${command} list${colors.reset}${colors.dim} # List all scripts from all workspaces${colors.reset}`
    )
    console.log(
      `${command} search <term>${colors.reset}${colors.dim} # Search available scripts by name or content${colors.reset}`
    )
    console.log(
      `${command} run <workspace> <script>${colors.reset}${colors.dim} # Run specific script from a workspace${colors.reset}`
    )
    console.log(
      `${command} add <workspace> [<-D>] <...packages>${colors.reset}${colors.dim} # Add dependencies to a workspace${colors.reset}`
    )
    console.log(
      `${command} remove <workspace> <...packages>${colors.reset}${colors.dim} # Remove dependencies from a workspace${colors.reset}`
    )
    console.log(
      `${command} version <workspace>${colors.reset}${colors.dim} # Update version of a workspace${colors.reset}`
    )
    console.log(
      `${command} interactive${colors.reset}${colors.dim} # Start interactive mode${colors.reset}`
    )
    console.log(`${command} help${colors.reset}${colors.dim} # Show this message${colors.reset}`)
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
  }
  // Added dependencies installer/remover and version manager features
  else if ((action === 'add' || action === 'remove') && args.length >= 2) {
    const [workspace, ...packages] = args
    manageDependencies(action, workspace, packages)
  } else if (action === 'version' && args.length === 1) {
    const [workspace] = args
    versionWorkspace(workspace)
  } else {
    console.log(
      `${colors.red}Invalid command or missing arguments. Try \`help\` command to see available commands.${colors.reset}`
    )
  }
}
