import z from "zod";
import { workspaceSchema } from "../models/workspace";

export const workspaceSubject = z.tuple([
  z.union([
    z.literal("manage"),
    z.literal("update"),
    z.literal("delete"),
    z.literal("transfer_ownership"),
  ]),
  z.union([z.literal("Workspace"), workspaceSchema]),
]);

export type WorkspaceSubject = z.infer<typeof workspaceSubject>;
