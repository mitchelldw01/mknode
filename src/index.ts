#!/usr/bin/env -S npx ts-node --swc

import path from "path";
import { bootstrap } from "./bootstrap.js";
import { homedir } from "os";

const cwd = process.cwd();

const configPath = path.join(homedir(), ".config/mknode.json");

await bootstrap(cwd, configPath);
