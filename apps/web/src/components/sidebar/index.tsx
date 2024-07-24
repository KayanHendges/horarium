import { cn } from "@/lib/utils";
import { ComponentPropsWithoutRef } from "react";
import Profile from "../profile";

import { routes } from "@/routes/routes";
import { SignOutButton } from "../buttons/signOut";
import { SidebarRouterIcon } from "./sidebar-router-icon";

interface SidebarProps extends ComponentPropsWithoutRef<"div"> {}

export function Sidebar({ className, ...props }: SidebarProps) {
  return (
    <div
      className={cn(
        "min-h-screen flex flex-col items-center gap-2 bg-background p-4 border-r-[1px] border-border",
        className
      )}
      {...props}
    >
      <Profile />
      {routes.map((routeItem) => {
        return (
          <SidebarRouterIcon key={routeItem.path} routerItem={routeItem} />
        );
      })}
      <div className="flex flex-col mt-auto">
        <SignOutButton />
      </div>
    </div>
  );
}
