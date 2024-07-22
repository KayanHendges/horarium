import { toast } from "@/components/ui/use-toast";
import { userProvider } from "@/providers/api/user";
import { workspaceProvider } from "@/providers/api/workspace";
import { signOut } from "@/utils/auth/client";
import { User, Workspace } from "@repo/global";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createContext, ReactNode, useContext, useState } from "react";

interface IUserContext {
  user: User;
  workspaces: Workspace[];
  selectedWorkspace: Workspace | null;
  handleSelectWorkspace: (workspaceId: string) => void;
  isLoadingUser: boolean;
  isLoadingWorkspaces: boolean;
}

const UserContext = createContext({} as IUserContext);

export function UserProvider({ children }: { children: ReactNode }) {
  const { isLoading: isLoadingUser, data: user } = useQuery({
    queryKey: ["getUser"],
    queryFn: async () => await userProvider.getCurrentUser(),
  });

  const { isLoading: isLoadingWorkspaces, data: workspaces } = useQuery({
    queryKey: ["listWorkspaces"],
    initialData: [],
    queryFn: async () => await workspaceProvider.listUserWorkspace(),
  });

  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(
    null
  );

  const handleSelectWorkspace = (workspaceId: string) => {
    try {
      const validWorkspace = workspaces.find((it) => it.id === workspaceId);
      if (!validWorkspace) throw new Error("Invalid workspace");
      setSelectedWorkspace(validWorkspace);
    } catch (error) {
      toast({ title: "Invalid workspace" });
    }
  };

  const router = useRouter();

  if (!user && !isLoadingUser) return signOut(router.push);

  if (!user || isLoadingUser) return "Loading...";

  return (
    <UserContext.Provider
      value={{
        user,
        isLoadingUser,
        workspaces,
        isLoadingWorkspaces,
        selectedWorkspace,
        handleSelectWorkspace,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUserContext = () => useContext(UserContext);
