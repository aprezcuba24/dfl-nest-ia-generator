import { z } from "zod";

export const helloWorldTool = {
  name: "hello-world",
  description: "Says hello",
  schema: {
    name: z.string().describe("The name to say hello to")
  },
  cb: async ({ name }) => {
    return {
      content: [
        {
          type: "text",
          text: `Hello ${name}`
        }
      ]
    }
  }
}