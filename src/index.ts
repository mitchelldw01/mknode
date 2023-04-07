#!/usr/bin/env -S npx ts-node --swc

import { bootstrap } from "./bootstrap.js";

const cwd = process.cwd();

await bootstrap(cwd);
