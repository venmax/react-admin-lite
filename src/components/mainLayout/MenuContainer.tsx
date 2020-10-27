import React, { useState, ReactText, ReactInstance, useCallback, useEffect, Suspense } from "react";
import { Drawer, Layout, Menu } from "antd";
import  * as antIcons from '@ant-design/icons';
import { AppContext } from "@shared/context/appContext";
import { RouteChild, RouteConfig } from "@shared/models/layout";
import SubMenu from "antd/lib/menu/SubMenu";
import { Link, useLocation, matchPath } from "react-router-dom";
import SiteDetail from "./SiteDetail";
import { lazy } from "react";

const { Sider } = Layout;
interface LooseObject {
  [key: string]: any
}

interface IProps {
  collapsed: boolean;
  isMobile: boolean;
  toggleCollapsed: () => void;
}

const MainMenu: React.FC = () => {
  const { state, dispatch } = React.useContext(AppContext);
  const location = useLocation();
  const [openKeys, setOpenKeys] = useState<any[]>([]);
  const [isInitMenuOpen, setIsInitMenuOpen] = useState(false);
  const { routeConfig, isMobile, collapsed, } = state.layout;
  const [appRoutes] = routeConfig;

  // 递归生成菜单项
  function getNavMenuItem(menuData: RouteChild[]) {
    if (!menuData.length) {
      return [];
    }
    return menuData
      .filter((menu: RouteChild) => {
        const { authority, hideMenu } = menu;
        if (!hideMenu) {
          if (!authority) return true;
        }
        return false;
      })
      .map((res: RouteChild) => getSubMenuOrItem(res));
  }

  // 检查路由是否匹配信息表
  function checkRoute(routeInfo: any, path: string) {
    const isArr = Array.isArray(routeInfo);
    const arr = isArr ? routeInfo : routeInfo.routes;
    if (arr) {
      return arr.find((route: RouteChild) => {
        return route.path === (isArr ? '' : routeInfo.path) + '/' + path;
      });
    }
    return true;
  }

  useEffect(() => {
    initOpenMenu(true);
  },[location]);
  // 初始化开启的菜单
  const initOpenMenu = useCallback((historyChanged: boolean) => {
    if (!historyChanged && isInitMenuOpen) {
      return;
    }
    // 缓存匹配到的路由信息
    let cacheRoute: RouteChild;
    const menuOpen = location.pathname.split('/').reduce((total: string[], path) => {
      if (path) {
        cacheRoute = checkRoute(cacheRoute || appRoutes.routes, path);
        cacheRoute && cacheRoute.routes && total.push(cacheRoute.path);
      }
      return total;
    }, []);
    setOpenKeys([...menuOpen]);
  }, [appRoutes.routes, location.pathname]);

  useEffect(() => {
    initOpenMenu(false);
  }, [initOpenMenu]);

  // 初始化子级菜单或者菜单枝叶
  function getSubMenuOrItem(menu: RouteChild) {
    if (
      menu.routes &&
      !menu.hideMenu &&
      menu.routes.some((child: RouteChild) => child.name)
    ) {
      // 菜单父级
      const { icon, name, path, routes } = menu;
      return (
        <SubMenu title={getMenuTitle(name || "", icon)} key={path}>
          {getNavMenuItem(routes)}
        </SubMenu>
      );
    } // 菜单子级枝叶
    return <Menu.Item key={menu.path}>{getMenuItem(menu)}</Menu.Item>;
  }

  const getIcon = (icon: React.FC | string, name: string) => {
    if (!icon) {
      return null;
    }
    const Icon = icon;
    return <Icon key={`icon-${name}`} />;
      // const MenuIcon = lazy(() => import(`@ant-design/icons/es/icons/${icon}.js`));
      // return (<Suspense fallback={<span style={{width: '24px', display: 'inline-block'}}></span>} key={`icon-${icon}`}>
      //     <MenuIcon/>
      //   </Suspense>
      // )
  };
  // 获取菜单标题
  function getMenuTitle(
    name: string,
    icon?: React.FC | string
  ) {
    return [
      icon && getIcon(icon, name),
      <span key={`menu-${name}`}>{name}</span>
    ];
  }

  const handleOpenMenu = (keys: any) => {
    const openKeys = keys as string[];
      const moreThanOne =
        openKeys.filter(key => routeConfig.some(route => route.path === key)).length > 1;
        if (collapsed && !openKeys.length) {
        return;
      }
      setOpenKeys(moreThanOne ? [openKeys.pop()] : [...openKeys]);
  };
  
  // 生成菜单枝叶
  function getMenuItem(menu: RouteChild) {
    const { icon, name, path } = menu;
    return (
      <Link to={path} >
        {icon && getIcon(icon, name as string)}
        <span>{name}</span>
      </Link>
    );
  }

  const getSelectKeys = (): string [] => {
    const openedKey = openKeys[0];
    let currentKey = '';
    let currentRoutes: RouteChild[] = [];
    routeConfig.forEach(route => {
      const routes = route.routes;
      routes.forEach(item => {
        if (item.path === openedKey) {
          currentRoutes = item.routes as RouteChild[];
        }
      });
    });
    currentRoutes.forEach(route => {
      const match = matchPath(location.pathname, {
        path: route.path,
        exact: true,
        strict: false
      });
      if (match) {
        if (route.hideMenu) {
          currentKey = route.meta.highlightPath;
        } else {
          currentKey = route.path;
        }
      }
    });
    return currentKey ? [currentKey]: [location.pathname];
  };

  const render = () => {
    const menuProps = collapsed ? {} : { openKeys: openKeys };
    const selectKeys = getSelectKeys();
    return (
      <aside>
        <SiteDetail />
        <Menu
          className={"side-menu"}
          mode="inline"
          theme="dark"
          selectedKeys={selectKeys}
          onOpenChange={handleOpenMenu}
          {...menuProps}
        >
          {getNavMenuItem(appRoutes.routes || [])}
        </Menu>
      </aside>
    );
  }
  return render();
};

const MenuContainer: React.FC<IProps> = (props) => {
  const { isMobile, collapsed, toggleCollapsed } = props;
  return isMobile ? (
    <Drawer
      visible={!collapsed}
      placement="left"
      closable={false}
      onClose={() => toggleCollapsed()}
      style={{
        padding: 0,
        height: "100vh",
      }}
      bodyStyle={{
        padding: 0,
      }}
    >
      <MainMenu />
    </Drawer>
  ) : (
    <Sider className={'sider'} collapsible collapsed={collapsed} onCollapse={toggleCollapsed}>
      <MainMenu />
    </Sider>
  );
};

export default MenuContainer;
