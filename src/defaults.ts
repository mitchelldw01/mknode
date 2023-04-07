export const scripts = {
  test: "vitest run",
  "test:watch": "vitest",
  start: "ts-node src/index.ts",
  "start:prod": "node dist/index.ts",
  build: "ts-node scripts/build.ts",
  lint: "eslint .",
  format: "eslint --fix .",
};

export const devDependencies = [
  "@types/node",
  "@typescript-eslint/eslint-plugin",
  "@typescript-eslint/parser",
  "eslint",
  "eslint-config-prettier",
  "eslint-plugin-prettier",
  "eslint-plugin-simple-import-sort",
  "prettier",
  "ts-node",
  "typescript",
  "vitest",
];

export const tsconfig = {
  compilerOptions: {
    target: "es2022",
    module: "es2022",
    moduleResolution: "node",
    outDir: "dist",
    esModuleInterop: true,
    forceConsistentCasingInFileNames: true,
    strict: true,
    skipLibCheck: true,
  },
  exclude: ["dist", "**/*.test.ts"],
  "ts-node": {
    esm: true,
  },
};

export const tsconfigEsLint = {
  compilerOptions: {
    target: "es2022",
    module: "es2022",
    moduleResolution: "node",
    esModuleInterop: true,
    forceConsistentCasingInFileNames: true,
    strict: true,
    skipLibCheck: true,
  },
  exclude: ["dist", "**/*.test.ts"],
};

export const eslintrc = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
    ecmaFeatures: {
      jsx: false,
    },
  },
  plugins: ["@typescript-eslint", "simple-import-sort", "prettier"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "plugin:eslint-comments/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/ignore",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "plugin:eslint-comments/recommended",
  ],
};

export const eslintignore = "/node_modules\n/dist\n";

export const prettierrc = {
  printWidth: 100,
  trailingComma: "all",
};

export const prettierignore = "/node_modules\n/dist\n";

export const gitignore = "/node_modules\n/dist\n*.env\n!.env.example\n";

export const indexTs = 'console.log("Hello, World!");\n';
