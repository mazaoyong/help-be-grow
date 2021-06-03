import React from 'react';
import { IListProps, IListContext } from '../../types/list';

import { useList } from './hooks/use-list';
export { connect } from './connect';

const ListContext = React.createContext<IListContext>({} as IListContext);
export const List = React.forwardRef<
  IListContext,
  IListProps & {
    children: React.ReactNode;
  }
>(function EasyListProvider(props, ref) {
  const { children, ...restProps } = props;
  const listContext = useList(restProps);
  React.useImperativeHandle(ref, () => listContext);

  return <ListContext.Provider value={listContext}>{children}</ListContext.Provider>;
});
export { useList, ListContext };
