import { api } from "@/providers/api";
import {
  CreateWorkspaceDTO,
  ListWorkspacesResponse,
  Workspace,
} from "@repo/global";
import { handleAPIResponse } from "../utils";

class WorkspaceProvider {
  listUserWorkspace = async (): Promise<ListWorkspacesResponse> =>
    handleAPIResponse(api.get("workspace"));

  createWorkspace = async (payload: CreateWorkspaceDTO): Promise<Workspace> =>
    handleAPIResponse(api.post("workspace", payload));

  enableWorkspace = async (workspaceId: string): Promise<void> =>
    handleAPIResponse(api.patch(`workspace/${workspaceId}/enable`));

  disableWorkspace = async (workspaceId: string): Promise<void> =>
    handleAPIResponse(api.delete(`workspace/${workspaceId}`));
}

export const workspaceProvider = new WorkspaceProvider();
