import { api } from "@/providers/api";
import { User } from "@repo/global";

class UserProvider {
  getCurrentUser = async (): Promise<User> => (await api.get("user")).data;
}

export const userProvider = new UserProvider();
