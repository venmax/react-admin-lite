import React from "react";
import { RouteChild, RouteConfig } from "@shared/models/layout";

// Context + Reducer的状态管理
interface IAppContext {
  state: IAppState;
  dispatch: (param: { type: string; payload: any }) => void;
}

export interface layoutState {
  // 菜单栏是否展开
  collapsed: boolean;
  // 开启的菜单
  openMenus: Array<string>;
  // 是否是手机浏览器
  isMobile: boolean;
  // 路由数据
  routeConfig: Array<RouteConfig>;
  // 显示头部
  showMenu: boolean;
  // 显示菜单
  showHeader: boolean;
  routeOriginData?: RouteChild;
}

export interface IUserInfo {
    mobile: string;
    realName: string;
    status: number;
    userCode: string;
    userId: string;
    userName: string;
    roles: string[]
}

export interface IAppState {
  uid: string;
  layout: layoutState,
  userInfo?: IUserInfo,
}

export const AppContextAction = {
  uid: "uid",
  layout: "layout",
  login: "login",
  // 退出登录
  logout: "logout",
};

export const AppContextReducer = (
  state: IAppState,
  action: { type: string; payload: any }
): any => {
  switch (action.type) {
    case AppContextAction.uid:
      return { ...state, uid: action.payload };
      case AppContextAction.layout:
        return { ...state, layout: action.payload };
    case AppContextAction.login: {
      console.log('action.payload', action.payload);
      return { ...AppStateInit, userInfo: action.payload };
    }
    case AppContextAction.logout:
      return { ...AppStateInit, loginFromLogout: true };
  }
  return state;
};

export const AppStateInit = {
  uid: "",
  layout: {
    collapsed: false,
    // 是否是手机浏览器
    openMenus: [],
    isMobile: false,
    // 路由数据
    routeConfig:[],
    // 显示菜单
    showMenu: true,
    // 显示头部
    showHeader: true,
  }
};

export const AppContext = React.createContext<IAppContext>({
  state: AppStateInit,
  dispatch: () => {
    /** */
  },
});
