import { api } from "@/providers/api";
import { Workspace } from "@repo/global";

class WorkspaceProvider {
  listUserWorkspace = async (): Promise<Workspace[]> =>
    (await api.get("workspace")).data;
}

export const workspaceProvider = new WorkspaceProvider();
