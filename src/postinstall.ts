import fs from "fs-extra";
import inquirer from "inquirer";
import * as defaults from "./defaults.js";
import { homedir } from "os";
import path from "path";

export const configPath = path.join(homedir(), ".config/mknode.json");

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
    await fs.ensureFile(configPath);
    await fs.writeJSON(configPath, defaults, { spaces: 2 });
  }
}
