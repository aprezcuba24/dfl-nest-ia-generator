import { z } from "zod";
import { ToolConfig } from "@/types";
import generator from "./generator";

const schema = {
  chatContent: z
    .string()
    .describe(
      "The content of the chat. That it will be passed to the generator.",
    ),
  path: z.string().describe("The path of the root folder of the project."),
};

export const createModuleTool: ToolConfig<typeof schema> = {
  name: "create-module",
  description: `Create a new nest module. The user will pass the description that it will be passed in the description parameter.
  The tool will be active when the user want to create a dlf-nest module.
  The tool will be active only when the user writes "dlf-nest" in the chat.
  You need to pass the whole text that the user write in the chat and not modify it in any way.
 `,
  schema,
  cb: async ({ chatContent, path }: { chatContent: string; path: string }) => {
    if (!process.env.OPENAI_API_KEY) {
      return {
        content: [
          {
            type: "text",
            text: "Error: OPENAI_API_KEY not found",
          },
        ],
      };
    }
    const response = await generator(chatContent, path);
    return {
      content: [
        {
          type: "text",
          text: `The model was created successfully.
It created the following files:

- ${response.join("\n- ")}
`,
        },
      ],
    };
  },
};
