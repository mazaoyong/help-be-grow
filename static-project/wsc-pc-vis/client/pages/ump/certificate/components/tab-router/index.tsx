import React, { PureComponent } from 'react';
import { Tabs } from 'zent';
import {
  Router,
  hashHistory,
  Route,
  Redirect,
  RouteComponent,
  WithRouterProps,
  withRouter,
} from 'react-router';
import { switchBreadcrumb } from 'fns/router/create-router/breadcrumb';

const TabPanel = Tabs.TabPanel;

interface IRoutePartial {
  path: string;
  meta?: object;
}

interface IRoute extends IRoutePartial {
  component: RouteComponent;
  breadcrumb?: string;
  onEnter?: any;
  meta: {
    title?: string;
    visible?: boolean;
  };
}

interface IRedirect extends IRoutePartial {
  redirect: string;
}

export type IRouteTabsProps = Array<IRoute | IRedirect>;

export default function createRouteTabs(routes: IRouteTabsProps) {
  if (!Array.isArray(routes)) {
    throw new Error('The parameter must be a array.');
  }

  return <Router history={hashHistory}>{createRoutes(routes)}</Router>;
}

function createRoutes(routes: Array<IRoute | IRedirect>) {
  const navs = routes
    .filter((route: any) => route.hasOwnProperty('component') && (route.meta || {}).visible !== false)
    .map(route => ({
      id: route.path,
      tab: (route.meta as any).title,
    }));

  return routes.map((route, index) => {
    if (route.hasOwnProperty('component')) {
      // 增加导航栏
      const _route = route as IRoute;
      let component: RouteComponent;
      if (_route.meta.visible === false) {
        component = _route.component;
      } else {
        component = decorateCompWithRoute(route as IRoute, navs);
      }

      // 切换面包屑
      const onEnter = () => {
        if (typeof _route.breadcrumb !== 'undefined') {
          switchBreadcrumb(_route.breadcrumb);
        }
      };
      return (
        <Route
          key={index}
          path={route.path}
          component={component}
          onEnter={onEnter}
        />
      );
    }
    if (route.hasOwnProperty('redirect')) {
      return <Redirect key={index} from={route.path} to={(route as IRedirect).redirect} />;
    }
    throw new Error('Component or redirect are required.');
  });
}

function decorateCompWithRoute(route: IRoute, navs: any[]): React.ComponentClass<any> {
  const { component: InnerComp } = route;
  class Comp extends PureComponent<WithRouterProps> {
    render() {
      const path = (this.props.routes && this.props.routes[0] && this.props.routes[0].path) || '';
      return (
        <div>
          <Tabs
            type="card"
            activeId={path}
            className="edu-signin-tabs"
            onChange={this.onTabChange}
          >
            {navs.map((nav, index) => (
              <TabPanel key={index} {...nav}>
                <InnerComp />
              </TabPanel>
            ))}
          </Tabs>
        </div>
      );
    }
    onTabChange = (path: string | number) => {
      this.props.router.push(path as string);
    };
  }
  return withRouter(Comp);
}
