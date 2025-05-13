import { helloWorldTool } from "./hello-world";
import { ToolConfig } from "../types";
import { createModuleTool } from "./create-module";

export default [
  helloWorldTool,
  createModuleTool,
] as ToolConfig<any>[];
