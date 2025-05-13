import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { tool } from "ai";
import { z } from "zod";
import { createFile } from "../../utils/create-file";
import parts from "./parts";
import { Settings } from "@/utils/settings";

const generatePart = async (
  system: string,
  chatContent: string,
  rootPath: string,
) => {
  const { toolCalls } = await generateText({
    model: openai(Settings.IA_MODEL),
    system,
    prompt: chatContent,
    tools: {
      createFile: tool({
        description: "Create a new file",
        parameters: z.object({
          path: z.string().describe("The path to the file to create"),
          content: z.string().describe("The content of the file to create"),
        }),
        execute: async ({ path, content }) => {
          return createFile(`${rootPath}/${path}`, content);
        },
      }),
    },
  });
  return toolCalls.map((toolCall) => toolCall.args.path);
};

const generator = async (chatContent: string, rootPath: string) => {
  const files = await Promise.all(
    parts.map((part) => generatePart(part, chatContent, rootPath)),
  );
  return files.flat();
};

export default generator;
