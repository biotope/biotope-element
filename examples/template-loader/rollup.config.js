import typescript from 'rollup-plugin-typescript';

// eslint-disable-next-line import/no-default-export
export default {
  input: './index.ts',
  output: {
    file: 'lib/index.js',
    format: 'cjs',
  },
  plugins: [
    typescript(),
  ],
};
