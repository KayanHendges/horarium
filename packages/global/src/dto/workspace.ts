import { Workspace, WorkspaceType } from '@repo/db'
import { z } from 'zod'

import { ListItems } from './globals'

export const workspaceNameSchema = z.string().min(2).max(64)
export const workspaceUniqueNameSchema = z.string().min(2).max(32)

const workspaceTypeEnum = Object.values(WorkspaceType)

export const createWorkspaceSchema = z.object({
  name: workspaceNameSchema,
  uniqueName: workspaceNameSchema.optional(),
  type: z.enum([workspaceTypeEnum[0], ...workspaceTypeEnum]),
})

export type CreateWorkspaceDTO = z.infer<typeof createWorkspaceSchema>

export const workspaceParamsSchema = z.object({
  id: z.string(),
})

export type WorkspaceParamsDTO = z.infer<typeof workspaceParamsSchema>

export interface ListWorkspacesResponse extends ListItems<Workspace> {}
