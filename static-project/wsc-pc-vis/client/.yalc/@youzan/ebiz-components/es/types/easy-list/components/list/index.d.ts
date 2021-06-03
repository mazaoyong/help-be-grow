import React from 'react';
import { IListProps, IListContext } from '../../types/list';
import { useList } from './hooks/use-list';
export { connect } from './connect';
declare const ListContext: React.Context<IListContext>;
export declare const List: React.ForwardRefExoticComponent<IListProps & {
    children: React.ReactNode;
} & React.RefAttributes<IListContext>>;
export { useList, ListContext };
