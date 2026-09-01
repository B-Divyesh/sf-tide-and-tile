import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist/**', 'node_modules/**', '.factory/evidence/**'] },
  ...tseslint.configs.recommended,
);
