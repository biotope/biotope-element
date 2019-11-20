import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import progress from 'rollup-plugin-progress';
import visualizer from 'rollup-plugin-visualizer';
import babel from 'rollup-plugin-babel';
import { uglify } from 'rollup-plugin-uglify';

// eslint-disable-next-line import/no-default-export
export default [
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
      visualizer(),
    ],
  },
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
    input: 'src/min.ts',
    context: 'null',
    moduleContext: 'null',
    output: {
      name: 'index.min',
      file: 'lib/biotope-element.min.js',
      format: 'iife',
    },
    plugins: [
      progress(),
      resolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.min.json',
        clean: true,
      }),
      babel({
        babelrc: false,
        extensions: ['.js', '.ts'],
        presets: ['@babel/preset-env'],
      }),
      uglify(),
      visualizer(),
    ],
  },
];
