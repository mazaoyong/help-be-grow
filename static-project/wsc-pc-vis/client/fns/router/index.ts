import type { WithRouterProps, RouteProps } from 'react-router';

export * from './create-router';
export * from './vis-button';
export * from './vis-link';
export * from './vis-push';
export * from './vis-router-props';

export type PageRouterWrapper<PageProps = {}> = PageProps &
WithRouterProps & {
  route: RouteProps;
};
export type PartOfRouterWrapper<K extends keyof PageRouterWrapper, P> = Pick<PageRouterWrapper, K> & P;
