"use client";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";
import { routes } from "./routes";

export function useRoutes() {
  const pathname = usePathname();
  const router = useRouter();

  const handleNavigation = ({ path, action }: RouteItem) => {
    if (pathname === path) return;

    if (action) return action();
    if (path) router.push(path);
  };

  const currentRoute = useMemo(
    () =>
      routes.find(
        (route) =>
          route?.path?.startsWith(pathname) ||
          (route.childrenRoutesPattern &&
            pathname.match(route.childrenRoutesPattern))
      ),
    [pathname]
  );

  const selectedItemIndex = routes.findIndex(
    (route) => currentRoute?.path === route?.path
  );

  return { currentRoute, selectedItemIndex, handleNavigation };
}
