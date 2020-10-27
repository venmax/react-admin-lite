import { AppContext } from '@shared/context/appContext';
import { RouteChild, RouteConfig } from '@shared/models/layout';
import React, { useEffect, useState } from 'react';
import { Link, matchPath, Router, useLocation } from 'react-router-dom';
import { Breadcrumb } from 'antd';

interface IBranch {
  path: string, 
  name: string | undefined, 
  isEnd?: boolean
}

function matchRoutes(routes: RouteChild[], pathname: string, branch: IBranch[]) {
  // TODO: 用name匹配父级节点，按层次push

  if (!routes || branch[branch.length - 1].isEnd) {
    return;
  }
  const length = routes.length;
  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];
    // push一个节点，遍历该节点所有子节点
    
    const childRoutes = route.routes as RouteChild[];
    // 路由精确匹配
    if (route.meta && matchPath(pathname, {
      path: route.path,
      exact: true,
      strict: false
    })) {
      const currentRoute = routes.find(item => item.name === route.meta.parentName);
      if (currentRoute) {
        branch.push({
          name: currentRoute.name,
          path: currentRoute.path,
          isEnd: true
        });
      } else {
        branch[branch.length - 1].isEnd = true;
      }
      break;
    }

    if (branch[branch.length - 1].isEnd !== true) {
      if (childRoutes) {
        branch.push({
          name: route.name,
          path: ''
        });
        matchRoutes(childRoutes, pathname, branch);
      }
      if (i >= length - 1) {
        if(branch[branch.length - 1].isEnd !== true) {
          branch.pop();
        }
      }
    }
  }
}

const BreadCrumb: React.FC = () => {
  const [breadcrumb, setBreadCrumb] = useState<{ name?: string; path: string }[]>([]);
  const { state } = React.useContext(AppContext);
  const { routeOriginData } = state.layout;
  const location = useLocation();

  const getBranchs = ():RouteChild[] => {
    const branch: IBranch[] = [{
      path: '/',
      name: '首页',
      isEnd: false
    }];
    matchRoutes(state.layout.routeConfig[0].routes, location.pathname, branch);
    return branch;
  };
  useEffect(() => {
    if (routeOriginData) {
      const { name, meta } = routeOriginData as RouteChild;
      const branch = getBranchs();

      const breads = branch.map(({name, path, routes}) => {
        return {
          name,
          path: routes ? '': path
        };
      });
      breads.push({
        name,
        path: ''
      });
      if (meta) {
        setBreadCrumb([
          ...breads
        ]);
      } else {
        setBreadCrumb([]);
      }
    }
  }, [routeOriginData]);

  const render = () => {
    return (
      <Breadcrumb className={'breadcrumb'}>
        {breadcrumb.length
          ? breadcrumb.map((info, index) => {
              const { name, path } = info;
              return (
                <Breadcrumb.Item key={`bread-${index}`}>
                  {path ? <Link to={path}>{name}</Link> : name}
                  </Breadcrumb.Item>
              );
            })
          : null}
      </Breadcrumb>
    );
  };

  return render();
};

export default BreadCrumb;
