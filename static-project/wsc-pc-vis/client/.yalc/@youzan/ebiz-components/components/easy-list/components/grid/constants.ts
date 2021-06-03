import get from 'lodash/get';
import merge from 'lodash/merge';
import { IEasyGridProps } from '../../types/grid';

interface IEasyGridAdaptorQueries {
  // data
  datasets: any[];
  // page info
  pageNumber: number;
  pageSize: number;
  total: number;
  loading: boolean;
  sortBy: string | undefined;
  sortType: 'asc' | 'desc' | '';
  // select
  selectedRowKeys: string[];
}
interface IEasyGridAdaptorRes {
  queries: IEasyGridAdaptorQueries;
  setPage(p: number): void;
  setFilter(filter: Record<string, any>): void;
}
type EasyGridAdaptorType = (props: IEasyGridProps) => IEasyGridAdaptorRes;
/* istanbul ignore next */
const defaultFunc = () => void 0;
const defaultGridAdaptorRes: IEasyGridAdaptorRes = {
  queries: {
    datasets: [],
    pageNumber: 1,
    pageSize: 20,
    total: 0,
    loading: false,
    sortBy: undefined,
    sortType: '',
    selectedRowKeys: [],
  },
  setPage: defaultFunc,
  setFilter: defaultFunc,
};
export const adaptorConstructor: EasyGridAdaptorType = (props) => {
  const listState = get(props, 'list.state', {});
  const listGState = get(props, 'list.globalState', {});
  const listActions = get(props, 'list.action', {});
  const { page: pageNumber, loading, total, dataset, filter } = listState;
  const { pageSize, sortBy, sortType } = filter || {};
  const queries = merge({}, defaultGridAdaptorRes.queries, {
    pageNumber,
    pageSize,
    loading,
    total,
    datasets: dataset,
    selectedRowKeys: listGState.selectedRowKeys || [],
    sortType,
    sortBy,
  });
  return {
    queries,
    setPage: listActions.setPage || defaultGridAdaptorRes.setPage,
    setFilter: listActions.setFilter || defaultGridAdaptorRes.setFilter,
  };
};

export const CUSTOM_COLUMNS_KEY = '$$EASY_GRID_CUSTOM_COLUMNS';
export const CUSTOM_COLUMNS_DIALOG_ID = 'easyGridCustomColumns';
