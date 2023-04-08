export const scripts = {
  test: "vitest run",
  "test:watch": "vitest",
  start: "ts-node src/index.ts",
  "start:prod": "node dist/index.js",
  build: "tsc --project tsconfig.build.json",
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
    esModuleInterop: true,
    forceConsistentCasingInFileNames: true,
    strict: true,
    skipLibCheck: true,
  },
  exclude: ["dist"],
  "ts-node": {
    esm: true,
  },
};

export const tsconfigBuild = {
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
  exclude: ["dist", "test", "**/*.test.ts"],
};

export const eslintrc = {
  env: {
    browser: true,
    es2022: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  overrides: [],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: "tsconfig.json",
  },
  plugins: ["@typescript-eslint", "simple-import-sort", "prettier"],
  rules: {
    "prettier/prettier": "error",
    "sort-imports": "off",
    "simple-import-sort/exports": "error",
    "simple-import-sort/imports": [
      "error",
      {
        groups: [["^\\u0000", "^@?\\w", "^[^.]", "^\\."]],
      },
    ],
  },
};

export const eslintignore = "/node_modules\n/dist\n";

export const prettierrc = {
  printWidth: 100,
  trailingComma: "all",
};

export const prettierignore = "/node_modules\n/dist\n";

export const gitignore = "/node_modules\n/dist\n*.env\n!.env.example\n";

export const indexTs = 'console.log("Hello, World!");\n';

export const dockerfile = `FROM node:19-alpine

WORKDIR /app

COPY package*.json .

EXPOSE 3000

ENV NODE_ENV=development

RUN npm install

COPY . .

CMD ["npm", "start"]
`;

export const dockercompose = `version: "3.9"

services:
  app:
    build: .
    volumes:
      - .:/app
      - /app/node_modules
      - /app/dist
    ports:
      - "3000:3000"
    stdin_open: true
    tty: true
`;

export const dockerignore = "/node_modules\n/dist\n";
