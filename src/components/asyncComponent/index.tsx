import React, { lazy, Suspense, memo, useState, useEffect } from "react";
import { RouteConfig } from "@shared/models/layout";
import { AppContext, AppContextAction } from "@shared/context/appContext";
import { Spin } from 'antd';
import ErrorBoundary from "@components/errorBoundary";
import './style.less';

interface IProps {
  componentInfo: string;
  routeInfo?: RouteConfig;
  children: JSX.Element | null;
}

const AsyncComponent: React.FC<IProps> = (props) => {
  const [comp, setComp] = useState<any>(null);
  const { state, dispatch } = React.useContext(AppContext);

  useEffect(() => {
    const { componentInfo, routeInfo } = props;
    dispatch({
      type: AppContextAction.layout,
      payload: { ...state.layout, routeOriginData: routeInfo },
    });
    let Comp;
    if (typeof componentInfo === 'function') {
      Comp = componentInfo;
    } else {
      Comp = lazy(() => {
        return new Promise(resolve => {
          setTimeout(() => resolve(import("../../../src" + componentInfo + "/index")), 100);
        });
      });
    }
    setComp(Comp);
  }, []);

  const render = () => {
    const Comp: any = comp;
    if (Comp) {
      return (
        <ErrorBoundary>
          <Suspense fallback={<Spin/>}>
            <div className={'fallback-fadein'}>
            <Comp {...props} />
            </div>
          </Suspense>
        </ErrorBoundary>
      );
    }
    return null;
  };
  return render();
};

const MemoAsyncComponent = memo(AsyncComponent);

export default MemoAsyncComponent;
