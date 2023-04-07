import fs from "fs-extra";
import { homedir } from "os";
import path from "path";
import { beforeEach, describe, it } from "vitest";
import * as defaults from "../src/defaults.js";
import { readBootstrapData } from "../src/lib.js";
import { postinstall } from "./util/postinstall.js";

const configPath = path.join(homedir(), ".config/mknode.json");

describe("lib", () => {
  describe("readBootstrapData", () => {
    describe("when config file is complete", () => {
      beforeEach(async () => {
        await postinstall("y");
      });

      it("should read the config file", async ({ expect }) => {
        const data = await readBootstrapData(configPath);
        expect(data).toEqual({ ...defaults });
      });
    });

    describe("when config file is partially missing", () => {
      beforeEach(async () => {
        await fs.writeJSON(configPath, { ...defaults, prettierrc: undefined }, { spaces: 2 });
      });

      it("should replace missing fields with defaults", async ({ expect }) => {
        const data = await readBootstrapData(configPath);
        expect(data).toEqual({ ...defaults, prettierrc: defaults.prettierrc });
      });
    });
  });
});
