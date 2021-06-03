import { RouteComponentProps } from 'react-router';

declare global {
  /** 为内置Router的组件包裹Props定义 */
  type ROUTER<PROPS, Params = {}, RouterParams = {}> = PROPS &
    RouteComponentProps<RouterParams, Params>;

  type ROUTER_PROPS_KEY = keyof RouteComponentProps<{}, {}>;
}
