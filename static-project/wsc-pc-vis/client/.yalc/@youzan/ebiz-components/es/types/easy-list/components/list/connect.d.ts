import React from 'react';
import { IListContext } from '../../types/list';
export declare function connect<P extends Record<string, any>, Ref = any>(Component: React.ComponentType<P & {
    list: IListContext;
}>): React.ForwardRefExoticComponent<React.PropsWithoutRef<P> & React.RefAttributes<Ref>>;
