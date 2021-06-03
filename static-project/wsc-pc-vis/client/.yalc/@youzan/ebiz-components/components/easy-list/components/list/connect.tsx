import React from 'react';
import { IListContext } from '../../types/list';
import { ListContext } from './index';

export function connect<P extends Record<string, any>, Ref = any>(
  Component: React.ComponentType<
    P & {
      list: IListContext;
    }
  >
) {
  return React.forwardRef<Ref, P>(function EasyListConsumer(props, ref) {
    const context = React.useContext(ListContext);
    // listContext内部更新机制很差，在这个版本中没有应用重构版本，所以需要手动缓存
    const nextState = React.useMemo(() => context.state, [context.state]);
    const nextGState = React.useMemo(() => context.globalState, [context.globalState]);
    const nextActions = React.useMemo(() => context.action, [context.action]);
    return (
      <Component
        ref={ref}
        list={{ action: nextActions, state: nextState, globalState: nextGState }}
        {...props}
      />
    );
  });
}
