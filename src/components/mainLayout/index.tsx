import React, { Suspense, useEffect } from "react";
import Header from "./Header";
import MenuContainer from "./MenuContainer";
import { Redirect, useLocation } from "react-router-dom";
import "./style.less";
import { RouteConfig } from "@shared/models/layout";
import {
  layoutState,
  AppContext,
  AppContextAction,
} from "@shared/context/appContext";
import BreadCrumb from "./Breadcrumb";
import { Layout } from "antd";

const { Content } = Layout;

// const Exception403 = React.lazy(() => import(/* webpackChunkName: "403" */ '@views/Exception/403'));

interface MainLayoutProps {
  route: RouteConfig;
}

const MainLayout: React.FC<MainLayoutProps> = (props) => {
  const location = useLocation();
  const { state, dispatch } = React.useContext(AppContext);

  const { children, route } = props;

  const { layout } = state;

  const viewMain = (
    // <Authorized
    //   routeAuthority={routeAuthority}
    //   unidentified={
    //     <Suspense fallback={<Loading spinning />}>
    //       <Exception403 />
    //     </Suspense>
    //   }
    // >
    <div className={"view-body"}>
      {children}
      </div>
    // </Authorized>
  );

  const toggleCollapsed = () => {
    dispatch({
      type: AppContextAction.layout,
      payload: {
        ...state.layout,
        collapsed: !state.layout?.collapsed,
      },
    });
  };
  const splitLayout = (
    <>
      {layout.showMenu && (
        <MenuContainer
          collapsed={layout.collapsed}
          isMobile={layout.isMobile}
          toggleCollapsed={toggleCollapsed}
        />
      )}
      <Content className={'layout-content'}>
        {layout.showHeader && <Header />}
        <BreadCrumb/>
        {viewMain}
      </Content>
    </>
  );

  const render = () => {
    return (
      
      <Layout className={'container'}>
        {splitLayout}
      </Layout>
    );
  }
  return render();
};

export default MainLayout;
