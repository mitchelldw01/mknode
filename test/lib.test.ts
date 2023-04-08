import fs from "fs-extra";
import os from "os";
import { afterEach, beforeEach, describe, it } from "vitest";
import * as defaults from "../src/defaults.js";
import {
  readBootstrapData,
  initPackageJson,
  installDependencies,
  createTsConfigs,
  createEsLintConfig,
  createPrettierConfig,
  createGitignore,
  createSrcCode,
  updatePackageJson,
} from "../src/lib.js";
import { postinstall } from "./util/postinstall.js";

const configPath = `${os.tmpdir()}/mknode.json`;
const projectPath = `${os.tmpdir()}/project`;

describe("lib", () => {
  describe("readBootstrapData", () => {
    describe("when config file is complete", () => {
      beforeEach(async () => {
        await fs.open(configPath, "w");
        await postinstall("y");
      });

      afterEach(async () => {
        await fs.unlink(configPath);
      });

      it("should read the config file", async ({ expect }) => {
        const data = await readBootstrapData(configPath);
        expect(data).toEqual({ ...defaults });
      });
    });

    describe("when config file is partially missing", () => {
      beforeEach(async () => {
        await fs.open(configPath, "w");
        await fs.writeJSON(configPath, { ...defaults, prettierrc: undefined }, { spaces: 2 });
      });

      afterEach(async () => {
        await fs.unlink(configPath);
      });

      it("should replace missing fields with defaults", async ({ expect }) => {
        const data = await readBootstrapData(configPath);
        expect(data).toEqual({ ...defaults, prettierrc: defaults.prettierrc });
      });
    });
  });

  describe("initPackageJson", () => {
    let tempDir: string;

    beforeEach(async () => {
      tempDir = await fs.mkdtemp(projectPath);
    });

    afterEach(async () => {
      await fs.remove(tempDir);
    });

    it("should initialize a new package.json file", async ({ expect }) => {
      await initPackageJson(["-y"], tempDir);
      expect(await fs.pathExists(`${tempDir}/package.json`)).toBe(true);
    });
  });

  describe("updatePackageJson", () => {
    let tempDir: string;

    beforeEach(async () => {
      tempDir = await fs.mkdtemp(projectPath);
    });

    afterEach(async () => {
      await fs.remove(tempDir);
    });

    it("should update package.json scripts", async ({ expect }) => {
      const scripts = {
        test: "test",
        "test:watch": "test:watch",
        start: "start",
        "start:prod": "start:prod",
        build: "build",
        lint: "lint",
        format: "format",
      };

      await initPackageJson(["-y"], tempDir);
      await updatePackageJson(scripts, tempDir);

      const packageJson = await fs.readJSON(`${tempDir}/package.json`);
      expect(packageJson.scripts).toEqual(scripts);
    });
  });

  describe("installDependencies", () => {
    let tempDir: string;

    beforeEach(async () => {
      tempDir = await fs.mkdtemp(projectPath);
    });

    afterEach(async () => {
      await fs.remove(tempDir);
    });

    it("should install development dependencies", async ({ expect }) => {
      await initPackageJson(["-y"], tempDir);
      await installDependencies(["nodemon"], tempDir);

      const packageJson = await fs.readJSON(`${tempDir}/package.json`);
      expect(packageJson.devDependencies).toEqual({ nodemon: expect.any(String) });
    });
  });

  describe("createTsConfigs", () => {
    let tempDir: string;

    beforeEach(async () => {
      tempDir = await fs.mkdtemp(projectPath);
    });

    afterEach(async () => {
      await fs.remove(tempDir);
    });

    it("should create tsconfig.json and tsconfig.eslint.json files", async ({ expect }) => {
      const tsconfig = {
        compilerOptions: {
          target: "es2022",
          module: "es2022",
        },
        exclude: ["test"],
      };

      const tsconfigEsLint = {
        compilerOptions: {
          target: "es2022",
          module: "es2022",
        },
      };

      await createTsConfigs(tsconfig, tsconfigEsLint, tempDir);

      expect(await fs.pathExists(`${tempDir}/tsconfig.json`)).toBe(true);
      expect(await fs.pathExists(`${tempDir}/tsconfig.eslint.json`)).toBe(true);
      expect(await fs.readJSON(`${tempDir}/tsconfig.json`)).toEqual(tsconfig);
      expect(await fs.readJSON(`${tempDir}/tsconfig.eslint.json`)).toEqual(tsconfigEsLint);
    });
  });

  describe("createEsLintConfig", () => {
    let tempDir: string;

    beforeEach(async () => {
      tempDir = await fs.mkdtemp(projectPath);
    });

    afterEach(async () => {
      await fs.remove(tempDir);
    });

    it("should create eslintrc.json and eslintignore files", async ({ expect }) => {
      const eslintrc = {
        parser: "@typescript-eslint/parser",
        plugins: ["@typescript-eslint", "simple-import-sort", "prettier"],
      };

      const eslintignore = "node_modules";

      await createEsLintConfig(eslintrc, eslintignore, tempDir);

      expect(await fs.pathExists(`${tempDir}/.eslintrc.json`)).toBe(true);
      expect(await fs.pathExists(`${tempDir}/.eslintignore`)).toBe(true);
      expect(await fs.readJSON(`${tempDir}/.eslintrc.json`)).toEqual(eslintrc);
      expect(await fs.readFile(`${tempDir}/.eslintignore`, "utf-8")).toEqual(eslintignore);
    });
  });

  describe("createPrettierConfig", () => {
    let tempDir: string;

    beforeEach(async () => {
      tempDir = await fs.mkdtemp(projectPath);
    });

    afterEach(async () => {
      await fs.remove(tempDir);
    });

    it("should create prettierrc and prettierignore files", async ({ expect }) => {
      const prettierrc = {
        printWidth: 100,
        trailingComma: "all",
      };

      const prettierignore = "node_modules";

      await createPrettierConfig(prettierrc, prettierignore, tempDir);

      expect(await fs.pathExists(`${tempDir}/.prettierrc`)).toBe(true);
      expect(await fs.pathExists(`${tempDir}/.prettierignore`)).toBe(true);
      expect(await fs.readJSON(`${tempDir}/.prettierrc`)).toEqual(prettierrc);
      expect(await fs.readFile(`${tempDir}/.prettierignore`, "utf-8")).toEqual(prettierignore);
    });
  });

  describe("createGitIgnore", () => {
    let tempDir: string;

    beforeEach(async () => {
      tempDir = await fs.mkdtemp(projectPath);
    });

    afterEach(async () => {
      await fs.remove(tempDir);
    });

    it("should create a gitignore file", async ({ expect }) => {
      const gitignore = "node_modules";
      await createGitignore(gitignore, tempDir);
      expect(await fs.readFile(`${tempDir}/.gitignore`, "utf-8")).toEqual(gitignore);
    });
  });

  describe("createSrcCode", () => {
    let tempDir: string;

    beforeEach(async () => {
      tempDir = await fs.mkdtemp(projectPath);
    });

    afterEach(async () => {
      await fs.remove(tempDir);
    });

    it("should create src/index.ts", async ({ expect }) => {
      const indexTs = 'console.log("Hello, World!")';
      await createSrcCode(indexTs, tempDir);
      expect(await fs.readFile(`${tempDir}/src/index.ts`, "utf-8")).toEqual(indexTs);
    });
  });
});
