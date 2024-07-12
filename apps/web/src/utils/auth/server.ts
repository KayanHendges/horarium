import { variables } from "@/config/variables";
import { cookies } from "next/headers";

export const isAuthenticated = () => {
  return !!cookies().get(variables.accessTokenVar)?.value;
};