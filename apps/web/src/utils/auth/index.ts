import { variables } from "@/config/variables";
import { cookies } from "next/headers";

export function isAuthenticated() {
  return !!cookies().get(variables.accessTokenVar)?.value;
}
