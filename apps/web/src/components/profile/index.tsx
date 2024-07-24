"use client";

import { useUserContext } from "@/contexts/user-context";
import { getInitials } from "@/utils/string";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function Profile() {
  const { user } = useUserContext();

  const fallbackName = getInitials(user.name);

  return (
    <Avatar>
      <AvatarImage src={user.picture || undefined} />
      <AvatarFallback>{fallbackName}</AvatarFallback>
    </Avatar>
  );
}
