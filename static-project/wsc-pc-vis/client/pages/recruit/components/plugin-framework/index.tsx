import React, { ReactElement, ComponentType } from 'react';
import { hashHistory, Router, Redirect, Route } from 'react-router';
import Aside from './aside';
import { isNil } from 'lodash';

import './index.scss';
import { switchBreadcrumb } from 'fns/router/create-router/breadcrumb';

interface IPluginFrameworkProps {
  title: string;
  BootPage: ReactElement;
  enabled: boolean;
  children: ReactElement;
  menus: any[];
}

export default function PluginFramework({ children, enabled, title, BootPage, ...restProps }: IPluginFrameworkProps) {
  if (enabled) {
    if (!window._global.pluginEnabled) {
      return BootPage;
    }
    return (
      <>
        <div className="edu-plugin-framework-title">{title}</div>
        <div className="edu-plugin-framework">
          <Aside {...restProps} />
          <div className="edu-plugin-framework-container">
            {children}
          </div>
        </div>
      </>
    );
  }
  return children;
}

interface ICreatePluginFrameworkRouterProps {
  title: string;
  enabled: boolean;
  routes: any[];
  menus: any[];
  BootPage: ReactElement;
}

export function createPluginFrameworkRouter(config: ICreatePluginFrameworkRouterProps) {
  function renderRoute({ redirect, path, component: Comp, breadcrumb, ...restProps }, key: number) {
    if (redirect) {
      return (
        <Redirect
          key={key}
          from={path}
          to={redirect}
        />
      );
    }

    function WrappedComp(props: any) {
      return (
        <PluginFramework {...config}>
          <Comp {...props} />
        </PluginFramework>
      );
    }

    function onBreadcrumbEnter() {
      if (!isNil(breadcrumb)) {
        switchBreadcrumb(breadcrumb);
      }
    }

    return (
      <Route
        key={key}
        path={path}
        component={WrappedComp}
        onEnter={onBreadcrumbEnter}
        {...restProps}
      />
    );
  }

  return (
    <Router history={hashHistory}>
      {config.routes.map(renderRoute)}
    </Router>
  );
}

export const createPluginWrapper = (config: any) => (Comp: ComponentType) => {
  return function WrappedComp(props: any) {
    return (
      <PluginFramework {...config}>
        <Comp {...props} />
      </PluginFramework>
    );
  };
};
