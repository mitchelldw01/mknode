import { afterAll, beforeEach, describe, it } from "vitest";
import { spawn } from "child_process";
import fs from "fs-extra";
import path from "path";
import { homedir } from "os";
import * as defaults from "../src/defaults.js";

const configPath = path.join(homedir(), ".config/mknode.json");

describe("postinstall", () => {
  describe("when config file does not exist", () => {
    beforeEach(async () => {
      await fs.remove(configPath);
    });

    it("should create config file", async ({ expect }) => {
      await npmInstall("n");
      expect(await fs.pathExists(configPath)).toBe(true);
    });

    it("should write defaults to config file", async ({ expect }) => {
      await npmInstall("n");
      expect(await fs.readJSON(configPath)).toEqual({ ...defaults });
    });

    it("should not prompt user", async ({ expect }) => {
      const buffer = await npmInstall("n");
      expect(buffer).not.toContain("This version may include changes to some defaults");
    });
  });

  describe("when config file exists", () => {
    beforeEach(async () => {
      await fs.ensureFile(configPath);
      await fs.writeJSON(configPath, { hello: "world" }, { spaces: 2 });
    });

    afterAll(async () => {
      await npmInstall("y");
    });

    it("should prompt user", async ({ expect }) => {
      const buffer = await npmInstall("n");
      expect(buffer).toContain("This version may include changes to some defaults");
    });

    describe("when user answers yes", () => {
      it("should overwrite config file", async ({ expect }) => {
        await npmInstall("y");
        expect(await fs.readJSON(configPath)).toEqual({ ...defaults });
      });
    });

    describe("when user answers no", () => {
      it("should not overwrite config file", async ({ expect }) => {
        await npmInstall("n");
        expect(await fs.readJSON(configPath)).toEqual({ hello: "world" });
      });
    });
  });
});

async function npmInstall(answer: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const child = spawn("npm", ["i"]);

    let buffer = "";

    child.stdout.on("data", (data) => {
      buffer += data.toString();

      if (buffer.includes("This version may include changes to some defaults")) {
        child.stdin.write(`${answer}\n`);
      }
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve(buffer);
      } else {
        reject(new Error(`Child process exited with code ${code}`));
      }
    });

    child.on("error", (error) => reject(error));
  });
}
