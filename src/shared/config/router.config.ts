import { RouteConfig, RouteChild } from "@shared/models/layout";
import MainLayout from '@components/mainLayout';
import { AimOutlined, BarsOutlined, CalculatorOutlined, InsuranceOutlined } from '@ant-design/icons';

export const constantRouteConfig: { app: RouteConfig } = {
  app: {
    path: '/',
    component: () => MainLayout,
    roles: ['admin', 'guest'],
    routes: []
  },
  // user: {
  //   path: '/user',
  //   component: '/layout/UserLayout',
  //   routes: [
  //     {
  //       name: 'identifyUser',
  //       path: '/user/identifyUser',
  //       component: '/components/Authorized/IdentifyUser'
  //     }
  //   ]
  // }
};

// 路由表
export const asyncRouteConfig: RouteChild[] = [
  {
    name: 'Dashboard',
    icon: AimOutlined,
    path: '/dashboard',
    loading: true,
    component: '/views/dashboard'
  },
  {
    path: '/',
    redirect: '/dashboard',
    hideMenu: true
  },
  {
    path: '/test',
    name: '二级菜单',
    icon: CalculatorOutlined,
    routes: [
      {
        name: '子菜单',
        path: '/test/view',
        component: '/views/samplePage',
        loading: true,
        meta: {
          parentName: ['二级菜单'],
          parentLocaleKey: ['menu.subMenu']
        }
      }
    ]
  }
];
