import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  // Ignorar carpetas generadas y dependencias
  {
    ignores: ['**/dist/**', '**/node_modules/**', '**/coverage/**'],
  },
  // Reglas recomendadas de JS y TS
  js.configs.recommended,
  ...tseslint.configs.recommended,
  // Desactiva reglas de ESLint que choquen con Prettier
  prettierConfig,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
      'no-console': 'off',
    },
  },
);
