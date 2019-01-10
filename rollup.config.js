import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import progress from 'rollup-plugin-progress';
import visualizer from 'rollup-plugin-visualizer';


export default [
	{
		input: 'src/index.ts',
		output: {
			name: 'index.cjs',
			file: 'lib/cjs/index.js',
			format: 'cjs'
		},
		plugins: [
			progress(),
			resolve(),
			commonjs(),
			typescript({ tsconfig: './tsconfig.json' }),
			visualizer()
		]
	},
	{
		input: 'src/index.ts',
		output: {
			name: 'index.esm',
			file: 'lib/esm/index.js',
			format: 'esm'
		},
		plugins: [
			progress(),
			resolve(),
			commonjs(),
			typescript({ tsconfig: './tsconfig.json' })
		]
	}
];
