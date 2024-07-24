import { api } from "@/providers/api";
import { User } from "@repo/global";
import { handleAPIResponse } from "../utils";

class UserProvider {
  getCurrentUser = async (): Promise<User> =>
    handleAPIResponse(api.get("user"));
}

export const userProvider = new UserProvider();
