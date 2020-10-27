

export interface RouteChild {
  name?: string;
  icon?: React.FC | string;
  path: string;
  authority?: string;
  component?: React.FC | string;
  routes?: RouteChild[];
  hideMenu?: boolean;
  exact?: boolean;
  redirect?: string;
  meta?: any;
  loading?: boolean;
}

export interface RouteConfig {
  name?: string;
  icon?: string;
  path: string;
  redirect?: string;
  exact?: boolean;
  strict?: boolean;
  key?: string;
  roles?: string[] | string;
  component?: any;
  routes: RouteChild[];
}