# NWM - aNother Workspace Manager

## Installation

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

4. Interactive mode

```sh
nwm interactive
```
