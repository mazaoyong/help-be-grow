import { useState, useEffect, useCallback, useMemo } from 'react';
import ajax from 'fns/ajax';

interface IGetListReturn {
  total: number;
  listData: any[];
}

interface IFilter {
  pageSize: number;
  [propName: string]: any;
}

interface IQuery {
  [propName: string]: any;
  page?: string;
}

type IFormatParamsFn = (page: number, filter: IFilter) => any;
type IFormatDataFn = (data: any) => IGetListReturn;
type IHistoryFn = (page: number, filter: IFilter) => any;

interface IListParams {
  url?: string;
  getData?: (params: any) => Promise<void>;
  formatParams?: IFormatParamsFn;
  formatData?: IFormatDataFn;
  defaultFilter: IFilter;
  history?: IHistoryFn | boolean;
  query?: IQuery;
}

function buildUrl(query: any): string {
  const path = window.location.pathname;
  const qs = Object.keys(query).map(key => {
    return `${key}=${query[key]}`;
  }).join('&');
  return `${path}?${qs}`;
}

function setHistory(query: any): void {
  const url = buildUrl(query);
  history.replaceState(null, '', url);
}

const defaultFormatParamsFn: IFormatParamsFn = (page, filter) => {
  return {
    ...filter,
    page,
  };
};

const defaultFormatDataFn: IFormatDataFn = data => {
  const { total, listData } = data;
  return {
    total,
    listData,
  };
};

const defaultHistoryFn: IHistoryFn = (page, filter) => ({
  ...filter,
  page,
});

function usePagination(defaultPage) {
  const [page, set] = useState(defaultPage);
  const [total, setTotal] = useState(0);
  const [pageVer, setPageVer] = useState(0);
  const setPage = useCallback(
    p => {
      set(p);
      setPageVer(pageVer + 1);
    },
    [page, pageVer],
  );
    
  return {
    page,
    setPage,
    total,
    setTotal,
    pageVer,
  };
}

function useListData() {
  const [listData, setListData] = useState([]);
  return {
    listData,
    setListData,
  };
}

function useFilter(mixFilter) {
  const [filter, set] = useState(mixFilter);
  const [filterVer, setFilterVer] = useState(0);
  const setFilter = nextFilter => {
    set({
      ...filter,
      ...nextFilter,
    });
    setFilterVer(filterVer + 1);
  };
  return {
    filter,
    setFilter,
    filterVer,
  };
}

function useLoading() {
  const [loading, set] = useState(true);
  const setLoading = useCallback(
    () => {
      set(true);
    },
    [],
  );
  const stopLoading = useCallback(
    () => {
      set(false);
    },
    [],
  );
  return {
    loading,
    setLoading,
    stopLoading,
  };
}

function useList(params: IListParams) {
  const {
    url,
    getData,
    formatParams = defaultFormatParamsFn,
    formatData = defaultFormatDataFn,
    history,
    defaultFilter,
    query,
  } = params;
  const defaultPage = query && query.page ? +query.page : 1;
  const { page, setPage, total, setTotal, pageVer } = usePagination(defaultPage);
  const { listData, setListData } = useListData();
  const { filter, setFilter, filterVer } = useFilter({
    ...defaultFilter,
    ...query,
  });
  const { loading, setLoading, stopLoading } = useLoading();
  const historyFn = useMemo(() => {
    if (history === false) return null;
    if (typeof history !== 'function') {
      return defaultHistoryFn;
    }
    return history;
  }, [history]);
  const fetchList = () => {
    setLoading();
    if (historyFn) {
      const historyQuery = historyFn(page, filter);
      setHistory(historyQuery);
    }
    let p;
    const ajaxParams = formatParams(page, filter);
    if (getData) {
      p = getData(ajaxParams);
    } else {
      p = ajax(url, {
        data: ajaxParams,
      });
    }
    p.then(data => {
      const { listData, total } = formatData(data);
      stopLoading();
      setListData(listData as any);
      setTotal(total);
    }).catch(() => {
      stopLoading();
    });
  };
  useEffect(() => {
    fetchList();
  }, [pageVer]);
  useEffect(() => {
    if (filterVer > 0) {
      setPage(1);
    }
  }, [filterVer]);
  return {
    page,
    total,
    listData,
    pageSize: filter.pageSize,
    filter,
    loading,
    setFilter,
    setPage,
  };
}

export default useList;
