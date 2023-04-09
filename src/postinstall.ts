import fs from "fs-extra";
import os from "os";
import path from "path";
import * as defaults from "./defaults.js";

const useTempDir = process.env.NODE_ENV === "test" ? true : false;

const configPath = useTempDir
  ? `${os.tmpdir()}/mknode.json`
  : path.join(os.homedir(), ".config/mknode.json");

await postinstall();

async function postinstall(): Promise<void> {
  if (process.env.LINKING === "1") return;

  if (useTempDir) {
    await fs.promises.open(configPath, "w");
  } else {
    await fs.ensureFile(configPath);
  }

  await fs.writeJSON(configPath, defaults, { spaces: 2 });
}
