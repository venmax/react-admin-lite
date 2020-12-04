import React, { useEffect } from "react";
import "@common/base.less";
import RenderRoutes from "@components/renderRoutes";

import {
  AppContext,
  AppContextReducer,
  AppStateInit,
  AppContextAction,
  IUserInfo,
} from "@shared/context/appContext";
import {constantRouteConfig, asyncRouteConfig} from "@config/router.config";
import { post } from "@utils/request";
import { LoadingOutlined } from "@ant-design/icons";

interface IProps {
  type?: string;
}

const App: React.FC<IProps> = () => {
  const [appInitialized, setAppInitialized] = React.useState<boolean>(false);
  const [state, dispatch] = React.useReducer(AppContextReducer, AppStateInit);

  const getUserInfo = () => {
    // 登录状态由api返回
    new Promise((resolve, reject) => {
      setTimeout(() => {
        const userInfo = {
          mobile: '1333333',
          realName: 'Tom Ford',
          status: 0,
          userCode: 304,
          userId: '123',
          userName: 'Tom',
          roles: ['admin']
        };
        dispatch({type: AppContextAction.login, payload: {...userInfo}});
        // dispatch({type: AppContextAction.login, payload: {roles: []}});
      }, 1000);
    });
  };
  const initApp = () => {
    // TODO: 从接口获取菜单列表，从本地全量内容筛选
    const {app} = constantRouteConfig;
    app.routes = asyncRouteConfig;
    setAppInitialized(true);
    dispatch({type: AppContextAction.layout, payload: { ...AppStateInit.layout, routeConfig: [app]}});
  }

  useEffect(() => {
    if (state.userInfo) {
      initApp();
    }
  }, [state.userInfo]);

  useEffect(() => {
    getUserInfo();
  }, []);


  const render = () => {
    return (appInitialized ? <AppContext.Provider value={{ state, dispatch }}>
        <RenderRoutes />
      </AppContext.Provider>: 
      <div style={{padding: '30px 20px'}}>
        <LoadingOutlined style={{ fontSize: 24, paddingRight: '5px', color: '#024eac' }} spin /> Loading...
        </div>
    );
  };
  return render();
};
export default App;