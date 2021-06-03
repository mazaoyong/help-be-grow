import pick from 'lodash/pick';
import isEqual from 'lodash/isEqual';
import { IListContext, IPageInfo } from '../../../types/list';
import { Dispatcher, FunctionType } from './dispatcher';
import { QueryManager } from './query-manager';
import merge from 'lodash/merge';

type FilterState = Omit<IListContext['state'], 'dataset' | 'loading'>;
export class FilterManager {
  private queryManger: QueryManager;
  private dispatcher: Dispatcher;
  pageInfo: IPageInfo;
  state: FilterState;
  globalState: IListContext['globalState'];

  constructor(queryManager: QueryManager) {
    this.queryManger = queryManager;
    this.dispatcher = new Dispatcher();
    this.globalState = {};
    this.pageInfo = { ...pickPageAndSize(queryManager.queries), total: 0 };
    this.state = convertQuery2state(queryManager.queries, this.pageInfo.total);
  }

  subscribe = (effect: FunctionType) => {
    return this.dispatcher.subscribe(effect);
  };

  next = () => {
    return this.dispatcher.next();
  };

  updateState = (nextState: Record<string, any>) => {
    const isUpdate = this.queryManger.updateQueryAndUrl(nextState);
    if (isUpdate) {
      const nextQuery = this.queryManger.queries;
      this.state = convertQuery2state(nextQuery, this.pageInfo.total);
      this.pageInfo = merge({}, this.pageInfo, pickPageAndSize(nextQuery));
      this.dispatcher.next();
    }
  };
  setFilter = this.updateState;
  setPageInfo = (nextPageInfo: Partial<IPageInfo>) => {
    const updatePageInfo = merge({}, this.pageInfo, nextPageInfo);
    const isUpdate = !isEqual(updatePageInfo, this.pageInfo);
    if (isUpdate) {
      this.pageInfo = updatePageInfo;
      this.state.total = updatePageInfo.total;
      this.updateState(pickPageAndSize(updatePageInfo));
    }
  };
  setPage = (page: number) => {
    this.setPageInfo({ page });
  };

  setGlobalState = (nextGlobalState: Record<string, any>) => {
    const updateGlobalState = {
      ...this.globalState,
      ...nextGlobalState,
    };
    if (!isEqual(this.globalState, updateGlobalState)) {
      this.globalState = updateGlobalState;
      // global state不会触发下一次更新，比如grid会用来记录selectedRowKeys?
      // this.dispatcher.next();
    }
  };
}

function convertQuery2state(query: Record<string, any>, total: number): FilterState {
  const { page, pageSize, ...restQuery } = query;
  const filter = {
    ...restQuery,
    pageSize,
  };
  return {
    page,
    filter,
    total,
  };
}

function pickPageAndSize(data: any) {
  return pick(data, ['page', 'pageSize']);
}
