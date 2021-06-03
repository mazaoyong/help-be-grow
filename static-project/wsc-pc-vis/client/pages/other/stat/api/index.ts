import { visAjax } from 'fns/new-ajax';

// 查询线索来源分组（带二级线索详情）
export function findSourceGroupPageAPI(data) {
  return visAjax('GET', '/edu/clue/findSourceGroupPage.json', data);
}

// 查询线索来源分组
export function findSourceGroupListAPI(data) {
  return visAjax('GET', '/edu/clue/findSourceGroupList.json', data);
}

// 获取连锁总部下面所有的子店铺
export function findListAllCampusAPI() {
  return visAjax('GET', '/commom/shop/findListAllCampus.json', {});
}

// 教育课程分页查询
export function getEduCourseListAPI(data) {
  return visAjax('GET', '/edu/eduCourse/getEduCourseList.json', data);
}
