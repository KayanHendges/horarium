"use client";
import { useRoutes } from "@/routes";
import { Button, ButtonProps } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface Props extends ButtonProps {
  routerItem: RouteItem;
}

export function SidebarRouterIcon({ routerItem, ...props }: Props) {
  const { currentRoute, handleNavigation } = useRoutes();
  const { icon, path, label } = routerItem;

  const isSelected = currentRoute?.path === path;

  return (
    <TooltipProvider key={path}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={isSelected ? "default" : "ghost"}
            size={"icon"}
            onClick={() => handleNavigation(routerItem)}
            {...props}
          >
            {icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
