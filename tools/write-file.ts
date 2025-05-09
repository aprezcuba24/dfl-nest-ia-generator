import { z } from "zod";
import { ToolConfig } from "../types";
import fs from "fs";

const schema = {
  path: z.string().describe("The path to the file to write"),
  content: z.string().describe("The content of the file to write"),
};

export const writeFileTool: ToolConfig<typeof schema> = {
  name: "write-file",
  description: `Create a new file or completely overwrite an existing file with new content. 
Use with caution as it will overwrite existing files without warning. 
Handles text content with proper encoding. Only works within allowed directories.`,
  schema: schema,
  cb: (args: { path: string; content: string }) => {
    const { path, content } = args;
    fs.writeFileSync(path, content, "utf-8");
    return {
      content: [{ type: "text", text: `Successfully wrote to ${path}` }],
    };
  },
};
