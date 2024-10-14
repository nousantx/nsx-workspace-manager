import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'

const name = 'someutils'

const prod = [
  {
    file: 'dist/index.cjs',
    format: 'cjs'
  },
  {
    file: 'dist/index.min.cjs',
    format: 'cjs',
    plugins: [terser()]
  },
  {
    file: 'dist/index.js',
    format: 'esm'
  }
]

const config = {
  input: 'src/index.ts',
  output: [
    ...prod,
    {
      file: 'dist/index.min.js',
      format: 'esm',
      plugins: [terser()]
    }
  ],
  plugins: [typescript(), resolve(), commonjs()]
}

export default config
