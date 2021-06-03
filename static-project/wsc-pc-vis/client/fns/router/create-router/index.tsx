import React from 'react';
import {
  hashHistory,
  IndexRedirect,
  Redirect,
  RedirectFunction,
  Route,
  RouteProps,
  Router,
  RouterState,
} from 'react-router';

import { switchBreadcrumb } from './breadcrumb';
import { RouteErrorBoundary } from './route-error-boundary';

// 面包屑配置 breacrumb
export interface IVisBreadcrumb {
  project?: string | { name: string; href?: string };
  page?: string;
}

export interface IVisRoutes extends RouteProps {
  children?: IVisRoutes[]; // 子路由
  redirect?: string; // 重定向的路由
  index?: string; // IndexRedirect 子路由
  breadcrumb?: string | IVisBreadcrumb | ((nextState: RouterState) => string | IVisBreadcrumb);
  title?: string;
}

// render IndexRedirect 主路径
function renderIndexRedirect(index: string) {
  return <IndexRedirect key={index} to={index} />;
}

/**
 * 渲染路由
 */
export const renderRouter = (parentPath: string, routes: IVisRoutes[]) => {
  return routes.map((route, index) => {
    // 重定向路由
    if (typeof route.redirect === 'string') {
      return <Redirect key={index} from={route.path as string} to={route.redirect} />;
    }

    let wholePath = parentPath;
    // 拼接路由
    if (/^\//.test(route.path as string)) {
      wholePath = parentPath + route.path;
    } else {
      wholePath = `${parentPath}/${route.path}`;
    }

    function onEnter(
      nextState: RouterState,
      replace: RedirectFunction,
      callback?: (...args: any[]) => any,
    ) {
      // 切换面包屑
      if (typeof route.breadcrumb !== 'undefined') {
        let breadcrumb;
        if (typeof route.breadcrumb === 'function') {
          breadcrumb = route.breadcrumb(nextState);
        } else {
          breadcrumb = route.breadcrumb;
        }

        switchBreadcrumb(breadcrumb);
      }

      if (route.title) {
        document.title = route.title;
      }

      if (route.onEnter) {
        return route.onEnter(nextState, replace, callback);
      }
    }

    // 子路由
    if (route.children) {
      return (
        <Route key={index} {...route} onEnter={(...args) => onEnter(...args)}>
          {route.index && renderIndexRedirect(route.index)}
          {renderRouter(wholePath, route.children)}
        </Route>
      );
    }

    // 普通路由
    return <Route key={index} {...route} onEnter={(...args) => onEnter(...args)} />;
  });
};

// 创建路由
export function createRouter(routes: IVisRoutes[]): JSX.Element {
  return (
    <RouteErrorBoundary>
      <Router history={hashHistory}>{renderRouter('', routes)}</Router>
    </RouteErrorBoundary>
  );
}
