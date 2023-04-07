import { afterAll, beforeEach, describe, it } from "vitest";
import fs from "fs-extra";
import path from "path";
import { homedir } from "os";
import * as defaults from "../src/defaults.js";
import { postinstall } from "./util/postinstall.js";

const configPath = path.join(homedir(), ".config/mknode.json");

describe("postinstall", () => {
  describe("when config file does not exist", () => {
    beforeEach(async () => {
      await fs.remove(configPath);
    });

    it("should create config file", async ({ expect }) => {
      await postinstall("n");
      expect(await fs.pathExists(configPath)).toBe(true);
    });

    it("should write defaults to config file", async ({ expect }) => {
      await postinstall("y");
      expect(await fs.readJSON(configPath)).toEqual({ ...defaults });
    });

    it("should not prompt user", async ({ expect }) => {
      const buffer = await postinstall("n");
      expect(buffer).not.toContain("This version may include changes to some defaults");
    });
  });

  describe("when config file exists", () => {
    beforeEach(async () => {
      await fs.ensureFile(configPath);
      await fs.writeJSON(configPath, { hello: "world" }, { spaces: 2 });
    });

    afterAll(async () => {
      await postinstall("y");
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
