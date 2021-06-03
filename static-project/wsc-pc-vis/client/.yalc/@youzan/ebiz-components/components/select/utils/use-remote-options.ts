import React from 'react';
import { Notify } from 'zent';
import isNumber from 'lodash/isNumber';

import { IUseRemoteOptionsSettings, IUseRemoteOptionsRes, IPageRequest } from '../types';

const DEFAULT_PAGE_REQUEST: IPageRequest = { current: 1, pageSize: 20, total: 0 };
enum ERRORS {
  NO_OPTION = '[illegal response]response should have options property',
  NO_TOTAL = '[illegal response]response should have total in pageInfo property',
}

type PassiveOptionsType = IUseRemoteOptionsRes['remoteOptions'];
interface IFetchOptionsState {
  options: PassiveOptionsType;
  pageRequest: IPageRequest;
}
interface IUseRemoteOptsCache {
  pageInfo: any;
  options: any[];
}
const useRemoteOptions = (params: IUseRemoteOptionsSettings): IUseRemoteOptionsRes => {
  const { fetchOptions, useFilterCache = false } = params;
  const [loading, setLoading] = React.useState(false);
  const [passiveOptions, setOptions] = React.useState<PassiveOptionsType>([]);
  const [pageRequest, setPageRequest] = React.useState<IPageRequest>(DEFAULT_PAGE_REQUEST);
  // cached
  const cachedData = React.useRef<IUseRemoteOptsCache | null>(null);

  const requestOptions = React.useCallback(
    (keyword: string, state: IFetchOptionsState) => {
      const { options: curOptions, pageRequest: curPageRequest } = state;
      setLoading(true);
      fetchOptions(keyword || '', curPageRequest)
        .then((data: any) => {
          const { options, pageInfo } = data;
          if (!options) throw new Error(ERRORS.NO_OPTION);

          const { total, current } = pageInfo;
          if (!isNumber(total)) throw new Error(ERRORS.NO_TOTAL);

          const currentOption = current === 1 ? options : curOptions.concat(options);
          setOptions(currentOption);

          pageInfo.current += 1;
          setPageRequest({ ...curPageRequest, ...pageInfo });
        })
        .catch((err: Error) => Notify.error(err && err.message))
        .finally(() => {
          setLoading(false);
        });
    },
    [fetchOptions]
  );

  const fetchNow = React.useCallback(
    (reset: boolean = false, keyword: string) => {
      if (loading) {
        return null;
      }
      if (reset) {
        requestOptions(keyword, {
          options: [],
          pageRequest: DEFAULT_PAGE_REQUEST,
        });
        return;
      }

      const isInitFetch = !loading && pageRequest.total === 0;
      const isStillHaveOptions = passiveOptions.length < pageRequest.total;
      if (!(isInitFetch || isStillHaveOptions)) {
        return;
      }
      requestOptions(keyword, {
        options: passiveOptions,
        pageRequest,
      });
    },
    [loading, pageRequest, passiveOptions, requestOptions]
  );

  const setOptionCache = React.useCallback(
    (cleanPrevCache: boolean) => {
      if (useFilterCache) {
        if (!cleanPrevCache) {
          cachedData.current = {
            options: passiveOptions,
            pageInfo: pageRequest,
          };
        } else {
          if (cachedData.current) {
            setOptions(cachedData.current.options);
            setPageRequest(cachedData.current.pageInfo);
          }
          cachedData.current = null;
        }
      }
    },
    [pageRequest, passiveOptions, useFilterCache]
  );

  return {
    loading,
    fetchNow,
    setOptionCache,
    remoteOptions: passiveOptions,
  };
};

export default useRemoteOptions;
