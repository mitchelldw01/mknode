import fs from "fs-extra";

const filepath = new URL("index.js", import.meta.url).pathname;
const file = await fs.readFile(filepath, "utf-8");
const updatedFile = file.replace("#!/usr/bin/env -S npx ts-node", "#!/usr/bin/env node");
await fs.writeFile(filepath, updatedFile);
