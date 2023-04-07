import { spawn } from "child_process";

export async function postinstall(answer: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const child = spawn("npx", ["ts-node", "src/postinstall.ts"]);

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
