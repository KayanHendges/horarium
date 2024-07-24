import { userProvider } from "@/providers/api/user";
import { signOut } from "@/utils/auth/client";
import { User } from "@repo/global";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createContext, ReactNode, useContext } from "react";

interface IUserContext {
  user: User;
  isLoading: boolean;
}

const UserContext = createContext({} as IUserContext);

export function UserProvider({ children }: { children: ReactNode }) {
  const { isLoading, data: user } = useQuery({
    queryKey: ["getUser"],
    queryFn: async () => await userProvider.getCurrentUser(),
  });

  const router = useRouter();

  if (!user && !isLoading) {
    signOut(router.push);
    return <></>;
  }

  if (!user || isLoading) return "Loading...";

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUserContext = () => useContext(UserContext);
