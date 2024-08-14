import { cn } from "@/lib/utils";
import { ComponentPropsWithoutRef } from "react";
import Profile from "../profile";

import { routes } from "@/routes/routes";
import { SignOutButton } from "../buttons/signOut";
import { SidebarRouterIcon } from "./sidebar-router-icon";
import { Separator } from "../ui/separator";
import { ThemeSwitcher } from "../theme/theme-switcher";

interface SidebarProps extends ComponentPropsWithoutRef<"div"> {}

export function Sidebar({ className, ...props }: SidebarProps) {
  return (
    <div
      className={cn(
        "flex min-h-full flex-col items-center rounded-xl",
        "gap-4 bg-card p-4 border-r-[1px] border-border",
        className
      )}
      {...props}
    >
      <Profile />
      <Separator />
      {routes.map((routeItem) => {
        return (
          <SidebarRouterIcon key={routeItem.path} routerItem={routeItem} />
        );
      })}
      <Separator className="mt-auto" />
      <div className="flex flex-col gap-2">
        <ThemeSwitcher side="right" />
        <SignOutButton />
      </div>
    </div>
  );
}
