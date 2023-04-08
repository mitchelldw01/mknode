import { spawn } from "child_process";
import fs from "fs-extra";
import path from "path";
import * as defaults from "./defaults.js";

interface Scripts {
  test: string;
  "test:watch": string;
  start: string;
  "start:prod": string;
  build: string;
  lint: string;
  format: string;
}

interface BootstrapData {
  scripts: Scripts;
  devDependencies: string[];
  eslintignore: string;
  eslintrc: Record<string, unknown>;
  gitignore: string;
  indexTs: string;
  prettierignore: string;
  prettierrc: Record<string, unknown>;
  tsconfig: Record<string, unknown>;
  tsconfigBuild: Record<string, unknown>;
  dockerfile: string;
  dockercompose: string;
}

export async function readBootstrapData(configPath: string): Promise<BootstrapData> {
  const data = (await fs.readJSON(configPath)) as BootstrapData;

  return {
    scripts: data.scripts || defaults.scripts,
    devDependencies: data.devDependencies || defaults.devDependencies,
    eslintignore: data.eslintignore || defaults.eslintignore,
    eslintrc: data.eslintrc || defaults.eslintrc,
    gitignore: data.gitignore || defaults.gitignore,
    indexTs: data.indexTs || defaults.indexTs,
    prettierignore: data.prettierignore || defaults.prettierignore,
    prettierrc: data.prettierrc || defaults.prettierrc,
    tsconfig: data.tsconfig || defaults.tsconfig,
    tsconfigBuild: data.tsconfigBuild || defaults.tsconfigBuild,
    dockerfile: data.dockerfile || defaults.dockerfile,
    dockercompose: data.dockercompose || defaults.dockercompose,
  };
}

export async function initPackageJson(args: string[], cwd: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn("npm", ["init", ...args], { cwd });

    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error("Failed to initialize package.json"));
      }
    });

    child.on("error", (error) => reject(error));

    process.stdin.pipe(child.stdin);
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
  });
}

export async function updatePackageJson(scripts: Scripts, cwd: string): Promise<void> {
  const packageJsonPath = path.join(cwd, "package.json");
  const packageJson = await fs.readJson(packageJsonPath);
  const { test, ...other } = scripts;

  packageJson.scripts = {
    test: test === 'echo "Error: no test specified" && exit 1' ? scripts.test : test,
    ...other,
  };

  await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
}

export async function installDependencies(devDependencies: string[], cwd: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn("npm", ["i", "-D", ...devDependencies], { cwd });

    child.on("close", resolve);
    child.on("error", reject);
  });
}

export async function createTsConfigs(
  tsconfig: unknown,
  tsconfigBuild: unknown,
  cwd: string,
): Promise<void> {
  await fs.writeJSON(path.join(cwd, "tsconfig.json"), tsconfig, { spaces: 2 });
  await fs.writeJSON(path.join(cwd, "tsconfig.build.json"), tsconfigBuild, { spaces: 2 });
}

export async function createEsLintConfig(
  eslintrc: unknown,
  eslintignore: string,
  cwd: string,
): Promise<void> {
  await fs.writeJSON(path.join(cwd, ".eslintrc.json"), eslintrc, { spaces: 2 });
  await fs.writeFile(path.join(cwd, ".eslintignore"), eslintignore);
}

export async function createPrettierConfig(
  prettierrc: unknown,
  prettierignore: string,
  cwd: string,
): Promise<void> {
  await fs.writeJSON(path.join(cwd, ".prettierrc"), prettierrc, { spaces: 2 });
  await fs.writeFile(path.join(cwd, ".prettierignore"), prettierignore);
}

export async function createGitignore(gitignore: string, cwd: string): Promise<void> {
  await fs.writeFile(path.join(cwd, ".gitignore"), gitignore);
}

export async function createSrcCode(indexTs: string, cwd: string): Promise<void> {
  await fs.mkdir(path.join(cwd, "src"));
  await fs.writeFile(path.join(cwd, "src/index.ts"), indexTs);
}

export async function createDockerConfig(
  dockerfile: string,
  dockercompose: string,
  cwd: string,
): Promise<void> {
  await fs.writeFile(path.join(cwd, "dockerfile"), dockerfile);
  await fs.writeFile(path.join(cwd, "docker-compose.yml"), dockercompose);
}
