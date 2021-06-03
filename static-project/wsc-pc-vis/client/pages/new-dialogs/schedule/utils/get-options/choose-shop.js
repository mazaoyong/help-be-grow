import get from 'lodash/get';
import { getShopList } from '@ability-center/shop/shop-choose';
import { findPageByEduCourse } from '../../../../edu-admin/api/educourse';

export default function getShop(query, pageRequest) {
  const fetchApi = findPageByEduCourse({
    eduCourseShopQuery: {
      id: get(this.eduCourseId, 'eduCourseId'),
      name: query,
      kdtId: _global.kdtId,
    },
    pageRequest,
  });
  return getShopList({
    query,
    pageRequest,
    addAll: false,
    fetchApi: () => {
      return fetchApi;
    },
  });
}

// 异步校验属否含有 kdtId
export function asyncValidateKdtId(values, va) {
  return new Promise((resolve, reject) => {
    if (!va) {
      // eslint-disable-next-line prefer-promise-reject-errors
      reject('上课校区不能为空');
    }
    resolve(true);
  });
}
