import ora from "ora";
import {
  createDockerConfig,
  createEsLintConfig,
  createGitignore,
  createPrettierConfig,
  createSrcCode,
  createTsConfigs,
  initPackageJson,
  installDependencies,
  readBootstrapData,
  updatePackageJson,
} from "./lib.js";

export async function bootstrap(
  initArgs: string[],
  cwd: string,
  configPath: string,
): Promise<void> {
  const {
    devDependencies,
    eslintrc,
    eslintignore,
    gitignore,
    indexTs,
    prettierignore,
    prettierrc,
    scripts,
    tsconfig,
    tsconfigBuild,
    dockerfile,
    dockercompose,
    dockerignore,
  } = await readBootstrapData(configPath);

  await initPackageJson(initArgs, cwd);
  await updatePackageJson(scripts, cwd);

  process.stdout.write("\n");
  const spinner = ora("Setting up project...").start();

  try {
    await installDependencies(devDependencies, cwd);
  } catch (error) {
    spinner.text = "Error installing dependencies";
    spinner.fail();
    console.error(error);
    process.exit(1);
  }

  await Promise.all([
    createTsConfigs(tsconfig, tsconfigBuild, cwd),
    createEsLintConfig(eslintrc, eslintignore, cwd),
    createPrettierConfig(prettierrc, prettierignore, cwd),
    createGitignore(gitignore, cwd),
    createSrcCode(indexTs, cwd),
    createDockerConfig(dockerfile, dockercompose, dockerignore, cwd),
  ]);

  spinner.succeed();
  console.log("\n🤠 Bootstrap complete!");
}
