import { spawn } from "child_process";

export async function postinstall(): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn("npx", ["ts-node", "src/postinstall.ts"]);

    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Child process exited with code ${code}`));
      }
    });

    child.on("error", (error) => reject(error));
  });
}
