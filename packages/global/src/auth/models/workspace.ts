import z from "zod";

export const workspaceSchema = z.object({
  __typename: z.literal('Workspace').default('Workspace'),
  id: z.string(),
  ownerId: z.string()
})