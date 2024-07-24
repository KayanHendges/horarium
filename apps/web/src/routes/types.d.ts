interface RouteItem {
  label: string;
  path?: string;
  action?: () => void;
  icon: JSX.Element;
  childrenRoutesPattern?: RegExp;
}
