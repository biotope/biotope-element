import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import progress from 'rollup-plugin-progress';
import visualizer from 'rollup-plugin-visualizer';

// eslint-disable-next-line import/no-default-export
export default [
  {
    input: 'src/index.ts',
    context: 'null',
    moduleContext: 'null',
    output: {
      name: 'index.cjs',
      file: 'lib/cjs/index.js',
      format: 'cjs',
    },
    plugins: [
      progress(),
      resolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        clean: true,
      }),
      visualizer(),
    ],
  },
  {
    input: 'src/index.ts',
    context: 'null',
    moduleContext: 'null',
    output: {
      name: 'index.esm',
      file: 'lib/esm/index.js',
      format: 'esm',
    },
    plugins: [
      progress(),
      resolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        clean: true,
      }),
    ],
  },
];
