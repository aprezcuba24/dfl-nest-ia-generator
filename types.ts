import { ToolCallback } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ToolAnnotations } from "@modelcontextprotocol/sdk/types.js";
import { ZodRawShape } from "zod";

export type ToolConfig<Args extends ZodRawShape> = {
  name: string,
  description: string,
  schema: Args | ToolAnnotations,
  cb: ToolCallback<Args>,
}
