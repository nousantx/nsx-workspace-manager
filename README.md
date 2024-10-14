# NWM - aNother Workspace Manager

## Installation

<<<<<<< HEAD
`npm i -g @nousantx/nwm`

### Usage

```
▶ nwm
@nousantx/nwm v1.1.0

Usage:
  nwm list # List all scripts from all workspaces
  nwm search <term> # Search available scripts by name or content
  nwm run <workspace> <script> # Run specific script from a workspace
  nwm add <workspace> [<-D>] <...packages> # Add dependencies to a workspace
  nwm remove <workspace> <...packages> # Remove dependencies from a workspace
  nwm version <workspace> # Update version of a workspace
  nwm interactive # Start interactive mode
  nwm help # Show this message
```

=======
```sh
npm i -g @nousantx/nwm
```

## Configuration

Create a `workspaces.json` file inside your root directory and use this example :

```json
{
  "packageManager": "yarn",
  "workspacesDirs": ["packages/a", "apps/*"]
}
```

- `packageManager`: `npm | yarn | pnpm`

- `workspacesDirs`: `string[]`

## Usage

>>>>>>> 8493a6e86aaccaa1575eec9b850ab2e379fa7ed4
1. List all scripts

```sh
nwm list
```

2. Search scripts

```sh
nwm search <term>
```

Example :

```sh
nwm search build
```

3. Run a script

```sh
nwm run <workspace> <script>
```

Example :

```sh
nwm run core build
```

<<<<<<< HEAD
4. Add/Remove dependencies

Adding dependencies:

```sh
nwm add package-a -D tenoxui @tenoxui/property
```

Removing dependencies:

```sh
nwm remove package-a tenoxui
```

5. Version control

```sh
nwm version package-a
```

=======
>>>>>>> 8493a6e86aaccaa1575eec9b850ab2e379fa7ed4
4. Interactive mode

```sh
nwm interactive
```
