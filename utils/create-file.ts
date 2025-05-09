import fs from "fs";

export const createFile = (path: string, content: string) => {
  const dir = path.split("/").slice(0, -1).join("/");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(path, content);
};
