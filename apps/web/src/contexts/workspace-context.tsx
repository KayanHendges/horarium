import { toast } from "@/components/ui/use-toast";
import { workspaceProvider } from "@/providers/api/workspace";
import { Workspace } from "@repo/global";
import { useQuery } from "@tanstack/react-query";
import { getCookie, setCookie } from "cookies-next";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useUserContext } from "./user-context";

interface IWorkspaceContext {
  workspaces: Workspace[];
  selectedWorkspace: Workspace | null;
  handleSelectWorkspace: (workspaceId: string) => void;
  isLoading: boolean;
}

const WorkspaceContext = createContext({} as IWorkspaceContext);
const SELECTED_WORKSPACE_ID_COOKIE = "selectedWorkspaceId";

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const { isLoading, data: workspaces } = useQuery({
    queryKey: ["listWorkspaces"],
    initialData: [],
    queryFn: async () => {
      const { list } = await workspaceProvider.listUserWorkspace();

      if (!list.length) {
        const createdWorkspace = await workspaceProvider.createWorkspace({
          name: user.name,
          type: "personal",
        });

        return [createdWorkspace];
      }

      return list;
    },
  });

  const { user } = useUserContext();

  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(
    null
  );

  const handleSelectWorkspace = (workspaceId: string) => {
    try {
      const validWorkspace = workspaces.find((it) => it.id === workspaceId);
      if (!validWorkspace) throw new Error("Invalid workspace");

      setCookie(SELECTED_WORKSPACE_ID_COOKIE, validWorkspace.id);
      setSelectedWorkspace(validWorkspace);
    } catch (error) {
      toast({ title: "Invalid workspace" });
    }
  };

  useEffect(() => {
    if (!workspaces.length) return;

    const selectedWorkspaceId = getCookie(SELECTED_WORKSPACE_ID_COOKIE);

    handleSelectWorkspace(selectedWorkspaceId || workspaces[0].id);
  });

  return (
    <WorkspaceContext.Provider
      value={{
        workspaces,
        isLoading,
        selectedWorkspace,
        handleSelectWorkspace,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export const useWorkspaceContext = () => useContext(WorkspaceContext);
