import fs from "fs-extra";
import os from "os";
import { afterEach, beforeEach, describe, it, vi } from "vitest";
import { bootstrap } from "../src/bootstrap.js";
import * as lib from "../src/lib.js";
import { postinstall } from "./util/postinstall.js";

const configPath = `${os.tmpdir()}/mknode.json`;
const projectPath = `${os.tmpdir()}/project`;

describe("bootstrap", () => {
  beforeEach(async () => {
    mockLib();
    await fs.open(configPath, "w");
    await fs.open(projectPath, "w");
    await postinstall("y");
  });

  afterEach(async () => {
    vi.resetAllMocks();
    await fs.unlink(configPath);
    await fs.unlink(projectPath);
  });

  it("calls initPackageJson with args and cwd", async ({ expect }) => {
    const spy = vi.spyOn(lib, "initPackageJson");
    await bootstrap(["y"], projectPath, configPath);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(["y"], projectPath);
  });

  it("calls updatePackageJson with scripts and cwd", async ({ expect }) => {
    const spy = vi.spyOn(lib, "updatePackageJson");
    await bootstrap(["y"], projectPath, configPath);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({ scripts: true }, projectPath);
  });

  it("calls installDependencies with dependencies and cwd", async ({ expect }) => {
    const spy = vi.spyOn(lib, "installDependencies");
    await bootstrap(["y"], projectPath, configPath);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(["nodemon"], projectPath);
  });

  it("calls createTsConfigs with tsconfig, tsconfigEsLint and cwd", async ({ expect }) => {
    const spy = vi.spyOn(lib, "createTsConfigs");
    await bootstrap(["y"], projectPath, configPath);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({ tsconfig: true }, { tsconfigBuild: true }, projectPath);
  });

  it("calls createEsLintConfig with eslintrc, eslintignore and cwd", async ({ expect }) => {
    const spy = vi.spyOn(lib, "createEsLintConfig");
    await bootstrap(["y"], projectPath, configPath);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({ eslintrc: true }, "eslintignore", projectPath);
  });

  it("calls createPrettierConfig with prettierrc, prettierignore and cwd", async ({ expect }) => {
    const spy = vi.spyOn(lib, "createPrettierConfig");
    await bootstrap(["y"], projectPath, configPath);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({ prettierrc: true }, "prettierignore", projectPath);
  });

  it("calls createGitignore with gitignore and cwd", async ({ expect }) => {
    const spy = vi.spyOn(lib, "createGitignore");
    await bootstrap(["y"], projectPath, configPath);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith("gitignore", projectPath);
  });

  it("calls createSrcCode with cwd", async ({ expect }) => {
    const spy = vi.spyOn(lib, "createSrcCode");
    await bootstrap(["y"], projectPath, configPath);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith("indexTs", projectPath);
  });

  it("calls createDockerfile with dockerfile, dockercompose and cwd", async ({ expect }) => {
    const spy = vi.spyOn(lib, "createDockerConfig");
    await bootstrap(["y"], projectPath, configPath);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith("dockerfile", "dockercompose", projectPath);
  });
});

function mockLib() {
  vi.mock("../src/lib.js", () => {
    return {
      initPackageJson: () => 0,
      updatePackageJson: () => 0,
      createTsConfigs: () => 0,
      createEsLintConfig: () => 0,
      createPrettierConfig: () => 0,
      createGitignore: () => 0,
      createSrcCode: () => 0,
      createDockerConfig: () => 0,
      installDependencies: () => 0,
      readBootstrapData: () => {
        return {
          devDependencies: ["nodemon"],
          eslintrc: { eslintrc: true },
          eslintignore: "eslintignore",
          gitignore: "gitignore",
          indexTs: "indexTs",
          prettierignore: "prettierignore",
          prettierrc: { prettierrc: true },
          scripts: { scripts: true },
          tsconfig: { tsconfig: true },
          tsconfigBuild: { tsconfigBuild: true },
          dockerfile: "dockerfile",
          dockercompose: "dockercompose",
        };
      },
    };
  });
}
