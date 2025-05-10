import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { tool } from "ai";
import { z } from "zod";
import { createFile } from "../../utils/create-file";
import prompts from "./prompts";

const generator = async (chatContent: string) => {
  const { toolCalls } = await generateText({
    model: openai("gpt-4o"),
    system: prompts,
    prompt: chatContent,
    tools: {
      createFile: tool({
        description: "Create a new file",
        parameters: z.object({
          path: z.string().describe("The path to the file to create"),
          content: z.string().describe("The content of the file to create"),
        }),
        execute: async ({ path, content }) => {
          return createFile(path, content);
        },
      }),
    },
  });
  return toolCalls.map((toolCall) => toolCall.args.path);
};

export default generator;
