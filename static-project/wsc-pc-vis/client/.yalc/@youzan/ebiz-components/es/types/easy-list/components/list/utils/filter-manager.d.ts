import { IListContext, IPageInfo } from '../../../types/list';
import { QueryManager } from './query-manager';
declare type FilterState = Omit<IListContext['state'], 'dataset' | 'loading'>;
export declare class FilterManager {
    private queryManger;
    private dispatcher;
    pageInfo: IPageInfo;
    state: FilterState;
    globalState: IListContext['globalState'];
    constructor(queryManager: QueryManager);
    subscribe: (effect: {
        (): void;
        (arg: any): void;
        (...args: any[]): void;
    }) => () => void;
    next: () => void;
    updateState: (nextState: Record<string, any>) => void;
    setFilter: (nextState: Record<string, any>) => void;
    setPageInfo: (nextPageInfo: Partial<IPageInfo>) => void;
    setPage: (page: number) => void;
    setGlobalState: (nextGlobalState: Record<string, any>) => void;
}
export {};
