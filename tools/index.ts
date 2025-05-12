import { writeFileTool } from "./write-file";
import { helloWorldTool } from "./hello-world";
import { ToolConfig } from "../types";
import { createModuleTool } from "./create-module";

export default [
  // writeFileTool,
  helloWorldTool,
  createModuleTool,
] as ToolConfig<any>[];
