import { beforeEach, describe, it } from "vitest";
import fs from "fs-extra";
import os from "os";
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
      const buffer = await postinstall("n");
      console.log(buffer);
      expect(await fs.pathExists(configPath)).toBe(true);
    });

    it("should write defaults to config file", async ({ expect }) => {
      await postinstall("n");
      expect(await fs.readJSON(configPath)).toEqual({ ...defaults });
    });

    it("should not prompt user", async ({ expect }) => {
      const buffer = await postinstall("n");
      expect(buffer).not.toContain("This version may include changes to some defaults");
    });
  });

  describe("when config file exists", () => {
    beforeEach(async () => {
      await fs.open(configPath, "w");
      await fs.writeJSON(configPath, { hello: "world" }, { spaces: 2 });
    });

    it("should prompt user", async ({ expect }) => {
      const buffer = await postinstall("n");
      expect(buffer).toContain("This version may include changes to some defaults");
    });

    describe("when user answers yes", () => {
      it("should overwrite config file", async ({ expect }) => {
        await postinstall("y");
        expect(await fs.readJSON(configPath)).toEqual({ ...defaults });
      });
    });

    describe("when user answers no", () => {
      it("should not overwrite config file", async ({ expect }) => {
        await postinstall("n");
        expect(await fs.readJSON(configPath)).toEqual({ hello: "world" });
      });
    });
  });
});
