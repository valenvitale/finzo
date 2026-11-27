import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';

export default defineConfig([
  // 1. Archivos y carpetas ignoradas globalmente
  {
    ignores: ['**/dist/**', '**/node_modules/**', '**/coverage/**', '**/.vscode/**'],
  },

  // 2. Reglas recomendadas base (JS y TypeScript)
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // 3. Reglas comunes a todo el proyecto (Frontend + Backend)
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
      ],
      '@typescript-eslint/no-import-type-side-effects': 'warn',
    },
  },

  // 4. Configuración específica para el FRONTEND (React + Vite)
  {
    files: ['frontend/**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },

  // 5. Configuración específica para el BACKEND (Node.js + Express)
  {
    files: ['backend/**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'no-console': 'off',
    },
  },

  // 6. Scripts raíz y configs
  {
    files: ['*.config.{js,ts}', '*.config.mjs'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  // 7. Prettier al final para apagar reglas de formato redundantes
  prettierConfig,
]);
