import { visAjax } from 'fns/new-ajax';
export const getCourseGroupList = (params) => {
  return visAjax('GET', '/edu/page/courseGroup/list.json', params);
};

export const getQrCodeByGroupAlias = (alias) => {
  return visAjax('GET', '/edu/page/courseGroup/getQrCode.json', { alias });
};

export const deleteGroupById = (groupId) => {
  return visAjax('POST', '/edu/page/courseGroup/deleteGroup.json', { groupId });
};

export const getCourseByGroupId = (params) => {
  return visAjax('GET', '/edu/page/courseGroup/getCourseListByGroup.json', params);
};

export const getCourseList = (params) => {
  return visAjax('GET', '/edu/page/courseGroup/getCourseList.json', params);
};

export const addCourseToGroup = ({ groupId, itemIds }) => {
  return visAjax('POST', '/edu/page/courseGroup/addCourseToGroup.json', { groupId, itemIds });
};

export const removeCourseFromGroup = ({ groupId, itemIds }) => {
  return visAjax('POST', '/edu/page/courseGroup/removeCourseFromGroup.json', { groupId, itemIds });
};

export const batchModifyCourseGroup = ({ groupIds, itemIds }) => {
  return visAjax('POST', '/edu/page/courseGroup/batchModifyCourseGroup.json', { groupIds, itemIds });
};
