#!/usr/bin/env -S npx ts-node --swc

import { homedir } from "os";
import path from "path";
import { bootstrap } from "./bootstrap.js";

const cwd = process.cwd();

const configPath = path.join(homedir(), ".config/mknode.json");

await bootstrap(process.argv.slice(2), cwd, configPath);
