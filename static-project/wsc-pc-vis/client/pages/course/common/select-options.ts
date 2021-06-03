import { Notify } from 'zent';
import { IPageRequest } from '@youzan/ebiz-components/es/types/select';
import { getCourseGroupPage, MAX_GROUP_PAGE } from '../api/course-group';

// ebiz-components/select的fetchOptions参数，用于异步获取课程分组填充数据
export const getFetchCourseGroupOptions:
(showAll: boolean, toString: boolean) => (_query, pageRequest: IPageRequest) => Promise<any> =
(showAll = false, toString = false) => (_query, pageRequest) => {
  const { current } = pageRequest;
  return getCourseGroupPage(current, _query).then(res => {
    const { content, pageable, total } = res;
    const { pageNumber } = pageable;
    const initGroupList = showAll ? [{ text: '全部', value: '-1' }] : [];
    let options = content.map(({ title, groupId }) => {
      return {
        text: title,
        value: toString ? groupId.toString() : groupId,
      };
    });
    if (pageNumber === 1) {
      options = initGroupList.concat(options);
    }
    return {
      options: options,
      pageInfo: {
        current: pageNumber,
        total,
        pageSize: MAX_GROUP_PAGE,
      },
    };
  }).catch(err => {
    Notify.error(err);
  });
};

// 包含全部筛选项，将groupId转化为string类型，在列表页面easy-list使用
export const fetchAllCourseGroupOptions = getFetchCourseGroupOptions(true, true);

// 不包含全部筛选项，不转化groupId为string类型，在编辑页面课程分组select组件使用
export const fetchCourseGroupOptions = getFetchCourseGroupOptions(false, false);
