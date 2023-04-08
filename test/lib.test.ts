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
});
