import { z } from "zod";
// import generator from "./generator";
import { ToolConfig } from "@/types";

const schema = {
  chatContent: z
    .string()
    .describe(
      "The content of the chat. That it will be passed to the generator.",
    ),
};

export const createModuleTool: ToolConfig<typeof schema> = {
  name: "create-module",
  description: `Create a new nest module. The user will pass the description that it will be passed in the description parameter.
  The tool will be active when the user want to create a dlf-nest module.
  The tool will be active only when the user writes "dlf-nest" in the chat.
  You need to pass the whole text that the user write in the chat and not modify it in any way.
 `,
  schema,
  cb: async ({ chatContent }: { chatContent: string }) => {
    // await generator({ name });
    return {
      content: [
        {
          type: "text",
          text: `Module ${chatContent} created successfully`,
        },
      ],
    };
  },
};
