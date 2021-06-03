import React from 'react';
import { WithRouterProps, PlainRoute } from 'react-router';
import { Params } from 'react-router/lib/Router';

export interface IVisRouterProps extends WithRouterProps {
  children: React.ReactNode | null;
  route: PlainRoute;
  routeParams: Params;
};
