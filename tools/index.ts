import { writeFileTool } from "./write-file";
import { helloWorldTool } from "./hello-world";
import { ToolConfig } from "../types";

export default [writeFileTool, helloWorldTool] as ToolConfig<any>[];
