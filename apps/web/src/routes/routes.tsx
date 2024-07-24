import { Contact, Home } from "lucide-react";

export const routes: RouteItem[] = [
  {
    label: "Início",
    icon: <Home />,
    path: "/",
  },
  {
    label: "Clientes",
    path: "/customers",
    icon: <Contact />,
  },
];
