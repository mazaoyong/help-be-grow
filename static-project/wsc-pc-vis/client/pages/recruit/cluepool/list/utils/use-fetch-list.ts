import React from 'react';
import merge from 'lodash/merge';
import {
  findAllWithCount,
  findMineWithCount,
  findPoolWithCount,
  IBaseFetchListQuery,
  IBaseClueWithCountResponse,
} from '../../api/list';

export type CluePageType = 'all' | 'mine' | 'pool';
type useFetchListCallback = (
  query: IBaseFetchListQuery,
) => Promise<IBaseClueWithCountResponse<any>>;
const useFetchList = (): [useFetchListCallback, CluePageType] => {
  const locationMatcher = React.useMemo(() => location.href.match(/clue\/([^#/?&]*)/), []);
  const pageType = React.useMemo(() => (locationMatcher && locationMatcher[1]) || undefined, [
    locationMatcher,
  ]);

  const wrapperFindMineWithCount = React.useCallback(
    (params: IBaseFetchListQuery) =>
      findMineWithCount(
        merge({ clueInfoQuery: { ownerId: window._global.userId } } as IBaseFetchListQuery, params),
      ),
    [],
  );
  const fetchMethod = React.useMemo(() => {
    switch (pageType) {
      case 'all':
        return findAllWithCount;
      case 'mine':
        return wrapperFindMineWithCount;
      case 'pool':
        return findPoolWithCount;
      default:
        return () =>
          Promise.resolve({
            clues: {
              total: 0,
              content: [],
            },
            phaseCounts: [],
          });
    }
  }, [pageType, wrapperFindMineWithCount]);

  return [fetchMethod, pageType as CluePageType];
};

export default useFetchList;
