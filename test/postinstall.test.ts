import fs from "fs-extra";
import os from "os";
import { beforeEach, describe, it } from "vitest";
import * as defaults from "../src/defaults.js";
import { postinstall } from "./util/postinstall.js";

const configPath = `${os.tmpdir()}/mknode.json`;

describe("postinstall", () => {
  beforeEach(async () => {
    if (await fs.pathExists(configPath)) {
      await fs.unlink(configPath);
    }
  });

  describe("when config file does not exist", () => {
    it("should create config file", async ({ expect }) => {
      const buffer = await postinstall();
      console.log(buffer);
      expect(await fs.pathExists(configPath)).toBe(true);
    });

    it("should write defaults to config file", async ({ expect }) => {
      await postinstall();
      expect(await fs.readJSON(configPath)).toEqual({ ...defaults });
    });
  });

  describe("when config file exists", () => {
    beforeEach(async () => {
      await fs.open(configPath, "w");
      await fs.writeJSON(configPath, { hello: "world" }, { spaces: 2 });
    });

    describe("should write defaults to config file", () => {
      it("should overwrite config file", async ({ expect }) => {
        await postinstall();
        expect(await fs.readJSON(configPath)).toEqual({ ...defaults });
      });
    });
  });
});
