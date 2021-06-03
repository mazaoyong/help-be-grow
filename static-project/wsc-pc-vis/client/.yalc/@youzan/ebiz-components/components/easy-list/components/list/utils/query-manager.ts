import qs from 'qs';
import merge from 'lodash/merge';
import forEach from 'lodash/forEach';
import isEqual from 'lodash/isEqual';
import { FilterNormalizerType, HistoryModeType, IListQuery } from '../../../types/list';

const getUrlCollection: Record<HistoryModeType, () => string> = {
  hash() {
    // 如果是hash模式，获取参数的方式是从hash获取
    const hash = window.location.hash;
    const matched = hash.match(/#\/.*\?(.*)$/);
    if (matched) {
      return matched[1];
    }
    /* istanbul ignore next */
    return '';
  },
  browser() {
    return window.location.search.slice(1);
  },
  none() {
    return '';
  },
};

function getUrlPrefix(mode: HistoryModeType) {
  const { pathname, search, hash } = window.location;
  let hashWithoutQuery = '#/';
  if (hash) {
    const queryStart = hash.indexOf('?');
    hashWithoutQuery = queryStart === -1 ? hash : hash.substring(0, queryStart);
  }
  if (mode === 'browser') {
    return pathname;
  }
  return `${pathname}${search}${hashWithoutQuery}`;
}

const getPresetQuery = (): IListQuery => ({
  page: 1,
  pageSize: 20,
});
export class QueryManager {
  private mode: HistoryModeType;
  private filterNormalizer: FilterNormalizerType | null = null;
  public queries: IListQuery = {};
  constructor(
    mode: HistoryModeType = 'browser',
    defaultFilter: IListQuery = {},
    normalizer: FilterNormalizerType | undefined
  ) {
    this.mode = mode;
    if (normalizer) {
      this.filterNormalizer = normalizer;
    }
    const search = getUrlCollection[mode]();
    const urlQueries = qs.parse(search);
    const initialQueries = merge(getPresetQuery(), defaultFilter, numberingPageInfo(urlQueries));
    this.updateQueryAndUrl(initialQueries);
  }
  private updateQuery = (query: IListQuery) => {
    const brandNewQueries = merge({}, this.queries, query);
    const updateQueries = this.filterNormalizer
      ? this.filterNormalizer(brandNewQueries)
      : brandNewQueries;
    const isUpdate = !isEqual(this.queries, updateQueries);
    if (isUpdate) this.queries = updateQueries;
    return isUpdate;
  };

  updateQueryAndUrl = (query: Record<string, any>) => {
    const isUpdate = this.updateQuery(query);
    if (this.mode !== 'none') {
      const queryString = qs.stringify(this.queries);
      const urlPrefix = getUrlPrefix(this.mode);
      history.replaceState(null, '', `${urlPrefix}?${queryString}`);
    }
    return isUpdate;
  };

  setFilterNormalizer(normalizer: FilterNormalizerType) {
    this.filterNormalizer = normalizer;
  }
}

function numberingPageInfo(urlQueries: Record<string, any>) {
  forEach(['page', 'pageSize'], (key) => {
    const newValue = numberingValue(urlQueries[key]);
    if (newValue !== null) urlQueries[key] = newValue;
  });
  return urlQueries;
}

function numberingValue(maybeNumber: any): any {
  if (maybeNumber === undefined) return null;
  const value = Number(maybeNumber);
  return isNaN(value) ? maybeNumber : value;
}
