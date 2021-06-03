import qs from 'qs';
import { useMemo } from 'react';

const useCampusQuery = (query: any) => {
  // 在使用campusKdtId中，如果没有kdtId应该去掉这玩意，使用qs包解析参数会自动去掉没有的参数
  const passiveQueries = useMemo(() => qs.parse(qs.stringify(query)), [query]);

  return passiveQueries;
};

export default useCampusQuery;
