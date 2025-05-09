import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { tool } from "ai";
import { z } from "zod";
import { createFile } from "@/utils/create-file";

const generator = async () => {
  const { text } = await generateText({
    model: openai("o3-mini"),
    prompt: "Write a module for a Node.js application",
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
  return text;
};

export default generator;
