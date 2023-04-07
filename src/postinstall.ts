import fs from "fs-extra";
import inquirer from "inquirer";
import * as defaults from "./defaults.js";
import os from "os";
import path from "path";

const useTempDir = process.env.NODE_ENV === "test" ? true : false;

const configPath = useTempDir
  ? `${os.tmpdir()}/mknode.json`
  : path.join(os.homedir(), ".config/mknode.json");

await postinstall();

async function postinstall(): Promise<void> {
  if (process.env.LINKING === "1") return;

  if (await fs.pathExists(configPath)) {
    const question = {
      type: "confirm",
      name: "answer",
      message:
        "This version may include changes to some defaults, do you want to update them? Doing so will overwrite your current config.",
      default: false,
    };

    const { answer } = await inquirer.prompt([question]);

    if (answer === true) {
      await fs.writeJSON(configPath, defaults, { spaces: 2 });
    }
  } else {
    if (useTempDir) {
      await fs.promises.open(configPath, "w");
    } else {
      await fs.ensureFile(configPath);
    }

    await fs.writeJSON(configPath, defaults, { spaces: 2 });
  }
}
