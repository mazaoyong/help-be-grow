import { useUpdateTimes } from '../../../../utils/use-update-times';
import React from 'react';
import { Notify } from 'zent';
import { IListContext, IListProps } from '../../../types/list';
import { FilterManager } from '../utils/filter-manager';
import { QueryManager } from '../utils/query-manager';

const defaultInternalState = {
  loading: false,
  dataset: [] as any[],
};
type InternalStateType = typeof defaultInternalState;
type PartialInternalState = Partial<InternalStateType>;
export const useList = (params: IListProps): IListContext => {
  useUpdateTimes(true, 'easy-list');
  const {
    defaultFilter,
    delay,
    fetchInInit = true,
    filterNormalizer,
    mode,
    onError,
    onSubmit,
  } = params;
  const [dumpFilter] = React.useState(defaultFilter);
  const [internalState, updateInternalState] = React.useState(defaultInternalState);
  const internalStateUpdateProxy = React.useCallback(
    (nextState: PartialInternalState) => updateInternalState((prev) => ({ ...prev, ...nextState })),
    []
  );
  const errorHandler = React.useCallback((err: any) => errorWrapper(err, onError), [onError]);

  const queryManager = React.useMemo(() => new QueryManager(mode, dumpFilter, filterNormalizer), [
    mode,
    dumpFilter,
    filterNormalizer,
  ]);
  const filterManager = React.useMemo(() => new FilterManager(queryManager), [queryManager]);

  const delayRef = React.useRef<number | null>(null);
  const fetchData = React.useCallback(() => {
    const currentState = filterManager.state;
    const currentGlobalState = filterManager.globalState;
    try {
      onSubmit(
        {
          ...currentState.filter,
          page: currentState.page,
        },
        currentGlobalState
      )
        .then((res) => {
          const { dataset, pageInfo } = res;
          filterManager.setPageInfo(pageInfo);
          internalStateUpdateProxy({ dataset, loading: false });
        })
        .catch((err) => {
          errorHandler(err);
          internalStateUpdateProxy({ loading: false });
        });
    } catch (err) {
      errorHandler(err);
      internalStateUpdateProxy({ loading: false });
    }
  }, [errorHandler, filterManager, internalStateUpdateProxy, onSubmit]);
  const fetchDataWrapper = React.useCallback(() => {
    internalStateUpdateProxy({ loading: true });
    if (delay && delay > 0) {
      if (delayRef.current) {
        clearTimeout(delayRef.current);
      }
      delayRef.current = (setTimeout(fetchData, delay) as unknown) as number;
      return;
    }
    fetchData();
  }, [delay, fetchData, internalStateUpdateProxy]);

  const updateLoading = React.useCallback(
    (nextState: boolean) => () => internalStateUpdateProxy({ loading: nextState }),
    [internalStateUpdateProxy]
  );
  const updateDataset = React.useCallback(
    (nextDataset: any[]) => internalStateUpdateProxy({ dataset: nextDataset }),
    [internalStateUpdateProxy]
  );

  React.useEffect(() => {
    filterNormalizer && queryManager.setFilterNormalizer(filterNormalizer);
  }, [filterNormalizer, queryManager]);

  React.useEffect(() => filterManager.subscribe(fetchDataWrapper), [
    fetchDataWrapper,
    filterManager,
  ]);

  // 初次获取需要主动触发一下
  React.useEffect(() => {
    if (fetchInInit) {
      filterManager.next();
    }
  }, [fetchInInit, filterManager]);

  const memoActs = React.useMemo(
    () => ({
      setPage: filterManager.setPage,
      setFilter: filterManager.setFilter,
      setGlobalState: filterManager.setGlobalState,
      setLoading: updateLoading(true),
      stopLoading: updateLoading(false),
      setDataset: updateDataset,
      refresh: fetchDataWrapper,
    }),
    [
      fetchDataWrapper,
      filterManager.setFilter,
      filterManager.setGlobalState,
      filterManager.setPage,
      updateDataset,
      updateLoading,
    ]
  );

  return {
    action: memoActs,
    state: {
      ...filterManager.state,
      ...internalState,
    },
    globalState: filterManager.globalState,
  };
};

function errorWrapper(err: string | Error, customErrorHandler?: (err: Error) => void) {
  const errObj = err instanceof Error ? err : /* istanbul ignore next */ new Error(err);
  if (customErrorHandler !== undefined) customErrorHandler(errObj);
  /* istanbul ignore next */ else Notify.error(errObj.message);
}
