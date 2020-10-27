import React, { useEffect, useContext, useState, lazy, Suspense } from 'react';
import {
  Router,
  Route,
  Redirect,
  Switch,
  RouteComponentProps
} from 'react-router-dom';
import { createHashHistory, createBrowserHistory } from "history";

import { AppContext, AppContextAction } from "@shared/context/appContext";
import { RouteConfig, RouteChild } from '@shared/models/layout';
import AsyncComponent from '@components/asyncComponent';
import LoginPage from '@views/login';
import {Route404} from "./routeStatus";

const history = createHashHistory();

interface RouteInterProps {
  path: string;
  exact?: boolean;
  strict?: boolean;
  render: any;
  key: string | number;
}

interface RouteInterRouteProps extends RouteInterProps, RouteComponentProps {}

const RouteInter = (rmProps: RouteInterProps) => {
  const routeInfo = () => {
    return rmProps as RouteInterRouteProps;
  };
  const { location } = routeInfo();
  const { path, exact, strict, render, ...rest } = rmProps;
  return (
    <Route
      path={path}
      exact={exact}
      strict={strict}
      location={location}
      render={props => render({ ...props, ...rest })}
    />
  );
};
const RenderRoutes: React.FC = () => {
  const { state, dispatch } = useContext(AppContext);
  const {layout} = state;

  const authRoute = () => {
        if (state.userInfo && state.userInfo.roles.length) {
          return generateRoute(layout.routeConfig);
        } else {
        return <Route render= {({location}) => <LoginPage></LoginPage>} />;
        }
  };

  const generateRoute = (routes: RouteConfig[], switchProps?: any) => {

    return routes && routes.length ? (
      <Switch {...switchProps}>
        { routes.map((route: any, i: number) => {

        const {
          redirect,
          path,
          exact,
          strict,
          routes: child,
          component,
          key
        } = route;
        if (redirect) {
          return (
            <Redirect key={key || i} from={path} to={redirect} exact={exact} strict={strict} />
          );
        }
        return (<RouteInter
          key={i}
          path={path}
          exact={exact}
          strict={strict}
          render={(props: any) => {
            const childRoutes = generateRoute(child, {
              location: props.location
            });

            if (component) {
              return <AsyncComponent componentInfo={component} routeInfo={route}>
                {childRoutes}
              </AsyncComponent>
            } else {
              return childRoutes;
            }
          }}
        />)
      })
    }
    <Route component={Route404} />
    </Switch>
    ): null
  }

  const render = () => {
  return <Router history={history}>
    {authRoute()}
    </Router>;
  }
  return render();
};

export default  RenderRoutes;
