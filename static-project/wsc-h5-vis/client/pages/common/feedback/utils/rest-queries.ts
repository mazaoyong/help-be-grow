import qs from 'qs';
import { omit } from 'lodash';

import { LOG_AUTOMATICALLY } from './check-auto-logger';

export function getRestQueries() {
  const restQueries = qs.parse(window.location.search, { ignoreQueryPrefix: true });
  const queries = Object.assign({ referrer: document.referrer || 'unknown' }, omit(restQueries, LOG_AUTOMATICALLY));
  return queries;
}
