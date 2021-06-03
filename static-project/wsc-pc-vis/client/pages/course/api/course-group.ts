import { visAjax } from 'fns/new-ajax';

// 分页数量
export const MAX_GROUP_PAGE = 200;

// 最多分组数量
export const MAX_GROUP_COUNT = 50000;

interface IFetchCourseGroupRequest {
  pageNumber: number;
  pageSize: number;
  type: number;
  keyword: string | null;
}

// 保存分组
export function createCourseGroup(payload) {
  return visAjax('POST', '/course-group/_textarea_/create.json', payload);
};

// 更新分组
export function updateCourseGroup(payload) {
  return visAjax('POST', '/course-group/_textarea_/update.json', payload);
};

// 获取分组详情
export function getCourseGroup(payload) {
  return visAjax('GET', '/course-group/detail.json', payload);
};

// 获取分组列表
export const getCourseGroupList = (params: IFetchCourseGroupRequest) => {
  return visAjax('GET', '/edu/page/courseGroup/list.json', params);
};

// 获取全部课程分组
export const getAllCourseGroup = (keyword) => {
  return getCourseGroupList({
    pageNumber: 1,
    pageSize: MAX_GROUP_COUNT,
    type: 0,
    keyword,
  });
};

// 分页获取课程分组
export const getCourseGroupPage = (pageNumber = 1, keyword) => {
  return getCourseGroupList({
    pageNumber,
    pageSize: MAX_GROUP_PAGE,
    type: 0,
    keyword,
  });
};
